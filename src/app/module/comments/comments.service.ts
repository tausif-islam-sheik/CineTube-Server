/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { CreateCommentInput, UpdateCommentInput, GetCommentsQuery } from './comments.validation';
import { ICommentsService } from './comments.interface';

export class CommentsService implements ICommentsService {
  /**
   * Create a new comment on a review
   */
  async createComment(userId: string, data: CreateCommentInput) {
    try {
      // Check if review exists
      const review = await prisma.review.findUnique({
        where: { id: data.reviewId },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      const comment = await prisma.comment.create({
        data: {
          reviewId: data.reviewId,
          userId,
          content: data.content,
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create comment');
    }
  }

  /**
   * Get comments with filters and pagination
   */
  async getComments(filters: GetCommentsQuery): Promise<any> {
    try {
      const { reviewId, limit = 10, page = 1 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {};
      if (reviewId) {
        whereClause.reviewId = reviewId;
      }

      // Fetch data
      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: whereClause }),
        prisma.comment.findMany({
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
        data: comments,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch comments');
    }
  }

  /**
   * Update a comment (user can only update own comment)
   */
  async updateComment(id: string, userId: string, data: UpdateCommentInput) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new AppError(404, 'Comment not found');
      }

      // Check if user is the owner
      if (comment.userId !== userId) {
        throw new AppError(403, 'You can only update your own comments');
      }

      const updatedComment = await prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
        },
      });

      return updatedComment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update comment');
    }
  }

  /**
   * Delete a comment (user can only delete own comment)
   */
  async deleteComment(id: string, userId: string) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new AppError(404, 'Comment not found');
      }

      // Check if user is the owner
      if (comment.userId !== userId) {
        throw new AppError(403, 'You can only delete your own comments');
      }

      const deletedComment = await prisma.comment.delete({
        where: { id },
      });

      return deletedComment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete comment');
    }
  }

  /**
   * Get comments for a specific review
   */
  async getReviewComments(reviewId: string, limit: number = 10, page: number = 1) {
    try {
      const skip = (page - 1) * limit;

      // Check if review exists
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { reviewId } }),
        prisma.comment.findMany({
          where: { reviewId },
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
        data: comments,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch review comments');
    }
  }
}

export const commentsService = new CommentsService();
