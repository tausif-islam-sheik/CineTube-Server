/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { GetLikesQuery } from './likes.validation';
import { ILikesService } from './likes.interface';

export class LikesService implements ILikesService {
  /**
   * Toggle like on a review (create if doesn't exist, delete if exists)
   */
  async toggleLike(userId: string, reviewId: string): Promise<{ liked: boolean; like?: any }> {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      const existingLike = await prisma.like.findUnique({
        where: {
          userId_reviewId: {
            userId,
            reviewId,
          },
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      }

      const like = await prisma.like.create({
        data: {
          userId,
          reviewId,
        },
      });

      return { liked: true, like };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to toggle like');
    }
  }

  /**
   * Get likes with filters and pagination
   */
  async getLikes(filters: GetLikesQuery): Promise<any> {
    try {
      const { reviewId, limit = 10, page = 1 } = filters;
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (reviewId) whereClause.reviewId = reviewId;

      const [total, likes] = await Promise.all([
        prisma.like.count({ where: whereClause }),
        prisma.like.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { id: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            review: {
              select: { id: true, title: true, movieId: true },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);
      return {
        data: likes,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch likes');
    }
  }

  /**
   * Get likes for a specific review
   */
  async getReviewLikes(reviewId: string, limit: number = 10, page: number = 1) {
    return this.getLikes({ reviewId, limit, page });
  }

  /**
   * Get likes by a specific user
   */
  async getUserLikes(userId: string, limit: number = 10, page: number = 1) {
    try {
      const skip = (page - 1) * limit;
      const [total, likes] = await Promise.all([
        prisma.like.count({ where: { userId } }),
        prisma.like.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { id: 'desc' },
          include: {
            review: {
              select: {
                id: true,
                title: true,
                movieId: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);
      return {
        data: likes,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch user likes');
    }
  }

  /**
   * Get the number of likes for a specific review
   */
  async getReviewLikesCount(reviewId: string): Promise<number> {
    try {
      return await prisma.like.count({
        where: { reviewId },
      });
    } catch (error) {
      throw new AppError(500, 'Failed to fetch likes count');
    }
  }
}

export const likesService = new LikesService();
