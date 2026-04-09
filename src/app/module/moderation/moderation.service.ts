/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  RejectReviewInput,
  DeleteCommentInput,
  SuspendUserInput,
  FlagContentInput,
  ResolveFlagInput,
} from './moderation.validation';
import { IModerationService } from './moderation.interface';
import { ReviewStatus } from '@prisma/client';

export class ModerationService implements IModerationService {
  /**
   * Approve a pending review
   */
  async approveReview(id: string, adminId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError(400, 'Only pending reviews can be approved');
      }

      const approved = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.APPROVED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'APPROVED', 'REVIEW', id);

      return approved;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to approve review');
    }
  }

  /**
   * Reject a pending review
   */
  async rejectReview(id: string, adminId: string, input: RejectReviewInput) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError(400, 'Only pending reviews can be rejected');
      }

      const rejected = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.REJECTED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'REJECTED', 'REVIEW', id, input.reason);

      return rejected;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to reject review');
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string, adminId: string, input: DeleteCommentInput) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          review: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!comment) {
        throw new AppError(404, 'Comment not found');
      }

      const deleted = await prisma.comment.delete({
        where: { id },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'DELETED', 'COMMENT', id, input.reason);

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete comment');
    }
  }

  /**
   * Suspend a user
   */
  async suspendUser(input: SuspendUserInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const suspendUntil = input.duration
        ? new Date(Date.now() + input.duration * 24 * 60 * 60 * 1000)
        : null;

      const suspended = await prisma.user.update({
        where: { id: input.userId },
        data: {
          status: 'SUSPENDED',
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'SUSPENDED', 'USER', input.userId, input.reason);

      return suspended;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to suspend user');
    }
  }

  /**
   * Unsuspend a user
   */
  async unsuspendUser(userId: string, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      if (user.status !== 'SUSPENDED') {
        throw new AppError(400, 'User is not suspended');
      }

      const unsuspended = await prisma.user.update({
        where: { id: userId },
        data: { status: 'ACTIVE' },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'UNSUSPENDED', 'USER', userId);

      return unsuspended;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to unsuspend user');
    }
  }

  /**
   * Flag content for moderation review
   */
  async flagContent(userId: string, input: FlagContentInput) {
    try {
      // Verify content exists based on type
      if (input.contentType === 'REVIEW') {
        const review = await prisma.review.findUnique({
          where: { id: input.contentId },
        });
        if (!review) throw new AppError(404, 'Review not found');
      } else if (input.contentType === 'COMMENT') {
        const comment = await prisma.comment.findUnique({
          where: { id: input.contentId },
        });
        if (!comment) throw new AppError(404, 'Comment not found');
      } else if (input.contentType === 'USER') {
        const user = await prisma.user.findUnique({
          where: { id: input.contentId },
        });
        if (!user) throw new AppError(404, 'User not found');
      }

      // Check if already flagged by this user
      const existing = await prisma.flag.findFirst({
        where: {
          contentId: input.contentId,
          contentType: input.contentType as any,
          reportedBy: userId,
        },
      });

      if (existing) {
        throw new AppError(400, 'You have already flagged this content');
      }

      const flag = await prisma.flag.create({
        data: {
          contentId: input.contentId,
          contentType: input.contentType as any,
          reason: input.reason,
          description: input.description,
          reportedBy: userId,
          status: 'PENDING',
        },
      });

      return flag;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to flag content');
    }
  }

  /**
   * Get moderation queue (pending reviews and comments)
   */
  async getModerationQueue(
    limit: number = 20,
    page: number = 1,
    status?: string,
    type?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      // Get pending reviews and comments
      const [pendingReviews, pendingComments, totalReviews, totalComments] = await Promise.all([
        type === 'COMMENT' || !type
          ? prisma.comment.findMany({
              where: { isDeleted: false },
              skip: type === 'COMMENT' ? skip : 0,
              take: type === 'COMMENT' ? limit : undefined,
              orderBy: { [sortBy]: order as any },
              include: {
                review: true,
                user: { select: { id: true, email: true, name: true } },
              },
            })
          : Promise.resolve([]),
        type === 'REVIEW' || !type
          ? prisma.review.findMany({
              where: { status: ReviewStatus.PENDING },
              skip: type === 'REVIEW' ? skip : 0,
              take: type === 'REVIEW' ? limit : undefined,
              orderBy: { [sortBy]: order as any },
              include: {
                movie: true,
                user: { select: { id: true, email: true, name: true } },
              },
            })
          : Promise.resolve([]),
        type === 'COMMENT' || !type ? prisma.comment.count({ where: { isDeleted: false } }) : Promise.resolve(0),
        type === 'REVIEW' || !type ? prisma.review.count({ where: { status: ReviewStatus.PENDING } }) : Promise.resolve(0),
      ]);

      const total = totalReviews + totalComments;
      const pages = Math.ceil(total / limit);

      const combined = [
        ...pendingReviews.map((r) => ({ type: 'COMMENT', data: r })),
        ...pendingReviews.map((r) => ({ type: 'REVIEW', data: r })),
      ];

      return {
        data: combined,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch moderation queue');
    }
  }

  /**
   * Get flagged content
   */
  async getFlaggedContent(
    limit: number = 20,
    page: number = 1,
    contentType?: string,
    status: string = 'PENDING',
    sortBy: string = 'flagCount',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = { status };
      if (contentType) {
        whereClause.contentType = contentType;
      }

      const [total, flags] = await Promise.all([
        prisma.flag.count({ where: whereClause }),
        prisma.flag.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: flags,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch flagged content');
    }
  }

  /**
   * Resolve a flagged content
   */
  async resolveFlag(flagId: string, adminId: string, input: ResolveFlagInput) {
    try {
      const flag = await prisma.flag.findUnique({
        where: { id: flagId },
      });

      if (!flag) {
        throw new AppError(404, 'Flag not found');
      }

      if (flag.status !== 'PENDING') {
        throw new AppError(400, 'Only pending flags can be resolved');
      }

      const resolved = await prisma.flag.update({
        where: { id: flagId },
        data: {
          status: 'RESOLVED',
          resolvedBy: adminId,
          resolvedAt: new Date(),
          notes: input.notes,
        },
      });

      // Take action based on decision
      if (input.action === 'DELETED' && flag.contentType === 'COMMENT') {
        await prisma.comment.delete({
          where: { id: flag.contentId },
        });
      }

      // Log moderation action
      await this.logModerationAction(adminId, input.action, flag.contentType, flag.contentId, input.notes);

      return resolved;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to resolve flag');
    }
  }

  /**
   * Get moderation history
   */
  async getModerationHistory(
    limit: number = 20,
    page: number = 1,
    userId?: string,
    action?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (userId) whereClause.adminId = userId;
      if (action) whereClause.action = action;

      const [total, logs] = await Promise.all([
        prisma.moderationLog.count({ where: whereClause }),
        prisma.moderationLog.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
          include: {
            admin: { select: { id: true, email: true, name: true } },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: logs,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch moderation history');
    }
  }

  /**
   * Get content moderation stats
   */
  async getContentModerationStats() {
    try {
      const [pendingReviewsCount, approvedReviewsCount, rejectedReviewsCount, flagsCount, suspendedUsersCount] = await Promise.all([
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
        prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
        prisma.flag.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { status: 'SUSPENDED' } }),
      ]);

      return {
        reviews: {
          pending: pendingReviewsCount,
          approved: approvedReviewsCount,
          rejected: rejectedReviewsCount,
        },
        flaggedContent: flagsCount,
        suspendedUsers: suspendedUsersCount,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch moderation stats');
    }
  }

  /**
   * Private method to log moderation actions
   */
  private async logModerationAction(
    adminId: string,
    action: string,
    contentType: string,
    contentId: string,
    notes?: string,
  ) {
    try {
      await prisma.moderationLog.create({
        data: {
          adminId,
          action,
          contentType,
          contentId,
          notes,
        },
      });
    } catch (error) {
      console.error('Failed to log moderation action:', error);
    }
  }
}

export const moderationService = new ModerationService();
