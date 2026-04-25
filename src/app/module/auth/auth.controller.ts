import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import status from "http-status";
import { AuthenticatedRequest } from "../../middleware/checkAuth";
import { CookieUtils } from "../../utils/cookie";
import { forgotPasswordSchema, resetPasswordSchema } from "./auth.validation";

const register = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.register(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const logIn = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.logIn(payload, res);

  // Set access token cookie (short-lived - 15 minutes)
  CookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  // Set refresh token cookie (long-lived - 7 days)
  CookieUtils.setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = CookieUtils.getCookie(req, "refreshToken") || req.body.refreshToken;

  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const result = await AuthService.refreshToken({ refreshToken });

  // Set new access token cookie (short-lived - 15 minutes)
  CookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const logout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await AuthService.logout();

  // Clear session cookie
  res.clearCookie("session");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const validatedData = forgotPasswordSchema.parse({ body: req.body });
  const result = await AuthService.forgotPassword(validatedData.body.email);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const validatedData = resetPasswordSchema.parse({ body: req.body });
  const result = await AuthService.resetPassword(
    validatedData.body.token,
    validatedData.body.newPassword
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.verifyEmail(email);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: result.user,
  });
});

export const AuthController = {
  register,
  logIn,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};