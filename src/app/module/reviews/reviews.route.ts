import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router: Router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/reviews', ReviewsController.getReviews);
router.get('/reviews/:id', ReviewsController.getReviewById);
router.get('/movies/:movieId/reviews', ReviewsController.getMovieReviews);

/**
 * Protected routes (authentication required)
 */
router.post('/reviews', requireAuth, ReviewsController.createReview);
router.patch('/reviews/:id', requireAuth, ReviewsController.updateReview);
router.delete('/reviews/:id', requireAuth, ReviewsController.deleteReview);

export default router;
