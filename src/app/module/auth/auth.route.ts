import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middleware/checkAuth";
import { passwordResetLimiter, authLimiter } from "../../middleware/rateLimiter";

const router = Router();

// Authentication routes with rate limiting
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.logIn);
router.post("/refresh", AuthController.refresh);
router.post("/logout", requireAuth, AuthController.logout);

// Password reset routes with strict rate limiting
router.post("/forgot-password", passwordResetLimiter, AuthController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, AuthController.resetPassword);

router.post("/verify-email", AuthController.verifyEmail);

export const AuthRoutes: Router = router;