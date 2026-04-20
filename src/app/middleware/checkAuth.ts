/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { auth } from "../lib/auth";
import { Role, UserStatus } from "../../generated/enums";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
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
      let authenticatedUser: any = null;

      // 1. Try Better Auth Session API (Most robust method)
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (session && session.user) {
        const user = session.user;

        // Status checks
        if (
          user.status === (UserStatus.BLOCKED as any) ||
          user.status === (UserStatus.DELETED as any) ||
          (user as any).isDeleted
        ) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! User is not active.",
          );
        }

        authenticatedUser = {
          id: user.id,
          role: (user as any).role as Role,
          email: user.email,
        };
      }

      // 2. Fallback to Access Token (JWT) if no session found
      if (!authenticatedUser) {
        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (accessToken) {
          const verifiedToken = jwtUtils.verifyToken(
            accessToken,
            env.ACCESS_TOKEN_SECRET,
          );
          if (verifiedToken.success && verifiedToken.data) {
            authenticatedUser = {
              id: verifiedToken.data.userId,
              role: (verifiedToken.data as any).role as Role,
              email: (verifiedToken.data as any).email,
            };
          }
        }
      }

      // Final authentication check
      if (!authenticatedUser) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Please provide a valid session or access token.",
        );
      }

      // Role secondary check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(authenticatedUser.role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = authenticatedUser;

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
