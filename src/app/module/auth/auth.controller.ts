import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import status from "http-status";
import { AuthenticatedRequest } from "../../middleware/checkAuth";

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
  const result = await AuthService.logIn(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const logout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await AuthService.logout(req.user?.id || "");

  // Clear session cookie
  res.clearCookie("session");

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, resetToken, newPassword } = req.body;
  const result = await AuthService.resetPassword(email, resetToken, newPassword);

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
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
