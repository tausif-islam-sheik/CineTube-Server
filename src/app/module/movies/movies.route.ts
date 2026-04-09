import { Router } from 'express';
import { MoviesController } from './movies.controller';
import { requireAuth } from '../../middleware/checkAuth';
import { AuthenticatedRequest } from '../../middleware/checkAuth';

const router = Router();

/**
 * Public routes (no auth required)
 */
router.get('/movies', MoviesController.getMovies);
router.get('/movies/:slug', MoviesController.getMovieBySlug);

/**
 * Admin only routes
 */
router.post('/movies', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  // Check if user is admin
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: 'Only admins can create movies',
    });
  }
  next();
}, MoviesController.createMovie);

router.patch('/movies/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  // Check if user is admin
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: 'Only admins can update movies',
    });
  }
  next();
}, MoviesController.updateMovie);

router.delete('/movies/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  // Check if user is admin
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: 'Only admins can delete movies',
    });
  }
  next();
}, MoviesController.deleteMovie);

export default router;
