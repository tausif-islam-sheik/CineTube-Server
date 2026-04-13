import { Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { userProfileService } from "./user-profile.service";
import { updateProfileSchema } from "./user-profile.validation";

export class UserProfileController {
  static getProfile = catchAsync(async (req: any, res: Response) => {
    const profile = await userProfileService.getProfile(req.user.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  });

  static updateProfile = catchAsync(async (req: any, res: Response) => {
    const validated = updateProfileSchema.parse({ body: req.body });
    const updated = await userProfileService.updateProfile(req.user.id, validated.body);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  });
}
