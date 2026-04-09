import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['USER', 'ADMIN']),
});

export const updateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DELETED']),
});

export const getUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  role: z.enum(['USER', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DELETED']).optional(),
  sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const getUserSchema = z.object({
  userId: z.string().uuid(),
});

export const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const updateUserSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().optional(),
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().optional(),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
