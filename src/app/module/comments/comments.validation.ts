/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    reviewId: z.string().uuid('Invalid review ID'),
    content: z.string().min(1, 'Content is required').max(1000),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(1000),
  }),
});

export const getCommentsQuerySchema = z.object({
  query: z.object({
    reviewId: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid comment ID'),
  }),
});

export const updateCommentParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid comment ID'),
  }),
});

// Export types
export type CreateCommentInput = z.infer<typeof createCommentSchema>['body'];
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>['body'];
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>['query'];
