import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { checkRole } from '../../middleware/checkAuth';

const router = Router();

// All admin routes
router.get('/analytics', checkRole('ADMIN'), analyticsController.getDashboard);
router.get('/analytics/users', checkRole('ADMIN'), analyticsController.getUserStats);
router.get('/analytics/movies', checkRole('ADMIN'), analyticsController.getMovieStats);
router.get('/analytics/payments', checkRole('ADMIN'), analyticsController.getPaymentStats);
router.get('/analytics/subscriptions', checkRole('ADMIN'), analyticsController.getSubscriptionStats);
router.get('/analytics/engagement', checkRole('ADMIN'), analyticsController.getEngagementStats);
router.get('/analytics/content-performance', checkRole('ADMIN'), analyticsController.getContentPerformance);
router.get('/analytics/user-growth', checkRole('ADMIN'), analyticsController.getUserGrowth);
router.get('/analytics/revenue', checkRole('ADMIN'), analyticsController.getRevenueStats);

export default router;
