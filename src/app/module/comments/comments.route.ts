import { Router } from 'express';
import { CommentsController } from './comments.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/comments', CommentsController.getComments);
router.get('/reviews/:reviewId/comments', CommentsController.getReviewComments);

/**
 * Protected routes (authentication required)
 */
router.post('/comments', requireAuth, CommentsController.createComment);
router.patch('/comments/:id', requireAuth, CommentsController.updateComment);
router.delete('/comments/:id', requireAuth, CommentsController.deleteComment);

export default router;
