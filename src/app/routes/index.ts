import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import MoviesRoutes from "../module/movies/movies.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/", MoviesRoutes);

export const IndexRoutes = router;