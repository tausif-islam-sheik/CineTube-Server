import { Request, Response } from 'express';
import { watchlistService } from './watchlist.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import {
  addToWatchlistSchema,
  removeFromWatchlistSchema,
  getWatchlistQuerySchema,
  checkWatchlistSchema,
} from './watchlist.validation';
import { AuthenticatedRequest } from '../auth/auth.interface';

export class WatchlistController {
  /**
   * Add a movie to watchlist
   */
  addToWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const body = addToWatchlistSchema.parse(req.body);
    const userId = req.user?.id;

    const result = await watchlistService.addToWatchlist(userId, body.movieId);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Added to watchlist successfully',
      data: result,
    });
  });

  /**
   * Remove a movie from watchlist
   */
  removeFromWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const params = removeFromWatchlistSchema.parse(req.params);
    const userId = req.user?.id;

    const result = await watchlistService.removeFromWatchlist(params.id, userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Removed from watchlist successfully',
      data: result,
    });
  });

  /**
   * Get user's watchlist
   */
  getUserWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const query = getWatchlistQuerySchema.parse(req.query);
    const userId = req.user?.id;

    const result = await watchlistService.getUserWatchlist(
      userId,
      query.limit,
      query.page,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Watchlist fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Check if a movie is in user's watchlist
   */
  checkIfInWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const query = checkWatchlistSchema.parse(req.query);
    const userId = req.user?.id;

    const inWatchlist = await watchlistService.checkIfInWatchlist(userId, query.movieId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Watchlist check completed',
      data: { inWatchlist },
    });
  });

  /**
   * Get watchlist count for a user
   */
  getWatchlistCount = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const count = await watchlistService.getWatchlistCount(userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Watchlist count fetched successfully',
      data: { count },
    });
  });
}

export const watchlistController = new WatchlistController();
