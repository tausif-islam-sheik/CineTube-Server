/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { commentsService } from './comments.service';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';
import {
  createCommentSchema,
  updateCommentSchema,
  getCommentsQuerySchema,
  deleteCommentSchema,
  updateCommentParamsSchema,
} from './comments.validation';
import AppError from '../../errorHelpers/AppError';

export class CommentsController {
  /**
   * Create a new comment on a review
   */
  static createComment = catchAsync(async (req: any, res: Response) => {
    const validatedData = createCommentSchema.parse({ body: req.body });

    const comment = await commentsService.createComment(req.user.id, validatedData.body);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Comment created successfully',
      data: comment,
    });
  });

  /**
   * Get all comments with filters and pagination
   */
  static getComments = catchAsync(async (req: any, res: Response) => {
    const validatedQuery = getCommentsQuerySchema.parse({ query: req.query });

    const result = await commentsService.getComments(validatedQuery.query);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Comments retrieved successfully',
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
   * Get comments for a specific review
   */
  static getReviewComments = catchAsync(async (req: any, res: Response) => {
    const { reviewId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const result = await commentsService.getReviewComments(
      reviewId,
      parseInt(limit as string),
      parseInt(page as string),
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Review comments retrieved successfully',
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
   * Update a comment (user can only update own comment)
   */
  static updateComment = catchAsync(async (req: any, res: Response) => {
    const validatedParams = updateCommentParamsSchema.parse({ params: req.params });
    const validatedData = updateCommentSchema.parse({ body: req.body });

    const comment = await commentsService.updateComment(
      validatedParams.params.id,
      req.user.id,
      validatedData.body,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    });
  });

  /**
   * Delete a comment (user can only delete own comment)
   */
  static deleteComment = catchAsync(async (req: any, res: Response) => {
    const validatedParams = deleteCommentSchema.parse({ params: req.params });

    await commentsService.deleteComment(validatedParams.params.id, req.user.id);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Comment deleted successfully',
      data: null,
    });
  });
}
