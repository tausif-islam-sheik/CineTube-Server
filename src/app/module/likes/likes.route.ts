import { Router } from 'express';
import { LikesController } from './likes.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/likes', LikesController.getLikes);
router.get('/movies/:movieId/likes', LikesController.getMovieLikes);
router.get('/movies/:movieId/likes/count', LikesController.getMovieLikesCount);

/**
 * Protected routes (authentication required)
 */
router.post('/likes', requireAuth, LikesController.toggleLike);
router.get('/user/likes', requireAuth, LikesController.getUserLikes);

export default router;
