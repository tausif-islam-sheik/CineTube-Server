import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  subscriptionTierId: z.string().uuid(),
  paymentMethodId: z.string().optional(),
  autoRenew: z.boolean().default(true),
});

export const updateSubscriptionSchema = z.object({
  id: z.string().uuid(),
  autoRenew: z.boolean().optional(),
  subscriptionTierId: z.string().uuid().optional(),
});

export const cancelSubscriptionSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().optional(),
});

export const getSubscriptionSchema = z.object({
  id: z.string().uuid(),
});

export const getSubscriptionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  status: z
    .enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'PAUSED'])
    .optional(),
  sortBy: z.enum(['createdAt', 'renewalDate']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const createSubscriptionTierSchema = z.object({
  name: z.string().min(1, 'Tier name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  features: z.array(z.string()).default([]),
  maxConcurrentStreams: z.number().int().positive().default(1),
  maxDownloads: z.number().int().positive().default(0),
  isActive: z.boolean().default(true),
});

export const updateSubscriptionTierSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  features: z.array(z.string()).optional(),
  maxConcurrentStreams: z.number().int().positive().optional(),
  maxDownloads: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const getSubscriptionTiersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['price', 'createdAt']).default('price'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type GetSubscriptionInput = z.infer<typeof getSubscriptionSchema>;
export type GetSubscriptionsQuery = z.infer<typeof getSubscriptionsQuerySchema>;
export type CreateSubscriptionTierInput = z.infer<typeof createSubscriptionTierSchema>;
export type UpdateSubscriptionTierInput = z.infer<typeof updateSubscriptionTierSchema>;
export type GetSubscriptionTiersQuery = z.infer<typeof getSubscriptionTiersQuerySchema>;
