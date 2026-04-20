/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { AddToWatchlistInput, GetWatchlistQuery } from './watchlist.validation';
import { IWatchlistService } from './watchlist.interface';

export class WatchlistService implements IWatchlistService {
  /**
   * Add a movie to user's watchlist
   */
  async addToWatchlist(userId: string, movieId: string) {
    try {
      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      // Check if already in watchlist
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          movieId,
        },
      });

      if (existingWatchlist) {
        throw new AppError(400, 'Movie is already in your watchlist');
      }

      const watchlist = await prisma.watchlist.create({
        data: {
          userId,
          movieId,
        },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              slug: true,
              posterUrl: true,
              releaseYear: true,
            },
          },
        },
      });

      return watchlist;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to add to watchlist');
    }
  }

  /**
   * Remove a movie from user's watchlist
   */
  async removeFromWatchlist(id: string, userId: string) {
    try {
      const watchlist = await prisma.watchlist.findUnique({
        where: { id },
      });

      if (!watchlist) {
        throw new AppError(404, 'Watchlist entry not found');
      }

      // Check if user is the owner
      if (watchlist.userId !== userId) {
        throw new AppError(403, 'You can only remove your own watchlist entries');
      }

      const deleted = await prisma.watchlist.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to remove from watchlist');
    }
  }

  /**
   * Get user's watchlist with pagination and sorting
   */
  async getUserWatchlist(
    userId: string,
    limit: number = 10,
    page: number = 1,
    sortBy: string = 'addedAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      // Build orderBy
      const orderByObj: any = {};
      if (sortBy === 'title') {
        orderByObj.movie = { title: order as any };
      } else {
        orderByObj.createdAt = order as any;
      }

      const [total, watchlist] = await Promise.all([
        prisma.watchlist.count({ where: { userId } }),
        prisma.watchlist.findMany({
          where: { userId },
          orderBy: orderByObj,
          skip,
          take: limit,
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                posterUrl: true,
                releaseYear: true,
                director: true,
                averageRating: true,
                pricing: true,
                price: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: watchlist,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch watchlist');
    }
  }

  /**
   * Check if a movie is in user's watchlist
   */
  async checkIfInWatchlist(userId: string, movieId: string): Promise<boolean> {
    try {
      const watchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          movieId,
        },
      });

      return !!watchlist;
    } catch (error) {
      throw new AppError(500, 'Failed to check watchlist');
    }
  }

  /**
   * Get the count of movies in user's watchlist
   */
  async getWatchlistCount(userId: string): Promise<number> {
    try {
      const count = await prisma.watchlist.count({
        where: { userId },
      });

      return count;
    } catch (error) {
      throw new AppError(500, 'Failed to fetch watchlist count');
    }
  }
}

export const watchlistService = new WatchlistService();
