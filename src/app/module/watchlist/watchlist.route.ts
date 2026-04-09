import { Router } from 'express';
import { watchlistController } from './watchlist.controller';
import { requireAuth } from '../../middleware/checkAuth';

const router = Router();

// Protected routes (require authentication)
router.post('/', requireAuth, watchlistController.addToWatchlist);
router.delete('/:id', requireAuth, watchlistController.removeFromWatchlist);
router.get('/user/watchlist', requireAuth, watchlistController.getUserWatchlist);
router.get('/count/:userId', watchlistController.getWatchlistCount);

// Public route that returns watchlist status for authenticated user's movie
router.get('/check', requireAuth, watchlistController.checkIfInWatchlist);

export default router;
