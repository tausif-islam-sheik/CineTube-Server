import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";

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
//     const accessToken = tokenUtils.getAccessToken({
//       userId: data.user.id,
//       role: data.user.role,
//       name: data.user.name,
//       email: data.user.email,
//       status: data.user.status,
//       isDeleted: data.user.isDeleted,
//       emailVerified: data.user.emailVerified,
//     });

//     const refreshToken = tokenUtils.getRefreshToken({
//       userId: data.user.id,
//       role: data.user.role,
//       name: data.user.name,
//       email: data.user.email,
//       status: data.user.status,
//       isDeleted: data.user.isDeleted,
//       emailVerified: data.user.emailVerified,
//     });

    // return {
    //   ...data,
    //   accessToken,
    //   refreshToken,
    // };
    return {
      data
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

const logIn = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

//   const accessToken = tokenUtils.getAccessToken({
//     userId: data.user.id,
//     role: data.user.role,
//     name: data.user.name,
//     email: data.user.email,
//     status: data.user.status,
//     isDeleted: data.user.isDeleted,
//     emailVerified: data.user.emailVerified,
//   });

//   const refreshToken = tokenUtils.getRefreshToken({
//     userId: data.user.id,
//     role: data.user.role,
//     name: data.user.name,
//     email: data.user.email,
//     status: data.user.status,
//     isDeleted: data.user.isDeleted,
//     emailVerified: data.user.emailVerified,
//   });

  return {
    data
    // ...data,
    // accessToken,
    // refreshToken,
  };
};

export const AuthService = {
  register,
  logIn
};