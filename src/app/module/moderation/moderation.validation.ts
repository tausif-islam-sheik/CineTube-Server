import { z } from 'zod';

export const approveReviewSchema = z.object({
  id: z.string().uuid(),
});

export const rejectReviewSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(1, 'Rejection reason is required'),
});

export const deleteCommentSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().optional(),
});

export const suspendUserSchema = z.object({
  userId: z.string().uuid(),
  duration: z.number().int().positive().optional(),
  reason: z.string().min(1, 'Suspension reason is required'),
});

export const unsuspendUserSchema = z.object({
  userId: z.string().uuid(),
});

export const getModerationQueueQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  type: z.enum(['REVIEW', 'COMMENT']).optional(),
  sortBy: z.enum(['createdAt', 'reportCount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const flagContentSchema = z.object({
  contentId: z.string().uuid(),
  contentType: z.enum(['REVIEW', 'COMMENT', 'USER']),
  reason: z.string().min(1, 'Flag reason is required'),
  description: z.string().optional(),
});

export const getFlaggedContentQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  contentType: z.enum(['REVIEW', 'COMMENT', 'USER']).optional(),
  status: z.enum(['PENDING', 'RESOLVED']).default('PENDING'),
  sortBy: z.enum(['createdAt', 'flagCount']).default('flagCount'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const resolveFlagSchema = z.object({
  flagId: z.string().uuid(),
  action: z.enum(['APPROVED', 'DELETED', 'WARNED']),
  notes: z.string().optional(),
});

export const getModerationHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  userId: z.string().uuid().optional(),
  action: z.enum(['APPROVED', 'REJECTED', 'DELETED', 'SUSPENDED']).optional(),
  sortBy: z.enum(['createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ApproveReviewInput = z.infer<typeof approveReviewSchema>;
export type RejectReviewInput = z.infer<typeof rejectReviewSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;
export type UnsuspendUserInput = z.infer<typeof unsuspendUserSchema>;
export type FlagContentInput = z.infer<typeof flagContentSchema>;
export type ResolveFlagInput = z.infer<typeof resolveFlagSchema>;
export type GetModerationQueueQuery = z.infer<typeof getModerationQueueQuerySchema>;
export type GetFlaggedContentQuery = z.infer<typeof getFlaggedContentQuerySchema>;
export type GetModerationHistoryQuery = z.infer<typeof getModerationHistoryQuerySchema>;
