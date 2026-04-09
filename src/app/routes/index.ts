import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import MoviesRoutes from "../module/movies/movies.route";
import ReviewsRoutes from "../module/reviews/reviews.route";
import CommentsRoutes from "../module/comments/comments.route";
import LikesRoutes from "../module/likes/likes.route";
import WatchlistRoutes from "../module/watchlist/watchlist.route";
import PaymentsRoutes from "../module/payments/payments.route";
import SubscriptionsRoutes from "../module/subscriptions/subscriptions.route";
import ModerationRoutes from "../module/moderation/moderation.route";
import AnalyticsRoutes from "../module/analytics/analytics.route";
import AdminRoutes from "../module/admin/admin.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/", MoviesRoutes);
router.use("/", ReviewsRoutes);
router.use("/", CommentsRoutes);
router.use("/", LikesRoutes);
router.use("/watchlist", WatchlistRoutes);
router.use("/", PaymentsRoutes);
router.use("/", SubscriptionsRoutes);
router.use("/moderation", ModerationRoutes);
router.use("/", AnalyticsRoutes);
router.use("/", AdminRoutes);

export const IndexRoutes = router;