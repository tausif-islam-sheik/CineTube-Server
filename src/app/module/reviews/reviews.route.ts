import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router: Router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/reviews', ReviewsController.getReviews);
router.get('/movies/:movieId/reviews', ReviewsController.getMovieReviews);

/**
 * Protected routes (authentication required)
 * Note: /reviews/my must come BEFORE /reviews/:id to avoid "my" being treated as an ID
 */
router.get('/reviews/my', requireAuth, ReviewsController.getMyReviews);
router.get('/reviews/:id', ReviewsController.getReviewById);
router.post('/reviews', requireAuth, ReviewsController.createReview);
router.patch('/reviews/:id', requireAuth, ReviewsController.updateReview);
router.delete('/reviews/:id', requireAuth, ReviewsController.deleteReview);

export default router;
