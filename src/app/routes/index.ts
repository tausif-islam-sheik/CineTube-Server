import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import MoviesRoutes from "../module/movies/movies.route";
import ReviewsRoutes from "../module/reviews/reviews.route";
import CommentsRoutes from "../module/comments/comments.route";
import LikesRoutes from "../module/likes/likes.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/", MoviesRoutes);
router.use("/", ReviewsRoutes);
router.use("/", CommentsRoutes);
router.use("/", LikesRoutes);

export const IndexRoutes = router;