/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { CreateReviewInput, UpdateReviewInput, GetReviewsQuery } from './reviews.validation';
import { IReviewsService } from './reviews.interface';

export class ReviewsService implements IReviewsService {
  /**
   * Create a new review
   */
  async createReview(userId: string, data: CreateReviewInput) {
    try {
      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: data.movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      // Check if user already reviewed this movie
      const existingReview = await prisma.review.findFirst({
        where: {
          movieId: data.movieId,
          userId,
        },
      });

      if (existingReview) {
        throw new AppError(400, 'You have already reviewed this movie');
      }

      const review = await prisma.review.create({
        data: {
          movieId: data.movieId,
          userId,
          rating: data.rating,
          title: data.title,
          content: data.comment,
          spoiler: data.containsSpoiler ?? false,
          status: 'PENDING',
        },
      });

      return review;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create review');
    }
  }

  /**
   * Get reviews with filters and pagination
   */
  async getReviews(filters: GetReviewsQuery): Promise<any> {
    try {
      const {
        movieId,
        status,
        sortBy = 'createdAt',
        order = 'desc',
        limit = 10,
        page = 1,
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: Prisma.ReviewWhereInput = {};

      if (movieId) {
        whereClause.movieId = movieId;
      }

      if (status) {
        whereClause.status = status as any;
      }

      // Build orderBy
      const orderBy: Prisma.ReviewOrderByWithRelationInput = {};
      if (sortBy === 'rating') {
        orderBy.rating = order as Prisma.SortOrder;
      } else {
        orderBy.createdAt = order as Prisma.SortOrder;
      }

      // Fetch data
      const [total, reviews] = await Promise.all([
        prisma.review.count({ where: whereClause }),
        prisma.review.findMany({
          where: whereClause,
          orderBy,
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
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch reviews');
    }
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(id: string): Promise<any | null> {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          movie: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      return review;
    } catch (error) {
      throw new AppError(500, 'Failed to fetch review');
    }
  }

  /**
   * Update a review (user can only update own review)
   */
  async updateReview(id: string, userId: string, data: UpdateReviewInput) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      // Check if user is the owner
      if (review.userId !== userId) {
        throw new AppError(403, 'You can only update your own reviews');
      }

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          rating: data.rating ?? review.rating,
          title: data.title ?? review.title,
          content: data.comment ?? review.content,
          spoiler: data.containsSpoiler ?? review.spoiler,
          updatedAt: new Date(),
        },
      });

      return updatedReview;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update review');
    }
  }

  /**
   * Delete a review (user can only delete own review)
   */
  async deleteReview(id: string, userId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      // Check if user is the owner
      if (review.userId !== userId) {
        throw new AppError(403, 'You can only delete your own reviews');
      }

      // Delete associated comments/likes first
      await prisma.comment.deleteMany({
        where: { reviewId: id },
      });

      const deletedReview = await prisma.review.delete({
        where: { id },
      });

      return deletedReview;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete review');
    }
  }

  /**
   * Get reviews for a specific movie
   */
  async getMovieReviews(movieId: string, limit: number = 10, page: number = 1) {
    try {
      const skip = (page - 1) * limit;

      // Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie || movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      const [total, reviews] = await Promise.all([
        prisma.review.count({
          where: {
            movieId,
            status: 'APPROVED',
          },
        }),
        prisma.review.findMany({
          where: {
            movieId,
            status: 'APPROVED',
          },
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
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch movie reviews');
    }
  }
}

export const reviewsService = new ReviewsService();
