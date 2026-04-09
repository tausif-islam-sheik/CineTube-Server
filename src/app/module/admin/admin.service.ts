/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  CreateAdminInput,
  UpdateUserInput,
  DeleteUserInput,
} from './admin.validation';
import { IAdminService } from './admin.interface';

export class AdminService implements IAdminService {
  /**
   * Get all users (admin view)
   */
  async getAllUsers(
    limit: number = 20,
    page: number = 1,
    role?: string,
    status?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (role) whereClause.role = role;
      if (status) whereClause.status = status;

      const [total, users] = await Promise.all([
        prisma.user.count({ where: whereClause }),
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { [sortBy]: order as any },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            _count: {
              select: {
                reviews: true,
                subscriptions: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: users,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch users');
    }
  }

  /**
   * Get a single user
   */
  async getUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          sessions: {
            select: {
              id: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              comments: true,
              likes: true,
              watchlists: true,
              subscriptions: true,
              payments: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch user');
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(input: UpdateUserRoleInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });

      // Log action
      await this.logAdminAction(adminId, `Changed role to ${input.role}`, input.userId);

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update user role');
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(input: UpdateUserStatusInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { status: input.status },
      });

      // Log action
      await this.logAdminAction(adminId, `Changed status to ${input.status}`, input.userId);

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update user status');
    }
  }

  /**
   * Promote user to admin
   */
  async promoteToAdmin(input: CreateAdminInput, adminId: string) {
    try {
      let user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Create new admin user (email only)
        const { v4: uuidv4 } = require('uuid');
        user = await prisma.user.create({
          data: {
            id: uuidv4(),
            email: input.email,
            name: input.name || input.email.split('@')[0],
            role: 'ADMIN',
            status: 'ACTIVE',
            emailVerified: true,
          },
        });
      } else if (user.role === 'ADMIN') {
        throw new AppError(400, 'User is already an admin');
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        });
      }

      // Log action
      await this.logAdminAction(adminId, `Promoted user to ADMIN`, user.id);

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to promote user');
    }
  }

  /**
   * Update user info (admin can update any user)
   */
  async updateUser(input: UpdateUserInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: {
          name: input.name,
        },
      });

      // Log action
      await this.logAdminAction(adminId, 'Updated user info', input.userId);

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update user');
    }
  }

  /**
   * Delete a user (soft delete)
   */
  async deleteUser(input: DeleteUserInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const deleted = await prisma.user.update({
        where: { id: input.userId },
        data: {
          isDeleted: true,
          status: 'DELETED',
        },
      });

      // Log action
      await this.logAdminAction(adminId, `Deleted user - Reason: ${input.reason || 'No reason provided'}`, input.userId);

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete user');
    }
  }

  /**
   * Get admin action log
   */
  async getAdminLog(limit: number = 50, page: number = 1) {
    try {
      // AdminActionLog not implemented yet
      return {
        data: [],
        pagination: { total: 0, page, limit, pages: 0 },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch admin log');
    }
  }

  /**
   * Get system health/status
   */
  async getSystemHealth() {
    try {
      const [userCount, movieCount, reviewCount, paymentCount] = await Promise.all([
        prisma.user.count(),
        prisma.movie.count(),
        prisma.review.count(),
        prisma.payment.count(),
      ]);

      return {
        status: 'healthy',
        timestamp: new Date(),
        database: {
          users: userCount,
          movies: movieCount,
          reviews: reviewCount,
          payments: paymentCount,
        },
      };
    } catch (error) {
      throw new AppError(500, 'System health check failed');
    }
  }

  /**
   * Private method to log admin actions
   */
  private async logAdminAction(adminId: string, action: string, targetUserId?: string) {
    try {
      // AdminActionLog not implemented yet - log only to console
      console.log(`[ADMIN_ACTION] ${adminId}: ${action}${targetUserId ? ` (target: ${targetUserId})` : ''}`);
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }
}

export const adminService = new AdminService();
