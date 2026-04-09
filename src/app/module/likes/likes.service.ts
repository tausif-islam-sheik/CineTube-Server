/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { GetLikesQuery } from './likes.validation';
import { ILikesService } from './likes.interface';
import type { Prisma } from '@prisma/client';

export class LikesService implements ILikesService {
  /**
   * Toggle like on a movie (create if doesn't exist, delete if exists)
   */
  async toggleLike(userId: string, movieId: string): Promise<{ liked: boolean; like?: any }> {
    try {
      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      // Check if like already exists
      const existingLike = await prisma.like.findFirst({
        where: {
          movieId,
          userId,
        },
      });

      if (existingLike) {
        // Delete the like
        await prisma.like.delete({
          where: { id: existingLike.id },
        });

        return {
          liked: false,
        };
      } else {
        // Create a new like
        const like = await prisma.like.create({
          data: {
            movieId,
            userId,
          },
        });

        return {
          liked: true,
          like,
        };
      }
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
      const { movieId, limit = 10, page = 1 } = filters;

      const skip = (page - 1) * limit;

      const whereClause: Prisma.LikeWhereInput = {};
      if (movieId) {
        whereClause.movieId = movieId;
      }

      const [total, likes] = await Promise.all([
        prisma.like.count({ where: whereClause }),
        prisma.like.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
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
   * Get likes for a specific movie
   */
  async getMovieLikes(movieId: string, limit: number = 10, page: number = 1) {
    try {
      const skip = (page - 1) * limit;

      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      const [total, likes] = await Promise.all([
        prisma.like.count({ where: { movieId } }),
        prisma.like.findMany({
          where: { movieId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
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
        data: likes,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch movie likes');
    }
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
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                slug: true,
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
   * Get the number of likes for a specific movie
   */
  async getMovieLikesCount(movieId: string): Promise<number> {
    try {
      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      const count = await prisma.like.count({
        where: { movieId },
      });

      return count;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch likes count');
    }
  }
}

export const likesService = new LikesService();
