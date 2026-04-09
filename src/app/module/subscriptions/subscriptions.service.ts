/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  CancelSubscriptionInput,
  CreateSubscriptionTierInput,
  UpdateSubscriptionTierInput,
} from './subscriptions.validation';
import { ISubscriptionService } from './subscriptions.interface';
import { SubscriptionStatus } from '../../../generated/prisma/enums';

export class SubscriptionService implements ISubscriptionService {
  /**
   * Create a new subscription for user
   */
  async createSubscription(userId: string, input: CreateSubscriptionInput) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const tier = await prisma.subscriptionTier.findUnique({
        where: { id: input.subscriptionTierId },
      });

      if (!tier) {
        throw new AppError(404, 'Subscription tier not found');
      }

      // Check if user already has active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      if (existingSubscription) {
        throw new AppError(400, 'User already has an active subscription');
      }

      // Calculate end date based on billing cycle
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (tier.billingCycle || 1));

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          tierId: input.subscriptionTierId,
          status: SubscriptionStatus.ACTIVE,
          endDate,
          autoRenew: input.autoRenew ?? true,
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create subscription');
    }
  }

  /**
   * Get a subscription by ID
   */
  async getSubscription(id: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!subscription) {
        throw new AppError(404, 'Subscription not found');
      }

      return subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch subscription');
    }
  }

  /**
   * Get user's active subscription
   */
  async getUserSubscription(userId: string) {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE,
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return subscription || null;
    } catch {
      throw new AppError(500, 'Failed to fetch user subscription');
    }
  }

  /**
   * Get user's subscriptions with pagination
   */
  async getUserSubscriptions(
    userId: string,
    limit: number = 10,
    page: number = 1,
    status?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = { userId };
      if (status) {
        whereClause.status = status;
      }

      const [total, subscriptions] = await Promise.all([
        prisma.subscription.count({ where: whereClause }),
        prisma.subscription.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
          include: {
            subscriptionTier: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: subscriptions,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch {
      throw new AppError(500, 'Failed to fetch user subscriptions');
    }
  }

  /**
   * Get all subscriptions (admin only)
   */
  async getAllSubscriptions(
    limit: number = 10,
    page: number = 1,
    status?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }

      const [total, subscriptions] = await Promise.all([
        prisma.subscription.count({ where: whereClause }),
        prisma.subscription.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
          include: {
            tier: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: subscriptions,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch {
      throw new AppError(500, 'Failed to fetch subscriptions');
    }
  }

  /**
   * Update a subscription
   */
  async updateSubscription(id: string, userId: string, input: UpdateSubscriptionInput) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
      });

      if (!subscription) {
        throw new AppError(404, 'Subscription not found');
      }

      if (subscription.userId !== userId) {
        throw new AppError(403, 'You can only update your own subscriptions');
      }

      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          autoRenew: input.autoRenew,
          tierId: input.subscriptionTierId,
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update subscription');
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(id: string, userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
      });

      if (!subscription) {
        throw new AppError(404, 'Subscription not found');
      }

      if (subscription.userId !== userId) {
        throw new AppError(403, 'You can only cancel your own subscriptions');
      }

      const cancelled = await prisma.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          autoRenew: false,
          cancelledAt: new Date(),
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return cancelled;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to cancel subscription');
    }
  }

  /**
   * Check if user has access to content
   */
  async checkSubscriptionAccess(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: {
          tier: true,
        },
      });

      if (!subscription) {
        return {
          hasAccess: false,
          reason: 'No active subscription',
        };
      }

      // Check if subscription has expired
      if (subscription.endDate && new Date() > subscription.endDate) {
        if (subscription.autoRenew) {
          // Auto-renewal should have happened
          return {
            hasAccess: false,
            reason: 'Subscription expired - renewal failed',
          };
        }

        return {
          hasAccess: false,
          reason: 'Subscription expired',
        };
      }

      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        return {
          hasAccess: false,
          reason: 'Subscription is not active',
        };
      }

      return {
        hasAccess: true,
        subscriptionTier: subscription.tier,
        endDate: subscription.endDate,
      };
    } catch {
      throw new AppError(500, 'Failed to check subscription access');
    }
  }

  /**
   * Create a subscription tier (admin only)
   */
  async createSubscriptionTier(input: CreateSubscriptionTierInput) {
    try {
      const tier = await prisma.subscriptionTier.create({
        data: {
          name: input.name as any,
          displayName: input.name,
          description: input.description,
          price: input.price,
          billingCycle: input.billingCycle === 'YEARLY' ? 12 : 1,
          features: input.features || [],
        },
      });

      return tier;
    } catch {
      throw new AppError(500, 'Failed to create subscription tier');
    }
  }

  /**
   * Get all subscription tiers
   */
  async getSubscriptionTiers(
    limit: number = 10,
    page: number = 1,
    isActive?: boolean,
    sortBy: string = 'price',
    order: string = 'asc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const [total, tiers] = await Promise.all([
        prisma.subscriptionTier.count({ where: whereClause }),
        prisma.subscriptionTier.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: tiers,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch {
      throw new AppError(500, 'Failed to fetch subscription tiers');
    }
  }

  /**
   * Get a subscription tier by ID
   */
  async getSubscriptionTier(id: string) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id },
      });

      if (!tier) {
        throw new AppError(404, 'Subscription tier not found');
      }

      return tier;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch subscription tier');
    }
  }

  /**
   * Update a subscription tier (admin only)
   */
  async updateSubscriptionTier(id: string, input: UpdateSubscriptionTierInput) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id },
      });

      if (!tier) {
        throw new AppError(404, 'Subscription tier not found');
      }

      const updated = await prisma.subscriptionTier.update({
        where: { id },
        data: {
          displayName: input.name,
          description: input.description,
          price: input.price,
          features: input.features,
        },
      });

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update subscription tier');
    }
  }

  /**
   * Delete a subscription tier (admin only)
   */
  async deleteSubscriptionTier(id: string) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id },
      });

      if (!tier) {
        throw new AppError(404, 'Subscription tier not found');
      }

      // Check if any subscriptions use this tier
      const activeSubscriptions = await prisma.subscription.count({
        where: {
          tierId: id,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      if (activeSubscriptions > 0) {
        throw new AppError(
          400,
          'Cannot delete tier with active subscriptions. Set isActive to false instead.',
        );
      }

      const deleted = await prisma.subscriptionTier.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete subscription tier');
    }
  }

  /**
   * Renew expired subscriptions with autoRenew enabled
   */
  async renewExpiredSubscriptions() {
    try {
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          endDate: {
            lte: new Date(),
          },
          autoRenew: true,
          status: SubscriptionStatus.ACTIVE,
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      for (const subscription of expiredSubscriptions) {
        try {
          if (!subscription.endDate) continue;

          const newEndDate = new Date(subscription.endDate);
          newEndDate.setMonth(newEndDate.getMonth() + (subscription.tier.billingCycle || 1));

          // In production, charge user here via Stripe
          // For now, just update end date
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              endDate: newEndDate,
            },
          });
        } catch {
          // Mark as failed - in production, send notification to user
        }
      }

      return {
        message: 'Subscription renewal process completed',
        processedCount: expiredSubscriptions.length,
      };
    } catch {
      throw new AppError(500, 'Failed to renew subscriptions');
    }
  }
}

export const subscriptionService = new SubscriptionService();
