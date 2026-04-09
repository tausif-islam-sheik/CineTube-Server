import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  description: z.string().optional(),
});

export const createPaymentSchema = z.object({
  paymentIntentId: z.string(),
  amount: z.number().positive(),
  currency: z.string(),
  method: z.enum(['CARD', 'WALLET', 'BANK_TRANSFER']),
  description: z.string().optional(),
});

export const getPaymentSchema = z.object({
  id: z.string().uuid(),
});

export const getPaymentsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  status: z
    .enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
    .optional(),
  sortBy: z.enum(['createdAt', 'amount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const handlePaymentWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      status: z.string(),
      amount: z.number(),
      currency: z.string(),
      metadata: z.record(z.string()).optional(),
    }),
  }),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type GetPaymentInput = z.infer<typeof getPaymentSchema>;
export type GetPaymentsQuery = z.infer<typeof getPaymentsQuerySchema>;
export type HandlePaymentWebhookInput = z.infer<typeof handlePaymentWebhookSchema>;
