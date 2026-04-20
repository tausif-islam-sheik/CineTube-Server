/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  GetAnalyticsQuery,
  GetUserStatsQuery,
  GetMovieStatsQuery,
  GetPaymentStatsQuery,
} from './analytics.validation';
import { IAnalyticsService } from './analytics.interface';

export class AnalyticsService implements IAnalyticsService {
  /**
   * Get dashboard overview stats
   */
  async getDashboardStats(query: GetAnalyticsQuery) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : this.getDateRange(query.period).startDate;
      const endDate = query.endDate ? new Date(query.endDate) : this.getDateRange(query.period).endDate;

      const [totalUsers, activeUsers, totalMovies, totalReviews, totalPayments, totalRevenue, activeSubscriptions] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          }),
          prisma.movie.count({ where: { isDeleted: false } }),
          prisma.review.count({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          }),
          prisma.payment.count({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          }),
          prisma.payment.aggregate({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            _sum: { amount: true },
          }),
          prisma.subscription.count({
            where: { status: 'ACTIVE' },
          }),
        ]);

      return {
        overview: {
          totalUsers,
          activeUsers,
          totalMovies,
          totalReviews,
          totalPayments,
          totalRevenue: totalRevenue._sum.amount || 0,
          activeSubscriptions,
        },
        period: { startDate, endDate },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch dashboard stats');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(limit: number = 10, page: number = 1, sortBy: string = 'createdAt', order: string = 'desc') {
    try {
      const skip = (page - 1) * limit;

      const [total, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: order as any },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            _count: {
              select: {
                reviews: true,
                comments: true,
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
      throw new AppError(500, 'Failed to fetch user stats');
    }
  }

  /**
   * Get movie statistics
   */
  async getMovieStats(limit: number = 10, page: number = 1, sortBy: string = 'rating', order: string = 'desc') {
    try {
      const skip = (page - 1) * limit;

      const [total, movies] = await Promise.all([
        prisma.movie.count({ where: { isDeleted: false } }),
        prisma.movie.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
          orderBy: { [sortBy]: order as any },
          select: {
            id: true,
            title: true,
            slug: true,
            averageRating: true,
            releaseYear: true,
            _count: {
              select: {
                reviews: true,
                watchlists: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: movies,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch movie stats');
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(query: GetPaymentStatsQuery) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const whereClause: any = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (query.paymentMethod) {
        whereClause.paymentMethod = query.paymentMethod;
      }

      const [totalAmountResult, totalCount, successfulPayments, failedPayments, refundedPayments, paymentsByMethod] =
        await Promise.all([
          prisma.payment.aggregate({
            where: whereClause,
            _sum: { amount: true },
          }),
          prisma.payment.count({ where: whereClause }),
          prisma.payment.count({
            where: { ...whereClause, status: 'COMPLETED' },
          }),
          prisma.payment.count({
            where: { ...whereClause, status: 'FAILED' },
          }),
          prisma.payment.count({
            where: { ...whereClause, status: 'REFUNDED' },
          }),
          prisma.payment.groupBy({
            by: ['paymentMethod'],
            where: whereClause,
            _count: true,
            _sum: { amount: true },
          }),
        ]);

      return {
        summary: {
          totalAmount: totalAmountResult._sum.amount || 0,
          totalCount,
          successfulPayments,
          failedPayments,
          refundedPayments,
        },
        byMethod: paymentsByMethod,
        period: { startDate, endDate },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch payment stats');
    }
  }

  /**
   * Get subscription statistics
   */
  async getSubscriptionStats() {
    try {
      const [totalSubscriptions, activeSubscriptions, cancelledSubscriptions, subscriptionsByTier] = await Promise.all([
        prisma.subscription.count(),
        prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        prisma.subscription.count({ where: { status: 'CANCELLED' } }),
        prisma.subscription.groupBy({
          by: ['tierId'],
          _count: true,
          where: { status: 'ACTIVE' },
        }),
      ]);

      return {
        total: totalSubscriptions,
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        byTier: subscriptionsByTier,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch subscription stats');
    }
  }

  /**
   * Get engagement statistics
   */
  async getEngagementStats(query: GetAnalyticsQuery) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : this.getDateRange(query.period).startDate;
      const endDate = query.endDate ? new Date(query.endDate) : this.getDateRange(query.period).endDate;

      const [totalReviews, totalLikes, totalComments, totalWatchlistAdds] = await Promise.all([
        prisma.review.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        (prisma.like as any).count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        (prisma.comment as any).count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        prisma.watchlist.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ]);

      return {
        reviews: totalReviews,
        likes: totalLikes,
        comments: totalComments,
        watchlistAdds: totalWatchlistAdds,
        period: { startDate, endDate },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch engagement stats');
    }
  }

  /**
   * Get content performance (top movies)
   */
  async getContentPerformance() {
    try {
      const topMovies = await prisma.movie.findMany({
        where: { isDeleted: false },
        take: 10,
        orderBy: { averageRating: 'desc' },
        select: {
          id: true,
          title: true,
          averageRating: true,
          _count: {
            select: {
              reviews: true,
              watchlists: true,
            },
          },
        },
      });

      return {
        topMovies,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch content performance');
    }
  }

  /**
   * Get user growth over time
   */
  async getUserGrowth(period: string) {
    try {
      const { startDate, endDate } = this.getDateRange(period);

      const userGrowth = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      });

      // Group by date
      const groupedByDate: any = {};
      userGrowth.forEach((user: any) => {
        const dateKey = user.createdAt.toISOString().split('T')[0];
        groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + 1;
      });

      return {
        period,
        data: groupedByDate,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch user growth');
    }
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStats(query: GetPaymentStatsQuery) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const [totalRevenue, completedPayments, subscriptionRevenue, averageTransactionValue] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        }),
        prisma.payment.count({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        (prisma.subscription as any).aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: { _all: true },
        }),
        prisma.payment.aggregate({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _avg: { amount: true },
        }),
      ]);

      return {
        totalRevenue: totalRevenue._sum.amount || 0,
        completedPayments,
        averageTransactionValue: averageTransactionValue._avg.amount || 0,
        period: { startDate, endDate },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch revenue stats');
    }
  }

  /**
   * Helper method to calculate date range
   */
  private getDateRange(period: string) {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'DAY':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'WEEK':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'MONTH':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'YEAR':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }
}

export const analyticsService = new AnalyticsService();
