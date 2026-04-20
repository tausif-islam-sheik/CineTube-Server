import { Request, Response } from 'express';
import { moderationService } from './moderation.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import AppError from '../../errorHelpers/AppError';
import {
  approveReviewSchema,
  rejectReviewSchema,
  deleteCommentSchema,
  suspendUserSchema,
  unsuspendUserSchema,
  getModerationQueueQuerySchema,
  flagContentSchema,
  getFlaggedContentQuerySchema,
  resolveFlagSchema,
  getModerationHistoryQuerySchema,
} from './moderation.validation';
import { AuthenticatedRequest } from '../auth/auth.interface';

export class ModerationController {
  /**
   * Approve a review
   */
  approveReview = catchAsync(async (req: Request, res: Response) => {
    const body = approveReviewSchema.parse(req.params);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await moderationService.approveReview(body.id, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review approved successfully',
      data: result,
    });
  });

  /**
   * Reject a review
   */
  rejectReview = catchAsync(async (req: Request, res: Response) => {
    const params = approveReviewSchema.parse(req.params);
    const body = rejectReviewSchema.parse({ ...req.body, id: params.id });
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await moderationService.rejectReview(body.id, adminId, body);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review rejected successfully',
      data: result,
    });
  });

  /**
   * Delete a comment
   */
  deleteComment = catchAsync(async (req: Request, res: Response) => {
    const params = approveReviewSchema.parse(req.params);
    const body = deleteCommentSchema.parse({ ...req.body, id: params.id });
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await moderationService.deleteComment(body.id, adminId, body);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Comment deleted successfully',
      data: result,
    });
  });

  /**
   * Suspend a user
   */
  suspendUser = catchAsync(async (req: Request, res: Response) => {
    const body = suspendUserSchema.parse(req.body);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await moderationService.suspendUser(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User suspended successfully',
      data: result,
    });
  });

  /**
   * Unsuspend a user
   */
  unsuspendUser = catchAsync(async (req: Request, res: Response) => {
    const body = unsuspendUserSchema.parse(req.params);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await moderationService.unsuspendUser(body.userId, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User unsuspended successfully',
      data: result,
    });
  });

  /**
   * Get moderation queue
   */
  getModerationQueue = catchAsync(async (req: Request, res: Response) => {
    const query = getModerationQueueQuerySchema.parse(req.query);

    const result = await moderationService.getModerationQueue(
      query.limit,
      query.page,
      query.status,
      query.type,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Moderation queue fetched successfully',
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
   * Flag content for review
   */
  flagContent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const body = flagContentSchema.parse(req.body);
    const userId = req.user?.id || '';

    const result = await moderationService.flagContent(userId, body);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Content flagged successfully',
      data: result,
    });
  });

  /**
   * Get flagged content
   */
  getFlaggedContent = catchAsync(async (req: Request, res: Response) => {
    const query = getFlaggedContentQuerySchema.parse(req.query);

    const result = await moderationService.getFlaggedContent(
      query.limit,
      query.page,
      query.contentType,
      query.status,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Flagged content fetched successfully',
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
   * Resolve a flag
   */
  resolveFlag = catchAsync(async (req: Request, res: Response) => {
    const flagId = Array.isArray(req.params.flagId) ? req.params.flagId[0] : req.params.flagId;
    const body = resolveFlagSchema.parse(req.body);
    const adminId = (req as AuthenticatedRequest).user?.id;

    if (!flagId) {
      throw new AppError(400, 'Flag ID is required');
    }

    if (!adminId) {
      throw new AppError(401, 'Authentication required');
    }

    const result = await moderationService.resolveFlag(flagId, adminId, { ...body, flagId });

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Flag resolved successfully',
      data: result,
    });
  });

  /**
   * Get moderation history
   */
  getModerationHistory = catchAsync(async (req: Request, res: Response) => {
    const query = getModerationHistoryQuerySchema.parse(req.query);

    const result = await moderationService.getModerationHistory(
      query.limit,
      query.page,
      query.userId,
      query.action,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Moderation history fetched successfully',
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
   * Get moderation stats
   */
  getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await moderationService.getContentModerationStats();

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Moderation stats fetched successfully',
      data: result,
    });
  });
}

export const moderationController = new ModerationController();
