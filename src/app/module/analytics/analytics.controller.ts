import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import {
  getAnalyticsQuerySchema,
  getUserStatsQuerySchema,
  getMovieStatsQuerySchema,
  getPaymentStatsQuerySchema,
} from './analytics.validation';

export class AnalyticsController {
  /**
   * Get dashboard overview
   */
  getDashboard = catchAsync(async (req: Request, res: Response) => {
    const query = getAnalyticsQuerySchema.parse(req.query);

    const result = await analyticsService.getDashboardStats(query);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: result,
    });
  });

  /**
   * Get user statistics
   */
  getUserStats = catchAsync(async (req: Request, res: Response) => {
    const query = getUserStatsQuerySchema.parse(req.query);

    const result = await analyticsService.getUserStats(query.limit, query.page, query.sortBy, query.order);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User stats fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get movie statistics
   */
  getMovieStats = catchAsync(async (req: Request, res: Response) => {
    const query = getMovieStatsQuerySchema.parse(req.query);

    const result = await analyticsService.getMovieStats(query.limit, query.page, query.sortBy, query.order);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie stats fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get payment statistics
   */
  getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const query = getPaymentStatsQuerySchema.parse(req.query);

    const result = await analyticsService.getPaymentStats(query);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Payment stats fetched successfully',
      data: result,
    });
  });

  /**
   * Get subscription statistics
   */
  getSubscriptionStats = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsService.getSubscriptionStats();

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription stats fetched successfully',
      data: result,
    });
  });

  /**
   * Get engagement statistics
   */
  getEngagementStats = catchAsync(async (req: Request, res: Response) => {
    const query = getAnalyticsQuerySchema.parse(req.query);

    const result = await analyticsService.getEngagementStats(query);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Engagement stats fetched successfully',
      data: result,
    });
  });

  /**
   * Get content performance
   */
  getContentPerformance = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsService.getContentPerformance();

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Content performance fetched successfully',
      data: result,
    });
  });

  /**
   * Get user growth
   */
  getUserGrowth = catchAsync(async (req: Request, res: Response) => {
    const { period = 'MONTH' } = req.query;

    const result = await analyticsService.getUserGrowth(period as string);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User growth fetched successfully',
      data: result,
    });
  });

  /**
   * Get revenue statistics
   */
  getRevenueStats = catchAsync(async (req: Request, res: Response) => {
    const query = getPaymentStatsQuerySchema.parse(req.query);

    const result = await analyticsService.getRevenueStats(query);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Revenue stats fetched successfully',
      data: result,
    });
  });
}

export const analyticsController = new AnalyticsController();
