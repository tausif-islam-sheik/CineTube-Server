import { z } from 'zod';

export const createMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    genre: z.array(z.string()).min(1, 'At least one genre is required'),
    releaseYear: z.number().int().min(1800).max(new Date().getFullYear() + 5),
    director: z.string().min(1),
    cast: z.array(z.string()).default([]),
    platform: z.string().min(1, 'Platform is required'),
    posterUrl: z.string().url('Invalid poster URL').optional(),
    trailerUrl: z.string().url('Invalid trailer URL').optional(),
    duration: z.number().int().min(1, 'Duration must be at least 1 minute').optional(),
    language: z.array(z.string()).default(['English']),
    pricing: z.enum(['FREE', 'PREMIUM']).default('PREMIUM'),
    price: z.number().min(0).optional(),
    youtubeLink: z.string().url('Invalid YouTube URL').optional(),
  }),
});

export const updateMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(10).optional(),
    genre: z.array(z.string()).min(1).optional(),
    releaseYear: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
    director: z.string().min(1).optional(),
    cast: z.array(z.string()).optional(),
    platform: z.string().min(1).optional(),
    posterUrl: z.string().url().optional().or(z.literal('')),
    trailerUrl: z.string().url().optional().or(z.literal('')),
    duration: z.number().int().min(1).optional(),
    language: z.array(z.string()).optional(),
    pricing: z.enum(['FREE', 'PREMIUM']).optional(),
    price: z.number().min(0).optional(),
    youtubeLink: z.string().url().optional().or(z.literal('')),
  }),
});

export const getMoviesQuerySchema = z.object({
  query: z.object({
    // Pagination
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),

    // Filtering
    genre: z.string().optional(),
    releaseYear: z.coerce.number().int().min(1800).optional(),
    pricing: z.enum(['FREE', 'PREMIUM']).optional(),
    language: z.string().optional(),
    minRating: z.coerce.number().min(0).max(10).optional(),
    maxRating: z.coerce.number().min(0).max(10).optional(),

    // Sorting
    sortBy: z.enum(['rating', 'releaseYear', 'createdAt', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),

    // Search
    search: z.string().optional(),
  }),
});

export const getMovieBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const deleteMovieSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid movie ID'),
  }),
});

export const updateMovieParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid movie ID'),
  }),
});

// Export types
export type CreateMovieInput = z.infer<typeof createMovieSchema>['body'];
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>['body'];
export type GetMoviesQuery = z.infer<typeof getMoviesQuerySchema>['query'];
