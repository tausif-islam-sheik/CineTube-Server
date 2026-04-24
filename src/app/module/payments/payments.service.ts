/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../../lib/stripe';
import { emailService } from '../../lib/email';
import AppError from '../../errorHelpers/AppError';
import { CreatePaymentInput, CreatePaymentIntentInput } from './payments.validation';
import { IPaymentService } from './payments.interface';
import { PaymentStatus, SubscriptionStatus } from '../../../generated/enums';

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
   * Create a checkout session for subscriptions
   */
  async createCheckoutSession(userId: string, tierId: string, interval?: 'monthly' | 'yearly') {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError(404, 'User not found');

      const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
      if (!tier) throw new AppError(404, 'Subscription tier not found');

      // Dynamic price mapping for PREMIUM tier
      let price = tier.price;
      let stripeInterval: 'month' | 'year' = tier.billingCycle === 12 ? 'year' : 'month';

      if (tier.name === 'PREMIUM' && interval) {
        if (interval === 'yearly') {
          price = 79.99;
          stripeInterval = 'year';
        } else {
          price = 9.99;
          stripeInterval = 'month';
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: tier.currency || 'usd',
              product_data: {
                name: `${tier.displayName} (${interval === 'yearly' ? 'Yearly' : 'Monthly'})`,
                description: tier.description || '',
              },
              unit_amount: Math.round(price * 100),
              recurring: {
                interval: stripeInterval,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        customer_email: user.email,
        metadata: {
          userId,
          tierId,
          interval: interval || (tier.billingCycle === 12 ? 'yearly' : 'monthly'),
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error: any) {
      console.error('Stripe Checkout Error:', error);
      throw new AppError(500, error.message || 'Failed to create checkout session');
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

      // Checkout subscriptions record payment on checkout.session.completed (transactionId = session id).
      // payment_intent.succeeded still fires for the underlying PI; no row keyed by PI id — skip quietly.
      if (!payment) {
        return null;
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
   * Fulfill a subscription after successful checkout
   */
  async fulfillSubscription(session: any) {
    const { userId, tierId, interval } = session.metadata;
    if (!userId || !tierId) {
      console.error('[PaymentService] Missing userId or tierId in session metadata:', session.metadata);
      throw new AppError(400, 'Missing userId or tierId in session metadata');
    }

    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    if (!tier) {
      console.error('[PaymentService] Subscription tier not found:', tierId);
      throw new AppError(404, 'Subscription tier not found');
    }

    // Get user info for email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('[PaymentService] User not found:', userId);
      throw new AppError(404, 'User not found');
    }

    // Calculate end date
    const endDate = new Date();
    if (interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await prisma.$transaction([
      // Create or Update subscription
      prisma.subscription.upsert({
        where: { userId },
        update: {
          tierId,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          endDate,
          autoRenew: true,
        },
        create: {
          userId,
          tierId,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          endDate,
          autoRenew: true,
        },
      }),
      // Create payment record
      prisma.payment.create({
        data: {
          userId,
          amount: tier.price,
          currency: tier.currency || 'usd',
          status: PaymentStatus.COMPLETED,
          paymentMethod: 'STRIPE',
          gateway: 'STRIPE',
          transactionId: session.id,
        },
      }),
    ]);

    // Send invoice email
    try {
      await emailService.sendPaymentReceipt({
        email: user.email,
        name: user.name || 'User',
        amount: tier.price,
        currency: tier.currency || 'USD',
        transactionId: session.id,
        subscriptionTier: tier.displayName || tier.name,
        billingDate: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('[PaymentService] Failed to send invoice email:', error);
      // Don't throw - subscription is already created
    }
  }

  /**
   * Verify checkout session and fulfill subscription (fallback for webhook)
   */
  async verifyAndFulfillCheckoutSession(sessionId: string) {
    try {
      // Retrieve session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        throw new AppError(404, 'Checkout session not found');
      }

      // Check if payment was successful
      if (session.payment_status !== 'paid') {
        throw new AppError(400, `Payment status is ${session.payment_status}`);
      }

      const { userId, tierId } = session.metadata || {};
      
      if (!userId || !tierId) {
        throw new AppError(400, 'Missing userId or tierId in session metadata');
      }

      // Check if subscription already exists
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription && existingSubscription.status === 'ACTIVE') {
        return {
          message: 'Subscription already active',
          subscription: existingSubscription,
        };
      }

      // Check if payment already recorded
      const existingPayment = await prisma.payment.findFirst({
        where: { transactionId: sessionId },
      });

      if (existingPayment) {
        return {
          message: 'Payment already recorded',
          payment: existingPayment,
        };
      }

      // Fulfill the subscription
      await this.fulfillSubscription(session);

      // Return the created subscription and payment
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { tier: true },
      });

      const payment = await prisma.payment.findFirst({
        where: { transactionId: sessionId },
      });

      return {
        message: 'Subscription activated successfully',
        subscription,
        payment,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[PaymentService] Failed to verify checkout session:', error);
      throw new AppError(500, 'Failed to verify checkout session');
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
        return null;
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
