/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { likesService } from './likes.service';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';
import {
  createLikeSchema,
  getLikesQuerySchema,
} from './likes.validation';

export class LikesController {
  /**
   * Toggle like on a movie
   */
  static toggleLike = catchAsync(async (req: any, res: Response) => {
    const validatedData = createLikeSchema.parse({ body: req.body });

    const result = await likesService.toggleLike(req.user.id, validatedData.body.movieId);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: result.liked ? 'Like added successfully' : 'Like removed successfully',
      data: result,
    });
  });

  /**
   * Get likes with filters
   */
  static getLikes = catchAsync(async (req: any, res: Response) => {
    const validatedQuery = getLikesQuerySchema.parse({ query: req.query });

    const result = await likesService.getLikes(validatedQuery.query);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Likes retrieved successfully',
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
   * Get likes for a specific movie
   */
  static getMovieLikes = catchAsync(async (req: any, res: Response) => {
    const { movieId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const result = await likesService.getMovieLikes(
      movieId,
      parseInt(limit as string),
      parseInt(page as string),
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie likes retrieved successfully',
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
   * Get likes count for a specific movie
   */
  static getMovieLikesCount = catchAsync(async (req: any, res: Response) => {
    const { movieId } = req.params;

    const count = await likesService.getMovieLikesCount(movieId);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie likes count retrieved successfully',
      data: {
        movieId,
        likesCount: count,
      },
    });
  });

  /**
   * Get likes by current user
   */
  static getUserLikes = catchAsync(async (req: any, res: Response) => {
    const { limit = 10, page = 1 } = req.query;

    const result = await likesService.getUserLikes(
      req.user.id,
      parseInt(limit as string),
      parseInt(page as string),
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User likes retrieved successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });
}
