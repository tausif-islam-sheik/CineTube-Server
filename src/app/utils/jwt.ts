/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtResult {
  success: boolean;
  data?: JwtPayload;
  error?: string;
}

export class jwtUtils {
  /**
   * Generate JWT token
   */
  static generateToken(
    payload: Omit<JwtPayload, "iat" | "exp">,
    secret: string,
    expiresIn: string | number = "15m"
  ): string {
    return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string, secret: string): JwtResult {
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return {
        success: true,
        data: decoded,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Token verification failed",
      };
    }
  }

  /**
   * Decode token without verification
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Generate access and refresh tokens
   */
  static generateTokenPair(
    payload: Omit<JwtPayload, "iat" | "exp">,
    accessTokenSecret: string,
    refreshTokenSecret: string
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateToken(payload, accessTokenSecret, "15m"),
      refreshToken: this.generateToken(payload, refreshTokenSecret, "7d"),
    };
  }
}
