import { Router } from 'express';
import { LikesController } from './likes.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/likes', LikesController.getLikes);
router.get('/reviews/:reviewId/likes', LikesController.getReviewLikes);
router.get('/reviews/:reviewId/likes/count', LikesController.getReviewLikesCount);

/**
 * Protected routes (authentication required)
 */
router.post('/likes', requireAuth, LikesController.toggleLike);
router.get('/user/likes', requireAuth, LikesController.getUserLikes);

export default router;
