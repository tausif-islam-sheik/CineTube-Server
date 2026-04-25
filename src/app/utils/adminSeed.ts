import { Role } from "../../generated/enums";
import { env } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    if (isAdminExist) {
      console.log("[Admin Seed] Admin already exists. Skipping seeding.");
      return;
    }

    console.log("[Admin Seed] Creating admin user...");

    const adminUser = await auth.api.signUpEmail({
      body: {
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        name: "Admin",
        role: Role.ADMIN,
      },
    });

    if (!adminUser.user) {
      throw new Error("Failed to create admin user");
    }

    // Mark email as verified and ensure role is ADMIN
    await prisma.user.update({
      where: {
        id: adminUser.user.id,
      },
      data: {
        emailVerified: true,
        role: Role.ADMIN,
      },
    });

    console.log("[Admin Seed] Admin user created successfully:", {
      id: adminUser.user.id,
      email: adminUser.user.email,
      role: Role.ADMIN,
    });
  } catch (error) {
    console.error("[Admin Seed] Error seeding admin:", error);
    
    // Cleanup if user was partially created
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: env.ADMIN_EMAIL },
      });
      
      if (existingUser) {
        await prisma.user.delete({
          where: { email: env.ADMIN_EMAIL },
        });
        console.log("[Admin Seed] Cleaned up partially created admin user");
      }
    } catch (cleanupError) {
      console.error("[Admin Seed] Failed to cleanup:", cleanupError);
    }
    
    throw error;
  }
};
