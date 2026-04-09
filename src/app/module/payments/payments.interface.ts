import { CreatePaymentInput, CreatePaymentIntentInput, GetPaymentsQuery } from './payments.validation';

export interface IPaymentService {
  createPaymentIntent(userId: string, input: CreatePaymentIntentInput): Promise<any>;
  createPayment(userId: string, input: CreatePaymentInput): Promise<any>;
  getPayment(id: string): Promise<any>;
  getUserPayments(userId: string, limit: number, page: number, status?: string, sortBy?: string, order?: string): Promise<any>;
  getAllPayments(limit: number, page: number, status?: string, sortBy?: string, order?: string): Promise<any>;
  validatePaymentWebhook(body: any, signature: string): Promise<any>;
  handlePaymentSuccess(paymentIntentId: string): Promise<any>;
  handlePaymentFailure(paymentIntentId: string): Promise<any>;
  refundPayment(paymentId: string, reason?: string): Promise<any>;
}
