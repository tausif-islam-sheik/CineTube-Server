import { Role } from "../../generated/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedDemoUser = async () => {
  try {
    const demoEmail = "demo@cinetube.com";
    
    const isDemoExist = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (isDemoExist) {
      console.log("[Demo Seed] Demo user already exists. Skipping seeding.");
      return;
    }

    console.log("[Demo Seed] Creating demo user...");

    const demoUser = await auth.api.signUpEmail({
      body: {
        email: demoEmail,
        password: "demo1234567",
        name: "Demo User",
        role: Role.USER,
      },
    });

    if (!demoUser.user) {
      throw new Error("Failed to create demo user");
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: demoUser.user.id },
      data: { emailVerified: true },
    });

    console.log("[Demo Seed] Demo user created successfully:", {
      id: demoUser.user.id,
      email: demoUser.user.email,
      role: Role.USER,
    });
  } catch (error) {
    console.error("[Demo Seed] Error seeding demo user:", error);
    throw error;
  }
};
