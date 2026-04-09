/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export const createLikeSchema = z.object({
  body: z.object({
    movieId: z.string().uuid('Invalid movie ID'),
  }),
});

export const getLikesQuerySchema = z.object({
  query: z.object({
    movieId: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
  }),
});

export const deleteLikeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid like ID'),
  }),
});

// Export types
export type CreateLikeInput = z.infer<typeof createLikeSchema>['body'];
export type GetLikesQuery = z.infer<typeof getLikesQuerySchema>['query'];
