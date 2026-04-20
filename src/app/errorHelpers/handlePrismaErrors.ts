import { Prisma } from "../../generated/client";


export const handlePrismaClientKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError,
) => {
  // Handle known Prisma errors like unique constraint violations
  return {
    statusCode: 400,
    message: "A database error occurred",
    ...(err.code === "P2002" && {
      message: "This record already exists",
    }),
  };
};

export const handlePrismaClientUnknownRequestError = (
  err: Prisma.PrismaClientUnknownRequestError,
) => {
  return {
    statusCode: 500,
    message: "An unknown database error occurred",
  };
};

export const handlePrismaClientValidationError = (
  err: Prisma.PrismaClientValidationError,
) => {
  return {
    statusCode: 400,
    message: "Database validation error",
  };
};

export const handlerPrismaClientInitializationError = (
  err: Prisma.PrismaClientInitializationError,
) => {
  return {
    statusCode: 500,
    message: "Database initialization error",
  };
};

export const handlerPrismaClientRustPanicError = (
  err: Prisma.PrismaClientRustPanicError,
) => {
  return {
    statusCode: 500,
    message: "A database panic occurred",
  };
};
