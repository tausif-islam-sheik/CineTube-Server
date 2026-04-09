import { z } from 'zod';

export const getAnalyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).default('MONTH'),
});

export const getUserStatsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  sortBy: z.enum(['createdAt', 'reviewCount', 'subscriptionStatus']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const getMovieStatsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  sortBy: z.enum(['rating', 'reviewCount', 'watchlistCount']).default('rating'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const getPaymentStatsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
});

export type GetAnalyticsQuery = z.infer<typeof getAnalyticsQuerySchema>;
export type GetUserStatsQuery = z.infer<typeof getUserStatsQuerySchema>;
export type GetMovieStatsQuery = z.infer<typeof getMovieStatsQuerySchema>;
export type GetPaymentStatsQuery = z.infer<typeof getPaymentStatsQuerySchema>;
