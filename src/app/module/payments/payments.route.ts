import { Router } from 'express';
import { paymentController } from './payments.controller';
import { requireAuth } from '../../middleware/checkAuth';
import { checkRole } from '../../middleware/checkAuth';

const router = Router();

// Protected routes (require authentication)
router.post('/payments/intent', requireAuth, paymentController.createPaymentIntent);
router.post('/payments/checkout-session', requireAuth, paymentController.createCheckoutSession);
router.get('/payments/verify-session', requireAuth, paymentController.verifyCheckoutSession);
router.post('/payments', requireAuth, paymentController.createPayment);
router.get('/payments/:id', requireAuth, paymentController.getPayment);
router.get('/user/payments', requireAuth, paymentController.getUserPayments);
router.post('/payments/:id/refund', requireAuth, paymentController.refundPayment);

// Admin routes
router.get('/payments', checkRole('ADMIN'), paymentController.getAllPayments);

// Webhook route (public - signature verified)
router.post('/webhooks/stripe', paymentController.handleWebhook);

export default router;
