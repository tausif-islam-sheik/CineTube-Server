import { Request, Response } from 'express';
import { subscriptionService } from './subscriptions.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import AppError from '../../errorHelpers/AppError';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  cancelSubscriptionSchema,
  getSubscriptionSchema,
  getSubscriptionsQuerySchema,
  createSubscriptionTierSchema,
  updateSubscriptionTierSchema,
  getSubscriptionTiersQuerySchema,
} from './subscriptions.validation';
import { AuthenticatedRequest } from '../auth/auth.interface';

export class SubscriptionController {
  /**
   * Create a new subscription
   */
  createSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const body = createSubscriptionSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }
    const result = await subscriptionService.createSubscription(userId, body);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Subscription created successfully',
      data: result,
    });
  });

  /**
   * Get subscription by ID
   */
  getSubscription = catchAsync(async (req: Request, res: Response) => {
    const params = getSubscriptionSchema.parse(req.params);

    const result = await subscriptionService.getSubscription(params.id);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription fetched successfully',
      data: result,
    });
  });

  /**
   * Get user's active subscription
   */
  getUserSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }
    const result = await subscriptionService.getUserSubscription(userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User subscription fetched successfully',
      data: result,
    });
  });

  /**
   * Get user's subscriptions
   */
  getUserSubscriptions = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const query = getSubscriptionsQuerySchema.parse(req.query);
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const result = await subscriptionService.getUserSubscriptions(
      userId,
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User subscriptions fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get all subscriptions (admin only)
   */
  getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
    const query = getSubscriptionsQuerySchema.parse(req.query);

    const result = await subscriptionService.getAllSubscriptions(
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'All subscriptions fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Update a subscription
   */
  updateSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const params = updateSubscriptionSchema.parse({ ...req.body, id: req.params.id });
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }
    const result = await subscriptionService.updateSubscription(params.id, userId, params);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription updated successfully',
      data: result,
    });
  });

  /**
   * Cancel a subscription
   */
  cancelSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const params = cancelSubscriptionSchema.parse({ ...req.body, id: req.params.id });
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }
    const result = await subscriptionService.cancelSubscription(params.id, userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription cancelled successfully',
      data: result,
    });
  });

  /**
   * Check subscription access
   */
  checkSubscriptionAccess = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const result = await subscriptionService.checkSubscriptionAccess(userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Access check completed',
      data: result,
    });
  });

  /**
   * Create subscription tier (admin only)
   */
  createSubscriptionTier = catchAsync(async (req: Request, res: Response) => {
    const body = createSubscriptionTierSchema.parse(req.body);

    const result = await subscriptionService.createSubscriptionTier(body);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Subscription tier created successfully',
      data: result,
    });
  });

  /**
   * Get all subscription tiers
   */
  getSubscriptionTiers = catchAsync(async (req: Request, res: Response) => {
    const query = getSubscriptionTiersQuerySchema.parse(req.query);

    const result = await subscriptionService.getSubscriptionTiers(
      query.limit,
      query.page,
      query.isActive,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription tiers fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get subscription tier by ID
   */
  getSubscriptionTier = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'Invalid subscription tier ID');
    }

    const result = await subscriptionService.getSubscriptionTier(id);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription tier fetched successfully',
      data: result,
    });
  });

  /**
   * Update subscription tier (admin only)
   */
  updateSubscriptionTier = catchAsync(async (req: Request, res: Response) => {
    const body = updateSubscriptionTierSchema.parse({ ...req.body, id: req.params.id });

    const result = await subscriptionService.updateSubscriptionTier(body.id, body);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription tier updated successfully',
      data: result,
    });
  });

  /**
   * Delete subscription tier (admin only)
   */
  deleteSubscriptionTier = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'Invalid subscription tier ID');
    }

    const result = await subscriptionService.deleteSubscriptionTier(id);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscription tier deleted successfully',
      data: result,
    });
  });

  /**
   * Renew expired subscriptions (admin/cron job)
   */
  renewSubscriptions = catchAsync(async (req: Request, res: Response) => {
    const result = await subscriptionService.renewExpiredSubscriptions();

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Subscriptions renewal process completed',
      data: result,
    });
  });
}

export const subscriptionController = new SubscriptionController();
