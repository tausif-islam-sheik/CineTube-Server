import { Router } from 'express';
import { subscriptionController } from './subscriptions.controller';
import { requireAuth } from '../../middleware/checkAuth';
import { checkRole } from '../../middleware/checkAuth';

const router = Router();

// Public routes
router.get('/subscription-tiers', subscriptionController.getSubscriptionTiers);
router.get('/subscription-tiers/:id', subscriptionController.getSubscriptionTier);

// Protected routes (require authentication)
router.post('/subscriptions', requireAuth, subscriptionController.createSubscription);
router.get('/subscriptions/:id', requireAuth, subscriptionController.getSubscription);
router.get('/user/subscription', requireAuth, subscriptionController.getUserSubscription);
router.get('/user/subscriptions', requireAuth, subscriptionController.getUserSubscriptions);
router.patch('/subscriptions/:id', requireAuth, subscriptionController.updateSubscription);
router.post('/subscriptions/:id/cancel', requireAuth, subscriptionController.cancelSubscription);
router.get('/check-access', requireAuth, subscriptionController.checkSubscriptionAccess);

// Admin routes
router.post('/subscription-tiers', checkRole('ADMIN'), subscriptionController.createSubscriptionTier);
router.patch('/subscription-tiers/:id', checkRole('ADMIN'), subscriptionController.updateSubscriptionTier);
router.delete('/subscription-tiers/:id', checkRole('ADMIN'), subscriptionController.deleteSubscriptionTier);
router.get('/subscriptions', checkRole('ADMIN'), subscriptionController.getAllSubscriptions);
router.post('/subscriptions/renew', checkRole('ADMIN'), subscriptionController.renewSubscriptions);

export default router;
