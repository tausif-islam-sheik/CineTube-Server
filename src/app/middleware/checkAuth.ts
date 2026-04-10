/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

/**
 * Core authentication middleware factory
 * Returns a middleware that validates session token and JWT token
 */
const createAuthMiddleware = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Session Token Verification
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No session token provided.",
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt!);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session Expiring Soon!!");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is deleted.",
            );
          }

          if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(user.role)
          ) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }
          (req as AuthenticatedRequest).user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }

        const accessToken = CookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! No access token provided.",
          );
        }
      }

      // Access Token Verification
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        env.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * Middleware to require authentication (any role)
 */
export const requireAuth = createAuthMiddleware();

/**
 * Middleware factory to require specific roles
 */
export const requireRole = (...roles: Role[]) => {
  return createAuthMiddleware(...roles);
};

/**
 * Helper to check if user is authenticated
 */
export const isAuthenticated = (req: Request): boolean => {
  return !!(req as AuthenticatedRequest).user;
};

/**
 * Helper to get authenticated user
 */
export const getAuthenticatedUser = (req: Request) => {
  return (req as AuthenticatedRequest).user;
};

/**
 * Helper factory to require specific roles
 * Alias for requireRole
 */
export const checkRole = (...roles: Role[]) => {
  return requireRole(...roles);
};
