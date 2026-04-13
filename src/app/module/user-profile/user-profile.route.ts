import { Router } from "express";
import { requireAuth } from "../../middleware/checkAuth";
import { UserProfileController } from "./user-profile.controller";

const router = Router();

router.get("/user/profile", requireAuth, UserProfileController.getProfile);
router.patch("/user/profile", requireAuth, UserProfileController.updateProfile);

export default router;
