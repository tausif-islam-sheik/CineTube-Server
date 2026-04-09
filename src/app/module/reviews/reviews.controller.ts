/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { reviewsService } from './reviews.service';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema,
  getReviewByIdSchema,
  deleteReviewSchema,
  updateReviewParamsSchema,
} from './reviews.validation';
import AppError from '../../errorHelpers/AppError';

export class ReviewsController {
  /**
   * Create a new review
   */
  static createReview = catchAsync(async (req: any, res: Response) => {
    const validatedData = createReviewSchema.parse({ body: req.body });

    const review = await reviewsService.createReview(req.user.id, validatedData.body);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  });

  /**
   * Get all reviews with filters and pagination
   */
  static getReviews = catchAsync(async (req: any, res: Response) => {
    const validatedQuery = getReviewsQuerySchema.parse({ query: req.query });

    const result = await reviewsService.getReviews(validatedQuery.query);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Reviews retrieved successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });

  /**
   * Get a single review by ID
   */
  static getReviewById = catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    const review = await reviewsService.getReviewById(id);

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review retrieved successfully',
      data: review,
    });
  });

  /**
   * Get reviews for a specific movie
   */
  static getMovieReviews = catchAsync(async (req: any, res: Response) => {
    const { movieId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const result = await reviewsService.getMovieReviews(
      movieId,
      parseInt(limit as string),
      parseInt(page as string),
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie reviews retrieved successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });

  /**
   * Update a review (user can only update own review)
   */
  static updateReview = catchAsync(async (req: any, res: Response) => {
    const validatedParams = updateReviewParamsSchema.parse({ params: req.params });
    const validatedData = updateReviewSchema.parse({ body: req.body });

    const review = await reviewsService.updateReview(
      validatedParams.params.id,
      req.user.id,
      validatedData.body,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  });

  /**
   * Delete a review (user can only delete own review)
   */
  static deleteReview = catchAsync(async (req: any, res: Response) => {
    const validatedParams = deleteReviewSchema.parse({ params: req.params });

    await reviewsService.deleteReview(validatedParams.params.id, req.user.id);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review deleted successfully',
      data: null,
    });
  });
}
