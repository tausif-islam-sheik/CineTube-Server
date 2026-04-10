import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.logIn);
router.post("/refresh", AuthController.refresh);
router.post("/logout", requireAuth, AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);

export const AuthRoutes = router;