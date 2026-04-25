/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import crypto from "crypto";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";
import AppError from "../../errorHelpers/AppError";
import { emailService } from "../../lib/email";
import { env } from "../../config/env";
import { jwtUtils } from "../../utils/jwt";
import { UserStatus } from "../../../generated/enums";

const register = async (payload: IRegisterUserPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register user");
  }

  try {
    // Send verification email
    const verificationLink = `${env.FRONTEND_URL}/verify-email`;
    await emailService.sendVerificationEmail({
      email: data.user.email,
      name: data.user.name || "User",
      verificationLink,
    });

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      },
      message: "Registration successful. Please check your email to verify your account.",
    };
  } catch (err) {
    console.log("Transaction error", err);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw err;
  }
};

const logIn = async (payload: ILoginUserPayload, expressRes: Response) => {
  const { email, password } = payload;

  // Get full Response object so we can extract Set-Cookie
  const authResponse = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true, 
  });

  if (!authResponse.ok) {
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
  }

  // Forward Better Auth cookies to the browser
  const setCookie = authResponse.headers.get("set-cookie");
  if (setCookie) {
    expressRes.setHeader("Set-Cookie", setCookie);
  }

  const authData = await authResponse.json();
  const user = await prisma.user.findUnique({
    where: { id: authData.user.id },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if ((user as any).status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if ((user as any).isDeleted) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  const { accessToken, refreshToken } = jwtUtils.generateTokenPair(
    {
      userId: user.id,
      email: user.email,
      role: (user as any).role,
    },
    env.ACCESS_TOKEN_SECRET,
    env.REFRESH_TOKEN_SECRET
  );

  const latestSession = await prisma.session.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: (user as any).role,
      status: (user as any).status,
      emailVerified: user.emailVerified,
    },
    sessionToken: latestSession?.token || null,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (payload: { refreshToken: string }) => {
  const { refreshToken: token } = payload;

  if (!token) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Refresh token is required"
    );
  }

  // Verify refresh token
  const verifiedToken = jwtUtils.verifyToken(
    token,
    env.REFRESH_TOKEN_SECRET
  );

  if (!verifiedToken.success || !verifiedToken.data) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.data.userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  // Generate new access token
  const newAccessToken = jwtUtils.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: (user as any).role,
    },
    env.ACCESS_TOKEN_SECRET,
    "15m"
  );

  return {
    accessToken: newAccessToken,
  };
};

const logout = async () => {
  // Better Auth handles session invalidation internally
  // This is just a placeholder for any cleanup if needed
  return {
    message: "Logged out successfully",
  };
};

const forgotPassword = async (email: string) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: "If an account exists, a password reset email has been sent" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database (using Verification model)
    // First, delete any existing token for this email
    await prisma.verification.deleteMany({
      where: { identifier: `password-reset-${email}` },
    });

    // Create new token
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: `password-reset-${email}`,
        value: hashedToken,
        expiresAt: tokenExpiry,
      },
    });

    // Create reset URL
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email using our service
    const emailSent = await emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name || "User",
      resetLink: resetUrl,
    });

    if (!emailSent) {
      console.error(`[forgotPassword] Failed to send email to: ${email}`);
      throw new Error("Failed to send email");
    }

    return { message: "If an account exists, a password reset email has been sent" };
  } catch (error) {
    console.error(`[forgotPassword] Error:`, error);
    return { message: "If an account exists, a password reset email has been sent" };
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Hash the provided token to match stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find verification record with matching hashed token
    const verifications = await prisma.verification.findMany({
      where: {
        identifier: { startsWith: "password-reset-" },
        value: hashedToken,
      },
    });

    const verification = verifications[0];

    if (!verification) {
      throw new AppError(status.BAD_REQUEST, "Invalid or expired reset token");
    }

    // Check if token expired
    if (verification.expiresAt < new Date()) {
      await prisma.verification.delete({ where: { id: verification.id } });
      throw new AppError(status.BAD_REQUEST, "Reset token has expired. Please request a new one.");
    }

    // Extract email from identifier (format: password-reset-{email})
    const email = verification.identifier.replace("password-reset-", "");

    // Get user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Update password using Better Auth's credential provider
    // Better Auth uses bcrypt with $2a$ prefix and salt rounds 10
    const bcrypt = await import("bcryptjs");
    // Use genSaltSync with 10 rounds
    const salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(newPassword, salt);
    
    // Convert $2b$ to $2a$ for Better Auth compatibility
    // $2b$ is generated by bcrypt on newer Node.js versions
    // but Better Auth's validator only accepts $2a$
    if (hashedPassword.startsWith("$2b$")) {
      hashedPassword = hashedPassword.replace("$2b$", "$2a$");
    }
    
    // Find the credential account for this user
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
    });

    if (account) {
      // Update existing account with new hashed password
      await prisma.account.update({
        where: { id: account.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new credential account if doesn't exist
      const newAccountId = crypto.randomUUID();
      await prisma.account.create({
        data: {
          id: newAccountId,
          accountId: email,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Also update the updatedAt on the user
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    // Delete the used token
    await prisma.verification.delete({ where: { id: verification.id } });

    return { message: "Password reset successfully. Please login with your new password." };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("[resetPassword] Error:", error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to reset password");
  }
};

const verifyEmail = async (email: string) => {
  // Update user's emailVerified status
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return {
    message: "Email verified successfully",
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  };
};

export const AuthService = {
  register,
  logIn,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};