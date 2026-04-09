/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  body: z.object({
    movieId: z.string().uuid('Invalid movie ID'),
  }),
});

export const removeFromWatchlistSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid watchlist ID'),
  }),
});

export const getWatchlistQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
    sortBy: z.enum(['addedAt', 'title']).default('addedAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const checkWatchlistSchema = z.object({
  params: z.object({
    movieId: z.string().uuid('Invalid movie ID'),
  }),
});

// Export types
export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>['body'];
export type GetWatchlistQuery = z.infer<typeof getWatchlistQuerySchema>['query'];
