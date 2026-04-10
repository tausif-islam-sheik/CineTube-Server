import { Request, Response } from "express";

export class CookieUtils {
  /**
   * Get cookie value from request
   */
  static getCookie(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }

  /**
   * Set cookie in response
   */
  static setCookie(
    res: Response,
    name: string,
    value: string,
    options?: {
      maxAge?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
      path?: string;
      domain?: string;
    }
  ): void {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      ...options,
    });
  }

  /**
   * Clear cookie from response
   */
  static clearCookie(res: Response, name: string): void {
    res.clearCookie(name, { path: "/" });
  }

  /**
   * Set multiple cookies
   */
  static setMultipleCookies(
    res: Response,
    cookies: Array<{
      name: string;
      value: string;
      options?: {
        maxAge?: number;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "strict" | "lax" | "none";
        path?: string;
        domain?: string;
      };
    }>
  ): void {
    cookies.forEach((cookie) => {
      this.setCookie(res, cookie.name, cookie.value, cookie.options);
    });
  }
}
