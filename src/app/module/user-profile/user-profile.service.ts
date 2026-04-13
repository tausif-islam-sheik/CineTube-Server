import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { UpdateProfileInput } from "./user-profile.validation";

export class UserProfileService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name,
        image: payload.image === "" ? null : payload.image,
        phone: payload.phone === "" ? null : payload.phone,
        gender: payload.gender === "" ? null : payload.gender,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
      },
    });

    return updated;
  }
}

export const userProfileService = new UserProfileService();
