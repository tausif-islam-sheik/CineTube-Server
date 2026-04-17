import { Request, Response } from 'express';
import { paymentService } from './payments.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import {
  createPaymentIntentSchema,
  createPaymentSchema,
  getPaymentSchema,
  getPaymentsQuerySchema,
} from './payments.validation';
import { AuthenticatedRequest } from '../auth/auth.interface';
import AppError from '../../errorHelpers/AppError';

export class PaymentController {
  /**
   * Create a payment intent
   */
  createPaymentIntent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const body = createPaymentIntentSchema.parse(req.body);
    const userId = req.user?.id;

    const result = await paymentService.createPaymentIntent(userId, body);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Payment intent created successfully',
      data: result,
    });
  });

  /**
   * Create a checkout session
   */
  createCheckoutSession = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { tierId, interval } = req.body;
    const userId = req.user?.id;

    if (!tierId) {
      throw new AppError(400, 'Tier ID is required');
    }

    const result = await paymentService.createCheckoutSession(userId!, tierId, interval);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Checkout session created successfully',
      data: result,
    });
  });

  /**
   * Verify checkout session and fulfill subscription (fallback when webhook fails)
   */
  verifyCheckoutSession = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      throw new AppError(400, 'Session ID is required');
    }

    const result = await paymentService.verifyAndFulfillCheckoutSession(sessionId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Checkout session verified successfully',
      data: result,
    });
  });

  /**
   * Create a payment record
   */
  createPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const body = createPaymentSchema.parse(req.body);
    const userId = req.user?.id;

    const result = await paymentService.createPayment(userId, body);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Payment created successfully',
      data: result,
    });
  });

  /**
   * Get payment by ID
   */
  getPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const params = getPaymentSchema.parse(req.params);

    const result = await paymentService.getPayment(params.id);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Payment fetched successfully',
      data: result,
    });
  });

  /**
   * Get user's payments
   */
  getUserPayments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const query = getPaymentsQuerySchema.parse(req.query);
    const userId = req.user?.id;

    const result = await paymentService.getUserPayments(
      userId,
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User payments fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get all payments (admin only)
   */
  getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const query = getPaymentsQuerySchema.parse(req.query);

    const result = await paymentService.getAllPayments(
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order,
    );

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'All payments fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Refund a payment
   */
  refundPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await paymentService.refundPayment(id, reason);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Payment refunded successfully',
      data: result,
    });
  });

  /**
   * Handle Stripe webhook
   */
  handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return sendResponse(res, {
        httpStatusCode: 400,
        success: false,
        message: 'Missing stripe signature',
      });
    }

    const event = await paymentService.validatePaymentWebhook(req.body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentService.handlePaymentSuccess(event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        await paymentService.handlePaymentFailure(event.data.object.id);
        break;

      case 'checkout.session.completed':
        await paymentService.fulfillSubscription(event.data.object);
        break;

      // Common Stripe noise for Checkout/subscriptions; fulfillment uses checkout.session.completed
      case 'charge.succeeded':
      case 'charge.updated':
      case 'payment_intent.created':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Webhook processed successfully',
    });
  });
}

export const paymentController = new PaymentController();
