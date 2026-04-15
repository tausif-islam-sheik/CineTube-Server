/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  RejectReviewInput,
  DeleteCommentInput,
  SuspendUserInput,
  FlagContentInput,
  ResolveFlagInput,
} from './moderation.validation';
import { IModerationService } from './moderation.interface';
import { ReviewStatus } from '../../../generated/prisma';

export class ModerationService implements IModerationService {
  /**
   * Recalculate and update movie's average rating
   */
  private async updateMovieRating(movieId: string) {
    const result = await prisma.review.aggregate({
      where: {
        movieId,
        status: 'APPROVED',
      },
      _avg: {
        rating: true,
      },
    });

    const avgRating = result._avg.rating || 0;

    await prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: Math.round(avgRating * 10) / 10,
      },
    });
  }

  /**
   * Approve a pending review
   */
  async approveReview(id: string, adminId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError(400, 'Only pending reviews can be approved');
      }

      const approved = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.APPROVED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'APPROVED', 'REVIEW', id);

      // Update movie average rating
      await this.updateMovieRating(review.movieId);

      return approved;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to approve review');
    }
  }

  /**
   * Reject a pending review
   */
  async rejectReview(id: string, adminId: string, input: RejectReviewInput) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError(400, 'Only pending reviews can be rejected');
      }

      const rejected = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.REJECTED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'REJECTED', 'REVIEW', id, input.reason);

      // Update movie average rating (in case an approved review was rejected)
      await this.updateMovieRating(review.movieId);

      return rejected;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to reject review');
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string, adminId: string, input: DeleteCommentInput) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          review: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      if (!comment) {
        throw new AppError(404, 'Comment not found');
      }

      const deleted = await prisma.comment.delete({
        where: { id },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'DELETED', 'COMMENT', id, input.reason);

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete comment');
    }
  }

  /**
   * Suspend a user
   */
  async suspendUser(input: SuspendUserInput, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const suspendUntil = input.duration
        ? new Date(Date.now() + input.duration * 24 * 60 * 60 * 1000)
        : null;

      const suspended = await prisma.user.update({
        where: { id: input.userId },
        data: {
          status: 'BLOCKED',
        },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'SUSPENDED', 'USER', input.userId, input.reason);

      return suspended;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to suspend user');
    }
  }

  /**
   * Unsuspend a user
   */
  async unsuspendUser(userId: string, adminId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      if (user.status !== 'BLOCKED') {
        throw new AppError(400, 'User is not blocked');
      }

      const unsuspended = await prisma.user.update({
        where: { id: userId },
        data: { status: 'ACTIVE' },
      });

      // Log moderation action
      await this.logModerationAction(adminId, 'UNSUSPENDED', 'USER', userId);

      return unsuspended;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to unsuspend user');
    }
  }

  /**
   * Flag content for moderation review
   */
  async flagContent(userId: string, input: FlagContentInput) {
    throw new AppError(501, 'Flag functionality not yet implemented - Flag model does not exist');
  }

  /**
   * Get moderation queue (pending reviews and comments)
   */
  async getModerationQueue(
    limit: number = 20,
    page: number = 1,
    status?: string,
    type?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      // Get pending reviews and comments
      const [pendingReviews, pendingComments, totalReviews, totalComments] = await Promise.all([
        type === 'COMMENT' || !type
          ? prisma.comment.findMany({
              where: {},
              skip: type === 'COMMENT' ? skip : 0,
              take: type === 'COMMENT' ? limit : undefined,
              orderBy: { [sortBy]: order as any },
              include: {
                review: true,
                user: { select: { id: true, email: true, name: true } },
              },
            })
          : Promise.resolve([]),
        type === 'REVIEW' || !type
          ? prisma.review.findMany({
              where: { status: ReviewStatus.PENDING },
              skip: type === 'REVIEW' ? skip : 0,
              take: type === 'REVIEW' ? limit : undefined,
              orderBy: { [sortBy]: order as any },
              include: {
                movie: true,
                user: { select: { id: true, email: true, name: true } },
              },
            })
          : Promise.resolve([]),
        type === 'COMMENT' || !type ? prisma.comment.count() : Promise.resolve(0),
        type === 'REVIEW' || !type ? prisma.review.count({ where: { status: ReviewStatus.PENDING } }) : Promise.resolve(0),
      ]);

      const total = totalReviews + totalComments;
      const pages = Math.ceil(total / limit);

      const combined = [
        ...pendingComments.map((r) => ({ type: 'COMMENT', data: r })),
        ...pendingReviews.map((r) => ({ type: 'REVIEW', data: r })),
      ];

      return {
        data: combined,
        pagination: { total, page, limit, pages },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch moderation queue');
    }
  }

  /**
   * Get flagged content
   */
  async getFlaggedContent(
    limit: number = 20,
    page: number = 1,
    contentType?: string,
    status: string = 'PENDING',
    sortBy: string = 'flagCount',
    order: string = 'desc',
  ) {
    throw new AppError(501, 'Flag functionality not yet implemented - Flag model does not exist');
  }

  /**
   * Resolve a flagged content
   */
  async resolveFlag(flagId: string, adminId: string, input: ResolveFlagInput) {
    throw new AppError(501, 'Flag functionality not yet implemented - Flag model does not exist');
  }

  /**
   * Get moderation history
   */
  async getModerationHistory(
    limit: number = 20,
    page: number = 1,
    userId?: string,
    action?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    // ModerationLog not implemented yet
    return {
      data: [],
      pagination: { total: 0, page, limit, pages: 0 },
    };
  }

  /**
   * Get content moderation stats
   */
  async getContentModerationStats() {
    try {
      const [pendingReviewsCount, approvedReviewsCount, rejectedReviewsCount, flagsCount, suspendedUsersCount] = await Promise.all([
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
        prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
        Promise.resolve(0),  // Flag model not implemented
        prisma.user.count({ where: { status: 'BLOCKED' } }),
      ]);

      return {
        reviews: {
          pending: pendingReviewsCount,
          approved: approvedReviewsCount,
          rejected: rejectedReviewsCount,
        },
        flaggedContent: flagsCount,
        blockedUsers: suspendedUsersCount,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch moderation stats');
    }
  }

  /**
   * Private method to log moderation actions
   */
  private async logModerationAction(
    adminId: string,
    action: string,
    contentType: string,
    contentId: string,
    notes?: string,
  ) {
    try {
      await prisma.moderationLog.create({
        data: {
          adminId,
          action,
          contentType,
          contentId,
          notes,
        },
      });
    } catch (error) {
      console.error('Failed to log moderation action:', error);
    }
  }
}

export const moderationService = new ModerationService();
