import { Router } from 'express';
import { moderationController } from './moderation.controller';
import { requireAuth } from '../../middleware/checkAuth';
import { checkRole } from '../../middleware/checkAuth';

const router: Router = Router();

// Public routes (user can report content)
router.post('/flags', requireAuth, moderationController.flagContent);

// Admin routes
router.post('/reviews/:id/approve', checkRole('ADMIN'), moderationController.approveReview);
router.post('/reviews/:id/reject', checkRole('ADMIN'), moderationController.rejectReview);
router.delete('/comments/:id', checkRole('ADMIN'), moderationController.deleteComment);
router.post('/users/suspend', checkRole('ADMIN'), moderationController.suspendUser);
router.post('/users/:userId/unsuspend', checkRole('ADMIN'), moderationController.unsuspendUser);
router.get('/queue', checkRole('ADMIN'), moderationController.getModerationQueue);
router.get('/flags', checkRole('ADMIN'), moderationController.getFlaggedContent);
router.post('/flags/:flagId/resolve', checkRole('ADMIN'), moderationController.resolveFlag);
router.get('/history', checkRole('ADMIN'), moderationController.getModerationHistory);
router.get('/stats', checkRole('ADMIN'), moderationController.getStats);

export default router;
