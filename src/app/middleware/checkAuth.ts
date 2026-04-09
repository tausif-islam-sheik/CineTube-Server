import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { auth } from "../lib/auth";
import AppError from "../errorHelpers/AppError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
  };
}

/**
 * Middleware to check and validate Better Auth session
 * Attaches user info to req.user if authenticated
 * Can be used as optional (continues without error) or required (throws 401)
 */
export const checkAuth = (required: boolean = true) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Extract session token from cookies or headers
      const sessionToken = req.cookies.session || req.headers.authorization?.replace("Bearer ", "");

      if (!sessionToken) {
        if (required) {
          throw new AppError(status.UNAUTHORIZED, "No session token provided");
        }
        // Optional auth: continue without user
        return next();
      }

      // Verify session using Better Auth API
      const session = await auth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      if (!session || !session.user) {
        if (required) {
          throw new AppError(status.UNAUTHORIZED, "Invalid or expired session");
        }
        // Optional auth: continue without user
        return next();
      }

      // Attach user info to request
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role || "USER",
        status: (session.user as any).status || "ACTIVE",
        isDeleted: (session.user as any).isDeleted || false,
        emailVerified: session.user.emailVerified || false,
      };

      next();
    } catch (error) {
      if (required) {
        if (error instanceof AppError) {
          return next(error);
        }
        return next(new AppError(status.UNAUTHORIZED, "Authentication failed"));
      }
      // Optional auth: continue even on error
      next();
    }
  };
};

/**
 * Middleware to require authentication
 * Throws 401 if user is not authenticated
 */
export const requireAuth = checkAuth(true);

/**
 * Middleware to optionally authenticate
 * Does not throw error if authentication fails
 */
export const optionalAuth = checkAuth(false);

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = (req: AuthenticatedRequest): boolean => {
  return !!(req.user && req.user.id);
};

/**
 * Helper function to get authenticated user or throw error
 */
export const getAuthenticatedUser = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Authentication required");
  }
  return req.user;
};

/**
 * Middleware to check user role
 * Requires authentication and specific role
 */
export const checkRole = (requiredRole: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // First check if user is authenticated
      const sessionToken = req.cookies.session || req.headers.authorization?.replace("Bearer ", "");

      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "No session token provided");
      }

      const session = await auth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      if (!session || !session.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid or expired session");
      }

      // Attach user info to request
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role || "USER",
        status: (session.user as any).status || "ACTIVE",
        isDeleted: (session.user as any).isDeleted || false,
        emailVerified: session.user.emailVerified || false,
      };

      // Check if user has required role
      if (req.user.role !== requiredRole) {
        throw new AppError(status.FORBIDDEN, `This action requires ${requiredRole} role`);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError(status.UNAUTHORIZED, "Role authorization failed"));
    }
  };
};
