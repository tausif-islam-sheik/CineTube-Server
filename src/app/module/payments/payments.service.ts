/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../../lib/stripe';
import AppError from '../../errorHelpers/AppError';
import { CreatePaymentInput, CreatePaymentIntentInput } from './payments.validation';
import { IPaymentService } from './payments.interface';
import { PaymentStatus } from '../../../generated/prisma/enums';

export class PaymentService implements IPaymentService {
  /**
   * Create a payment intent with Stripe
   */
  async createPaymentIntent(userId: string, input: CreatePaymentIntentInput) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const intent = await stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100), // Convert to cents
        currency: input.currency || 'usd',
        description: input.description || `Payment for CineTube - User: ${user.email}`,
        metadata: {
          userId,
          email: user.email,
        },
      });

      return {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        amount: input.amount,
        currency: input.currency || 'usd',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create payment intent');
    }
  }

  /**
   * Create a payment record after successful Stripe payment
   */
  async createPayment(userId: string, input: CreatePaymentInput) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      // Verify payment intent exists and belongs to user
      const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);

      if (!intent) {
        throw new AppError(404, 'Payment intent not found');
      }

      if (intent.metadata?.userId !== userId) {
        throw new AppError(403, 'Payment intent does not belong to this user');
      }

      const payment = await prisma.payment.create({
        data: {
          userId,
          amount: input.amount,
          currency: input.currency,
          status: PaymentStatus.PENDING,
          paymentMethod: input.method,
          description: input.description,
          transactionId: input.paymentIntentId,
          gateway: 'STRIPE',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return payment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create payment');
    }
  }

  /**
   * Get a single payment by ID
   */
  async getPayment(id: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch payment');
    }
  }

  /**
   * Get user's payments with pagination
   */
  async getUserPayments(
    userId: string,
    limit: number = 10,
    page: number = 1,
    status?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = { userId };
      if (status) {
        whereClause.status = status;
      }

      const [total, payments] = await Promise.all([
        prisma.payment.count({ where: whereClause }),
        prisma.payment.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: payments,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch {
      throw new AppError(500, 'Failed to fetch user payments');
    }
  }

  /**
   * Get all payments (admin only)
   */
  async getAllPayments(
    limit: number = 10,
    page: number = 1,
    status?: string,
    sortBy: string = 'createdAt',
    order: string = 'desc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }

      const [total, payments] = await Promise.all([
        prisma.payment.count({ where: whereClause }),
        prisma.payment.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order as any },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: payments,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch {
      throw new AppError(500, 'Failed to fetch payments');
    }
  }

  /**
   * Validate webhook signature from Stripe
   */
  async validatePaymentWebhook(body: any, signature: string): Promise<any> {
    try {
      if (!STRIPE_WEBHOOK_SECRET) {
        throw new AppError(500, 'Stripe webhook secret not configured');
      }

      const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      return event;
    } catch {
      throw new AppError(400, 'Invalid webhook signature');
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntentId: string) {
    try {
      const payment = await prisma.payment.findFirst({
        where: { transactionId: paymentIntentId },
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return updated;
    } catch (_error) {
      if (_error instanceof AppError) throw _error;
      throw new AppError(500, 'Failed to process payment success');
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntentId: string) {
    try {
      const payment = await prisma.payment.findFirst({
        where: { transactionId: paymentIntentId },
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return updated;
    } catch (_error) {
      if (_error instanceof AppError) throw _error;
      throw new AppError(500, 'Failed to process payment failure');
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, reason?: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new AppError(400, 'Only completed payments can be refunded');
      }

      if (!payment.transactionId) {
        throw new AppError(400, 'Payment has no transaction ID to refund');
      }

      // Create refund with Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        reason: (reason || 'requested_by_customer') as any,
      });

      // Update payment status
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REFUNDED,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return {
        payment: updated,
        refund: {
          id: refund.id,
          amount: refund.amount,
          status: refund.status,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to refund payment');
    }
  }
}

export const paymentService = new PaymentService();
