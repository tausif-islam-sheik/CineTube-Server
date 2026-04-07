import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import status from "http-status";

const register = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.register(payload);
  // const { accessToken, refreshToken, token, ...rest } = result;

  // tokenUtils.setAccessTokenCookie(res, accessToken);
  // tokenUtils.setRefreshTokenCookie(res, refreshToken);
  // tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
    // data: {
    //   token,
    //   accessToken,
    //   refreshToken,
    //   ...rest,
    // },
  });
});

const logIn = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.logIn(payload);

  // const { accessToken, refreshToken, token, ...rest } = result;

  // tokenUtils.setAccessTokenCookie(res, accessToken);
  // tokenUtils.setRefreshTokenCookie(res, refreshToken);
  // tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged In successfully",
    data: {
      result
      // token,
      // accessToken,
      // refreshToken,
      // ...rest,
    },
  });
});


export const AuthController = {
  register,
  logIn
};
