/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    movieId: z.string().uuid('Invalid movie ID'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(10, 'Rating cannot exceed 10'),
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(5000),
    containsSpoiler: z.boolean().default(false),
    tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(10).optional(),
    title: z.string().min(3).max(100).optional(),
    comment: z.string().min(10).max(5000).optional(),
    containsSpoiler: z.boolean().optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(8).optional(),
  }),
});

export const getReviewsQuerySchema = z.object({
  query: z.object({
    movieId: z.string().uuid().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    tag: z.string().trim().min(1).max(30).optional(),
    spoiler: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    sortBy: z.enum(['rating', 'createdAt', 'likes']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
  }),
});

export const getReviewByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid review ID'),
  }),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid review ID'),
  }),
});

export const updateReviewParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid review ID'),
  }),
});

// Export types
export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body'];
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>['query'];
