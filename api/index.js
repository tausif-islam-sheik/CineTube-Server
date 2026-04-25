var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/app/routes/index.ts
import { Router as Router13 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/auth/auth.service.ts
import status2 from "http-status";
import crypto from "crypto";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/app/config/env.ts
import dotenv from "dotenv";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "FRONTEND_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "SMTP_ENV",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SMTP_ENV: process.env.SMTP_ENV || "development",
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_SECURE: process.env.SMTP_SECURE || "false",
    ETHEREAL_USER: process.env.ETHEREAL_USER || "",
    ETHEREAL_PASS: process.env.ETHEREAL_PASS || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
};
var env = loadEnvVariables();

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  phone         String?\n  gender        String?\n  dateOfBirth   DateTime?\n  role          Role       @default(USER)\n  status        UserStatus @default(ACTIVE)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  deletedAt     DateTime?  @map("deleted_at")\n  isDeleted     Boolean    @default(false) @map("is_deleted")\n\n  reviews       Review[]\n  watchlists    Watchlist[]\n  payments      Payment[]\n  likes         Like[]\n  comments      Comment[]\n  subscription  Subscription?\n  contentAccess ContentAccess[]\n\n  sessions Session[]\n  accounts Account[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Comment {\n  id      String @id @default(uuid())\n  content String\n\n  userId   String  @map("user_id")\n  reviewId String  @map("review_id")\n  parentId String? @map("parent_id")\n\n  createdAt DateTime @default(now()) @map("created_at")\n\n  user   User   @relation(fields: [userId], references: [id])\n  review Review @relation(fields: [reviewId], references: [id])\n\n  @@index([reviewId])\n  @@index([parentId])\n  @@map("comments")\n}\n\nmodel ContentAccess {\n  id String @id @default(uuid())\n\n  userId     String     @map("user_id")\n  movieId    String     @map("movie_id")\n  accessType AccessType // RENTAL or STREAMING (via subscription)\n\n  grantedAt DateTime  @default(now()) @map("granted_at")\n  expiresAt DateTime? @map("expires_at") // null for streaming (subscription), date for rental\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  movie Movie @relation(fields: [movieId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, movieId, accessType])\n  @@index([userId])\n  @@index([movieId])\n  @@index([expiresAt])\n  @@map("content_access")\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n\nenum PricingType {\n  FREE\n  PREMIUM\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum UserStatus {\n  ACTIVE\n  DELETED\n  BLOCKED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  STRIPE\n  SSLCOMMERZ\n  WALLET\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n  PAUSED\n}\n\nenum SubscriptionTierName {\n  FREE\n  STANDARD\n  PREMIUM\n  VIP\n}\n\nenum AccessType {\n  RENTAL\n  STREAMING\n}\n\nmodel Like {\n  id String @id @default(uuid())\n\n  userId   String @map("user_id")\n  reviewId String @map("review_id")\n\n  user   User   @relation(fields: [userId], references: [id])\n  review Review @relation(fields: [reviewId], references: [id])\n\n  @@unique([userId, reviewId])\n  @@index([reviewId])\n  @@map("likes")\n}\n\nmodel Movie {\n  id          String   @id @default(uuid())\n  title       String\n  slug        String?  @unique // Optional slug, will be generated from title\n  description String\n  genre       String[]\n  releaseYear Int      @map("release_year")\n  director    String\n  cast        String[]\n  platform    String\n  language    String[] @default(["English"])\n\n  pricing     PricingType @default(FREE)\n  price       Float?\n  youtubeLink String?     @map("youtube_link")\n  posterUrl   String?     @map("poster_url")\n  trailerUrl  String?     @map("trailer_url")\n  duration    Int? // in minutes\n\n  averageRating Float? @default(0) @map("average_rating")\n\n  createdAt DateTime  @default(now()) @map("created_at")\n  updatedAt DateTime  @updatedAt @map("updated_at")\n  deletedAt DateTime? @map("deleted_at")\n  isDeleted Boolean   @default(false) @map("is_deleted")\n\n  reviews       Review[]\n  watchlists    Watchlist[]\n  contentAccess ContentAccess[]\n\n  @@index([title])\n  @@index([releaseYear])\n  @@index([pricing])\n  @@map("movies")\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  userId         String         @map("user_id")\n  subscriptionId String?        @map("subscription_id")\n  amount         Float\n  currency       String         @default("USD")\n  status         PaymentStatus  @default(PENDING)\n  paymentMethod  PaymentMethod?\n  gateway        String? // stripe or sslcommerz\n  transactionId  String?        @map("transaction_id") // Provider\'s transaction ID\n  failureReason  String?        @map("failure_reason")\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  subscription Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([subscriptionId])\n  @@index([transactionId])\n  @@index([status])\n  @@map("payments")\n}\n\nmodel Review {\n  id      String       @id @default(uuid())\n  rating  Int\n  title   String\n  content String\n  tags    String[]\n  spoiler Boolean      @default(false)\n  status  ReviewStatus @default(PENDING)\n\n  userId  String @map("user_id")\n  movieId String @map("movie_id")\n\n  createdAt DateTime @default(now()) @map("created_at")\n\n  user  User  @relation(fields: [userId], references: [id])\n  movie Movie @relation(fields: [movieId], references: [id])\n\n  likes    Like[]\n  comments Comment[]\n\n  @@index([userId])\n  @@index([movieId])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  // output   = "../generated/prisma"\n  output   = "../../src/generated"\n  // moduleFormat = "cjs"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel SubscriptionTier {\n  id String @id @default(uuid())\n\n  name         SubscriptionTierName @unique\n  displayName  String // e.g., "Premium Plus"\n  description  String?\n  price        Float // Monthly price in USD\n  billingCycle Int                  @default(1) // months\n  currency     String               @default("USD")\n  features     Json // JSON object of feature flags: {hd: true, 4k: false, downloads: 5}\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  subscriptions Subscription[]\n\n  @@index([name])\n  @@map("subscription_tiers")\n}\n\nmodel Subscription {\n  id String @id @default(uuid())\n\n  userId String @unique @map("user_id")\n  tierId String @map("tier_id")\n\n  startDate DateTime           @default(now()) @map("start_date")\n  endDate   DateTime?          @map("end_date")\n  status    SubscriptionStatus @default(ACTIVE)\n  autoRenew Boolean            @default(true) @map("auto_renew")\n\n  createdAt   DateTime  @default(now()) @map("created_at")\n  updatedAt   DateTime  @updatedAt @map("updated_at")\n  cancelledAt DateTime? @map("cancelled_at")\n\n  user     User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tier     SubscriptionTier @relation(fields: [tierId], references: [id], onDelete: Restrict)\n  payments Payment[]\n\n  @@index([userId])\n  @@index([tierId])\n  @@index([status])\n  @@map("subscriptions")\n}\n\nmodel Watchlist {\n  id String @id @default(uuid())\n\n  userId  String @map("user_id")\n  movieId String @map("movie_id")\n\n  createdAt DateTime @default(now()) @map("created_at")\n\n  user  User  @relation(fields: [userId], references: [id])\n  movie Movie @relation(fields: [movieId], references: [id])\n\n  @@unique([userId, movieId])\n  @@map("watchlists")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"isDeleted","kind":"scalar","type":"Boolean","dbName":"is_deleted"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"watchlists","kind":"object","type":"Watchlist","relationName":"UserToWatchlist"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToUser"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"contentAccess","kind":"object","type":"ContentAccess","relationName":"ContentAccessToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"reviewId","kind":"scalar","type":"String","dbName":"review_id"},{"name":"parentId","kind":"scalar","type":"String","dbName":"parent_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"user","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"review","kind":"object","type":"Review","relationName":"CommentToReview"}],"dbName":"comments"},"ContentAccess":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"movieId","kind":"scalar","type":"String","dbName":"movie_id"},{"name":"accessType","kind":"enum","type":"AccessType"},{"name":"grantedAt","kind":"scalar","type":"DateTime","dbName":"granted_at"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"ContentAccessToUser"},{"name":"movie","kind":"object","type":"Movie","relationName":"ContentAccessToMovie"}],"dbName":"content_access"},"Like":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"reviewId","kind":"scalar","type":"String","dbName":"review_id"},{"name":"user","kind":"object","type":"User","relationName":"LikeToUser"},{"name":"review","kind":"object","type":"Review","relationName":"LikeToReview"}],"dbName":"likes"},"Movie":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"genre","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int","dbName":"release_year"},{"name":"director","kind":"scalar","type":"String"},{"name":"cast","kind":"scalar","type":"String"},{"name":"platform","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"pricing","kind":"enum","type":"PricingType"},{"name":"price","kind":"scalar","type":"Float"},{"name":"youtubeLink","kind":"scalar","type":"String","dbName":"youtube_link"},{"name":"posterUrl","kind":"scalar","type":"String","dbName":"poster_url"},{"name":"trailerUrl","kind":"scalar","type":"String","dbName":"trailer_url"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"averageRating","kind":"scalar","type":"Float","dbName":"average_rating"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"isDeleted","kind":"scalar","type":"Boolean","dbName":"is_deleted"},{"name":"reviews","kind":"object","type":"Review","relationName":"MovieToReview"},{"name":"watchlists","kind":"object","type":"Watchlist","relationName":"MovieToWatchlist"},{"name":"contentAccess","kind":"object","type":"ContentAccess","relationName":"ContentAccessToMovie"}],"dbName":"movies"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"gateway","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"failureReason","kind":"scalar","type":"String","dbName":"failure_reason"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"spoiler","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"movieId","kind":"scalar","type":"String","dbName":"movie_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"movie","kind":"object","type":"Movie","relationName":"MovieToReview"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToReview"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToReview"}],"dbName":"reviews"},"SubscriptionTier":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"enum","type":"SubscriptionTierName"},{"name":"displayName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"billingCycle","kind":"scalar","type":"Int"},{"name":"currency","kind":"scalar","type":"String"},{"name":"features","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToSubscriptionTier"}],"dbName":"subscription_tiers"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"tierId","kind":"scalar","type":"String","dbName":"tier_id"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"autoRenew","kind":"scalar","type":"Boolean","dbName":"auto_renew"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"cancelledAt","kind":"scalar","type":"DateTime","dbName":"cancelled_at"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"tier","kind":"object","type":"SubscriptionTier","relationName":"SubscriptionToSubscriptionTier"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions"},"Watchlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"movieId","kind":"scalar","type":"String","dbName":"movie_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchlist"},{"name":"movie","kind":"object","type":"Movie","relationName":"MovieToWatchlist"}],"dbName":"watchlists"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","reviews","movie","watchlists","contentAccess","_count","review","likes","comments","subscriptions","tier","payments","subscription","sessions","accounts","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","ContentAccess.findUnique","ContentAccess.findUniqueOrThrow","ContentAccess.findFirst","ContentAccess.findFirstOrThrow","ContentAccess.findMany","ContentAccess.createOne","ContentAccess.createMany","ContentAccess.createManyAndReturn","ContentAccess.updateOne","ContentAccess.updateMany","ContentAccess.updateManyAndReturn","ContentAccess.upsertOne","ContentAccess.deleteOne","ContentAccess.deleteMany","ContentAccess.groupBy","ContentAccess.aggregate","Like.findUnique","Like.findUniqueOrThrow","Like.findFirst","Like.findFirstOrThrow","Like.findMany","Like.createOne","Like.createMany","Like.createManyAndReturn","Like.updateOne","Like.updateMany","Like.updateManyAndReturn","Like.upsertOne","Like.deleteOne","Like.deleteMany","Like.groupBy","Like.aggregate","Movie.findUnique","Movie.findUniqueOrThrow","Movie.findFirst","Movie.findFirstOrThrow","Movie.findMany","Movie.createOne","Movie.createMany","Movie.createManyAndReturn","Movie.updateOne","Movie.updateMany","Movie.updateManyAndReturn","Movie.upsertOne","Movie.deleteOne","Movie.deleteMany","_avg","_sum","Movie.groupBy","Movie.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","SubscriptionTier.findUnique","SubscriptionTier.findUniqueOrThrow","SubscriptionTier.findFirst","SubscriptionTier.findFirstOrThrow","SubscriptionTier.findMany","SubscriptionTier.createOne","SubscriptionTier.createMany","SubscriptionTier.createManyAndReturn","SubscriptionTier.updateOne","SubscriptionTier.updateMany","SubscriptionTier.updateManyAndReturn","SubscriptionTier.upsertOne","SubscriptionTier.deleteOne","SubscriptionTier.deleteMany","SubscriptionTier.groupBy","SubscriptionTier.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Watchlist.findUnique","Watchlist.findUniqueOrThrow","Watchlist.findFirst","Watchlist.findFirstOrThrow","Watchlist.findMany","Watchlist.createOne","Watchlist.createMany","Watchlist.createManyAndReturn","Watchlist.updateOne","Watchlist.updateMany","Watchlist.updateManyAndReturn","Watchlist.upsertOne","Watchlist.deleteOne","Watchlist.deleteMany","Watchlist.groupBy","Watchlist.aggregate","AND","OR","NOT","id","userId","movieId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","tierId","startDate","endDate","SubscriptionStatus","status","autoRenew","updatedAt","cancelledAt","SubscriptionTierName","name","displayName","description","price","billingCycle","currency","features","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","every","some","none","rating","title","content","tags","spoiler","ReviewStatus","has","hasEvery","hasSome","subscriptionId","amount","PaymentStatus","PaymentMethod","paymentMethod","gateway","transactionId","failureReason","slug","genre","releaseYear","director","cast","platform","language","PricingType","pricing","youtubeLink","posterUrl","trailerUrl","duration","averageRating","deletedAt","isDeleted","reviewId","AccessType","accessType","grantedAt","expiresAt","parentId","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","phone","gender","dateOfBirth","Role","role","UserStatus","userId_reviewId","userId_movieId_accessType","userId_movieId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "_AZ20AEaBAAArQMAIAYAAK4DACAHAACvAwAgCgAAxQMAIAsAAMYDACAOAADEAwAgDwAAxwMAIBAAAMgDACARAADJAwAg6gEAAMEDADDrAQAAPwAQ7AEAAMEDADDtAQEAAAAB8AFAAJADACGAAgAAwwPTAiKCAkAAkAMAIYUCAQCKAwAhtAJAAKsDACG1AiAArAMAIcoCAQAAAAHLAiAArAMAIcwCAQCMAwAhzQIBAIwDACHOAgEAjAMAIc8CQACrAwAh0QIAAMID0QIiAQAAAAEAIBEDAADLAwAgBQAA2gMAIAoAAMUDACALAADGAwAg6gEAAN0DADDrAQAAAwAQ7AEAAN0DADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYACAADeA5sCIpUCAgCOAwAhlgIBAIoDACGXAgEAigMAIZgCAACTAwAgmQIgAKwDACEEAwAAmgYAIAUAAJ0GACAKAACVBgAgCwAAlgYAIBEDAADLAwAgBQAA2gMAIAoAAMUDACALAADGAwAg6gEAAN0DADDrAQAAAwAQ7AEAAN0DADDtAQEAAAAB7gEBAIoDACHvAQEAigMAIfABQACQAwAhgAIAAN4DmwIilQICAI4DACGWAgEAigMAIZcCAQCKAwAhmAIAAJMDACCZAiAArAMAIQMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAMsDACAFAADaAwAg6gEAANwDADDrAQAACAAQ7AEAANwDADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIQIDAACaBgAgBQAAnQYAIAoDAADLAwAgBQAA2gMAIOoBAADcAwAw6wEAAAgAEOwBAADcAwAw7QEBAAAAAe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIdUCAADbAwAgAwAAAAgAIAEAAAkAMAIAAAoAIA0DAADLAwAgBQAA2gMAIOoBAADYAwAw6wEAAAwAEOwBAADYAwAw7QEBAIoDACHuAQEAigMAIe8BAQCKAwAh8AFAAJADACGCAkAAkAMAIbgCAADZA7gCIrkCQACQAwAhugJAAKsDACEDAwAAmgYAIAUAAJ0GACC6AgAA6AMAIA4DAADLAwAgBQAA2gMAIOoBAADYAwAw6wEAAAwAEOwBAADYAwAw7QEBAAAAAe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYICQACQAwAhuAIAANkDuAIiuQJAAJADACG6AkAAqwMAIdQCAADXAwAgAwAAAAwAIAEAAA0AMAIAAA4AIAEAAAADACABAAAACAAgAQAAAAwAIAgDAADLAwAgCQAA1AMAIOoBAADWAwAw6wEAABMAEOwBAADWAwAw7QEBAIoDACHuAQEAigMAIbYCAQCKAwAhAgMAAJoGACAJAACcBgAgCQMAAMsDACAJAADUAwAg6gEAANYDADDrAQAAEwAQ7AEAANYDADDtAQEAAAAB7gEBAIoDACG2AgEAigMAIdMCAADVAwAgAwAAABMAIAEAABQAMAIAABUAIAsDAADLAwAgCQAA1AMAIOoBAADTAwAw6wEAABcAEOwBAADTAwAw7QEBAIoDACHuAQEAigMAIfABQACQAwAhlwIBAIoDACG2AgEAigMAIbsCAQCMAwAhAwMAAJoGACAJAACcBgAguwIAAOgDACALAwAAywMAIAkAANQDACDqAQAA0wMAMOsBAAAXABDsAQAA0wMAMO0BAQAAAAHuAQEAigMAIfABQACQAwAhlwIBAIoDACG2AgEAigMAIbsCAQCMAwAhAwAAABcAIAEAABgAMAIAABkAIAEAAAATACABAAAAFwAgAwAAAAgAIAEAAAkAMAIAAAoAIBEDAADLAwAgDwAAxwMAIOoBAADQAwAw6wEAAB4AEOwBAADQAwAw7QEBAIoDACHuAQEAigMAIfABQACQAwAhgAIAANEDoQIiggJAAJADACGKAgEAigMAIZ4CAQCMAwAhnwIIAI0DACGiAgAA0gOiAiOjAgEAjAMAIaQCAQCMAwAhpQIBAIwDACEHAwAAmgYAIA8AAJcGACCeAgAA6AMAIKICAADoAwAgowIAAOgDACCkAgAA6AMAIKUCAADoAwAgEQMAAMsDACAPAADHAwAg6gEAANADADDrAQAAHgAQ7AEAANADADDtAQEAAAAB7gEBAIoDACHwAUAAkAMAIYACAADRA6ECIoICQACQAwAhigIBAIoDACGeAgEAjAMAIZ8CCACNAwAhogIAANIDogIjowIBAIwDACGkAgEAjAMAIaUCAQCMAwAhAwAAAB4AIAEAAB8AMAIAACAAIBADAADLAwAgDQAAzwMAIA4AAMQDACDqAQAAzQMAMOsBAAAiABDsAQAAzQMAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIfwBAQCKAwAh_QFAAJADACH-AUAAqwMAIYACAADOA4ACIoECIACsAwAhggJAAJADACGDAkAAqwMAIQEAAAAiACAFAwAAmgYAIA0AAJsGACAOAACUBgAg_gEAAOgDACCDAgAA6AMAIBADAADLAwAgDQAAzwMAIA4AAMQDACDqAQAAzQMAMOsBAAAiABDsAQAAzQMAMO0BAQAAAAHuAQEAAAAB8AFAAJADACH8AQEAigMAIf0BQACQAwAh_gFAAKsDACGAAgAAzgOAAiKBAiAArAMAIYICQACQAwAhgwJAAKsDACEDAAAAIgAgAQAAJAAwAgAAJQAgAQAAACIAIAMAAAAeACABAAAfADACAAAgACABAAAAHgAgAwAAABMAIAEAABQAMAIAABUAIAMAAAAXACABAAAYADACAAAZACABAAAAIgAgAwAAAAwAIAEAAA0AMAIAAA4AIAwDAADLAwAg6gEAAMwDADDrAQAALgAQ7AEAAMwDADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGCAkAAkAMAIboCQACQAwAhxwIBAIoDACHIAgEAjAMAIckCAQCMAwAhAwMAAJoGACDIAgAA6AMAIMkCAADoAwAgDAMAAMsDACDqAQAAzAMAMOsBAAAuABDsAQAAzAMAMO0BAQAAAAHuAQEAigMAIfABQACQAwAhggJAAJADACG6AkAAkAMAIccCAQAAAAHIAgEAjAMAIckCAQCMAwAhAwAAAC4AIAEAAC8AMAIAADAAIBEDAADLAwAg6gEAAMoDADDrAQAAMgAQ7AEAAMoDADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGCAkAAkAMAIb4CAQCKAwAhvwIBAIoDACHAAgEAjAMAIcECAQCMAwAhwgIBAIwDACHDAkAAqwMAIcQCQACrAwAhxQIBAIwDACHGAgEAjAMAIQgDAACaBgAgwAIAAOgDACDBAgAA6AMAIMICAADoAwAgwwIAAOgDACDEAgAA6AMAIMUCAADoAwAgxgIAAOgDACARAwAAywMAIOoBAADKAwAw6wEAADIAEOwBAADKAwAw7QEBAAAAAe4BAQCKAwAh8AFAAJADACGCAkAAkAMAIb4CAQCKAwAhvwIBAIoDACHAAgEAjAMAIcECAQCMAwAhwgIBAIwDACHDAkAAqwMAIcQCQACrAwAhxQIBAIwDACHGAgEAjAMAIQMAAAAyACABAAAzADACAAA0ACABAAAAAwAgAQAAAAgAIAEAAAAeACABAAAAEwAgAQAAABcAIAEAAAAMACABAAAALgAgAQAAADIAIAEAAAABACAaBAAArQMAIAYAAK4DACAHAACvAwAgCgAAxQMAIAsAAMYDACAOAADEAwAgDwAAxwMAIBAAAMgDACARAADJAwAg6gEAAMEDADDrAQAAPwAQ7AEAAMEDADDtAQEAigMAIfABQACQAwAhgAIAAMMD0wIiggJAAJADACGFAgEAigMAIbQCQACrAwAhtQIgAKwDACHKAgEAigMAIcsCIACsAwAhzAIBAIwDACHNAgEAjAMAIc4CAQCMAwAhzwJAAKsDACHRAgAAwgPRAiIOBAAAiwUAIAYAAIwFACAHAACNBQAgCgAAlQYAIAsAAJYGACAOAACUBgAgDwAAlwYAIBAAAJgGACARAACZBgAgtAIAAOgDACDMAgAA6AMAIM0CAADoAwAgzgIAAOgDACDPAgAA6AMAIAMAAAA_ACABAABAADACAAABACADAAAAPwAgAQAAQAAwAgAAAQAgAwAAAD8AIAEAAEAAMAIAAAEAIBcEAACLBgAgBgAAjAYAIAcAAJEGACAKAACOBgAgCwAAjwYAIA4AAI0GACAPAACQBgAgEAAAkgYAIBEAAJMGACDtAQEAAAAB8AFAAAAAAYACAAAA0wICggJAAAAAAYUCAQAAAAG0AkAAAAABtQIgAAAAAcoCAQAAAAHLAiAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAdECAAAA0QICARcAAEQAIA7tAQEAAAAB8AFAAAAAAYACAAAA0wICggJAAAAAAYUCAQAAAAG0AkAAAAABtQIgAAAAAcoCAQAAAAHLAiAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAdECAAAA0QICARcAAEYAMAEXAABGADAXBAAArwUAIAYAALAFACAHAAC1BQAgCgAAsgUAIAsAALMFACAOAACxBQAgDwAAtAUAIBAAALYFACARAAC3BQAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiAgAAAAEAIBcAAEkAIA7tAQEA4gMAIfABQADjAwAhgAIAAK4F0wIiggJAAOMDACGFAgEA4gMAIbQCQADsAwAhtQIgAO4DACHKAgEA4gMAIcsCIADuAwAhzAIBAP8DACHNAgEA_wMAIc4CAQD_AwAhzwJAAOwDACHRAgAArQXRAiICAAAAPwAgFwAASwAgAgAAAD8AIBcAAEsAIAMAAAABACAeAABEACAfAABJACABAAAAAQAgAQAAAD8AIAgIAACqBQAgJAAArAUAICUAAKsFACC0AgAA6AMAIMwCAADoAwAgzQIAAOgDACDOAgAA6AMAIM8CAADoAwAgEeoBAAC6AwAw6wEAAFIAEOwBAAC6AwAw7QEBAOkCACHwAUAA6gIAIYACAAC8A9MCIoICQADqAgAhhQIBAOkCACG0AkAA8QIAIbUCIADzAgAhygIBAOkCACHLAiAA8wIAIcwCAQD9AgAhzQIBAP0CACHOAgEA_QIAIc8CQADxAgAh0QIAALsD0QIiAwAAAD8AIAEAAFEAMCMAAFIAIAMAAAA_ACABAABAADACAAABACABAAAAMAAgAQAAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAkDAACpBQAg7QEBAAAAAe4BAQAAAAHwAUAAAAABggJAAAAAAboCQAAAAAHHAgEAAAAByAIBAAAAAckCAQAAAAEBFwAAWgAgCO0BAQAAAAHuAQEAAAAB8AFAAAAAAYICQAAAAAG6AkAAAAABxwIBAAAAAcgCAQAAAAHJAgEAAAABARcAAFwAMAEXAABcADAJAwAAqAUAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIYICQADjAwAhugJAAOMDACHHAgEA4gMAIcgCAQD_AwAhyQIBAP8DACECAAAAMAAgFwAAXwAgCO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIYICQADjAwAhugJAAOMDACHHAgEA4gMAIcgCAQD_AwAhyQIBAP8DACECAAAALgAgFwAAYQAgAgAAAC4AIBcAAGEAIAMAAAAwACAeAABaACAfAABfACABAAAAMAAgAQAAAC4AIAUIAAClBQAgJAAApwUAICUAAKYFACDIAgAA6AMAIMkCAADoAwAgC-oBAAC5AwAw6wEAAGgAEOwBAAC5AwAw7QEBAOkCACHuAQEA6QIAIfABQADqAgAhggJAAOoCACG6AkAA6gIAIccCAQDpAgAhyAIBAP0CACHJAgEA_QIAIQMAAAAuACABAABnADAjAABoACADAAAALgAgAQAALwAwAgAAMAAgAQAAADQAIAEAAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACAOAwAApAUAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAYICQAAAAAG-AgEAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABxQIBAAAAAcYCAQAAAAEBFwAAcAAgDe0BAQAAAAHuAQEAAAAB8AFAAAAAAYICQAAAAAG-AgEAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABxQIBAAAAAcYCAQAAAAEBFwAAcgAwARcAAHIAMA4DAACjBQAg7QEBAOIDACHuAQEA4gMAIfABQADjAwAhggJAAOMDACG-AgEA4gMAIb8CAQDiAwAhwAIBAP8DACHBAgEA_wMAIcICAQD_AwAhwwJAAOwDACHEAkAA7AMAIcUCAQD_AwAhxgIBAP8DACECAAAANAAgFwAAdQAgDe0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIYICQADjAwAhvgIBAOIDACG_AgEA4gMAIcACAQD_AwAhwQIBAP8DACHCAgEA_wMAIcMCQADsAwAhxAJAAOwDACHFAgEA_wMAIcYCAQD_AwAhAgAAADIAIBcAAHcAIAIAAAAyACAXAAB3ACADAAAANAAgHgAAcAAgHwAAdQAgAQAAADQAIAEAAAAyACAKCAAAoAUAICQAAKIFACAlAAChBQAgwAIAAOgDACDBAgAA6AMAIMICAADoAwAgwwIAAOgDACDEAgAA6AMAIMUCAADoAwAgxgIAAOgDACAQ6gEAALgDADDrAQAAfgAQ7AEAALgDADDtAQEA6QIAIe4BAQDpAgAh8AFAAOoCACGCAkAA6gIAIb4CAQDpAgAhvwIBAOkCACHAAgEA_QIAIcECAQD9AgAhwgIBAP0CACHDAkAA8QIAIcQCQADxAgAhxQIBAP0CACHGAgEA_QIAIQMAAAAyACABAAB9ADAjAAB-ACADAAAAMgAgAQAAMwAwAgAANAAgCeoBAAC3AwAw6wEAAIQBABDsAQAAtwMAMO0BAQAAAAHwAUAAkAMAIYICQACQAwAhugJAAJADACG8AgEAigMAIb0CAQCKAwAhAQAAAIEBACABAAAAgQEAIAnqAQAAtwMAMOsBAACEAQAQ7AEAALcDADDtAQEAigMAIfABQACQAwAhggJAAJADACG6AkAAkAMAIbwCAQCKAwAhvQIBAIoDACEAAwAAAIQBACABAACFAQAwAgAAgQEAIAMAAACEAQAgAQAAhQEAMAIAAIEBACADAAAAhAEAIAEAAIUBADACAACBAQAgBu0BAQAAAAHwAUAAAAABggJAAAAAAboCQAAAAAG8AgEAAAABvQIBAAAAAQEXAACJAQAgBu0BAQAAAAHwAUAAAAABggJAAAAAAboCQAAAAAG8AgEAAAABvQIBAAAAAQEXAACLAQAwARcAAIsBADAG7QEBAOIDACHwAUAA4wMAIYICQADjAwAhugJAAOMDACG8AgEA4gMAIb0CAQDiAwAhAgAAAIEBACAXAACOAQAgBu0BAQDiAwAh8AFAAOMDACGCAkAA4wMAIboCQADjAwAhvAIBAOIDACG9AgEA4gMAIQIAAACEAQAgFwAAkAEAIAIAAACEAQAgFwAAkAEAIAMAAACBAQAgHgAAiQEAIB8AAI4BACABAAAAgQEAIAEAAACEAQAgAwgAAJ0FACAkAACfBQAgJQAAngUAIAnqAQAAtgMAMOsBAACXAQAQ7AEAALYDADDtAQEA6QIAIfABQADqAgAhggJAAOoCACG6AkAA6gIAIbwCAQDpAgAhvQIBAOkCACEDAAAAhAEAIAEAAJYBADAjAACXAQAgAwAAAIQBACABAACFAQAwAgAAgQEAIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgCAMAALUEACAJAACcBQAg7QEBAAAAAe4BAQAAAAHwAUAAAAABlwIBAAAAAbYCAQAAAAG7AgEAAAABARcAAJ8BACAG7QEBAAAAAe4BAQAAAAHwAUAAAAABlwIBAAAAAbYCAQAAAAG7AgEAAAABARcAAKEBADABFwAAoQEAMAgDAACzBAAgCQAAmwUAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIZcCAQDiAwAhtgIBAOIDACG7AgEA_wMAIQIAAAAZACAXAACkAQAgBu0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIZcCAQDiAwAhtgIBAOIDACG7AgEA_wMAIQIAAAAXACAXAACmAQAgAgAAABcAIBcAAKYBACADAAAAGQAgHgAAnwEAIB8AAKQBACABAAAAGQAgAQAAABcAIAQIAACYBQAgJAAAmgUAICUAAJkFACC7AgAA6AMAIAnqAQAAtQMAMOsBAACtAQAQ7AEAALUDADDtAQEA6QIAIe4BAQDpAgAh8AFAAOoCACGXAgEA6QIAIbYCAQDpAgAhuwIBAP0CACEDAAAAFwAgAQAArAEAMCMAAK0BACADAAAAFwAgAQAAGAAwAgAAGQAgAQAAAA4AIAEAAAAOACADAAAADAAgAQAADQAwAgAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACAKAwAA7AQAIAUAAJcFACDtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAUAAAAABggJAAAAAAbgCAAAAuAICuQJAAAAAAboCQAAAAAEBFwAAtQEAIAjtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAUAAAAABggJAAAAAAbgCAAAAuAICuQJAAAAAAboCQAAAAAEBFwAAtwEAMAEXAAC3AQAwCgMAAOoEACAFAACWBQAg7QEBAOIDACHuAQEA4gMAIe8BAQDiAwAh8AFAAOMDACGCAkAA4wMAIbgCAADoBLgCIrkCQADjAwAhugJAAOwDACECAAAADgAgFwAAugEAIAjtAQEA4gMAIe4BAQDiAwAh7wEBAOIDACHwAUAA4wMAIYICQADjAwAhuAIAAOgEuAIiuQJAAOMDACG6AkAA7AMAIQIAAAAMACAXAAC8AQAgAgAAAAwAIBcAALwBACADAAAADgAgHgAAtQEAIB8AALoBACABAAAADgAgAQAAAAwAIAQIAACTBQAgJAAAlQUAICUAAJQFACC6AgAA6AMAIAvqAQAAsQMAMOsBAADDAQAQ7AEAALEDADDtAQEA6QIAIe4BAQDpAgAh7wEBAOkCACHwAUAA6gIAIYICQADqAgAhuAIAALIDuAIiuQJAAOoCACG6AkAA8QIAIQMAAAAMACABAADCAQAwIwAAwwEAIAMAAAAMACABAAANADACAAAOACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAUDAADDBAAgCQAAkgUAIO0BAQAAAAHuAQEAAAABtgIBAAAAAQEXAADLAQAgA-0BAQAAAAHuAQEAAAABtgIBAAAAAQEXAADNAQAwARcAAM0BADAFAwAAwQQAIAkAAJEFACDtAQEA4gMAIe4BAQDiAwAhtgIBAOIDACECAAAAFQAgFwAA0AEAIAPtAQEA4gMAIe4BAQDiAwAhtgIBAOIDACECAAAAEwAgFwAA0gEAIAIAAAATACAXAADSAQAgAwAAABUAIB4AAMsBACAfAADQAQAgAQAAABUAIAEAAAATACADCAAAjgUAICQAAJAFACAlAACPBQAgBuoBAACwAwAw6wEAANkBABDsAQAAsAMAMO0BAQDpAgAh7gEBAOkCACG2AgEA6QIAIQMAAAATACABAADYAQAwIwAA2QEAIAMAAAATACABAAAUADACAAAVACAbBAAArQMAIAYAAK4DACAHAACvAwAg6gEAAKcDADDrAQAA3wEAEOwBAACnAwAw7QEBAAAAAfABQACQAwAhggJAAJADACGHAgEAigMAIYgCCACpAwAhlgIBAIoDACGmAgEAAAABpwIAAJMDACCoAgIAjgMAIakCAQCKAwAhqgIAAJMDACCrAgEAigMAIawCAACTAwAgrgIAAKgDrgIirwIBAIwDACGwAgEAjAMAIbECAQCMAwAhsgICAKoDACGzAggAqQMAIbQCQACrAwAhtQIgAKwDACEBAAAA3AEAIAEAAADcAQAgGwQAAK0DACAGAACuAwAgBwAArwMAIOoBAACnAwAw6wEAAN8BABDsAQAApwMAMO0BAQCKAwAh8AFAAJADACGCAkAAkAMAIYcCAQCKAwAhiAIIAKkDACGWAgEAigMAIaYCAQCMAwAhpwIAAJMDACCoAgIAjgMAIakCAQCKAwAhqgIAAJMDACCrAgEAigMAIawCAACTAwAgrgIAAKgDrgIirwIBAIwDACGwAgEAjAMAIbECAQCMAwAhsgICAKoDACGzAggAqQMAIbQCQACrAwAhtQIgAKwDACELBAAAiwUAIAYAAIwFACAHAACNBQAgiAIAAOgDACCmAgAA6AMAIK8CAADoAwAgsAIAAOgDACCxAgAA6AMAILICAADoAwAgswIAAOgDACC0AgAA6AMAIAMAAADfAQAgAQAA4AEAMAIAANwBACADAAAA3wEAIAEAAOABADACAADcAQAgAwAAAN8BACABAADgAQAwAgAA3AEAIBgEAACIBQAgBgAAiQUAIAcAAIoFACDtAQEAAAAB8AFAAAAAAYICQAAAAAGHAgEAAAABiAIIAAAAAZYCAQAAAAGmAgEAAAABpwIAAIUFACCoAgIAAAABqQIBAAAAAaoCAACGBQAgqwIBAAAAAawCAACHBQAgrgIAAACuAgKvAgEAAAABsAIBAAAAAbECAQAAAAGyAgIAAAABswIIAAAAAbQCQAAAAAG1AiAAAAABARcAAOQBACAV7QEBAAAAAfABQAAAAAGCAkAAAAABhwIBAAAAAYgCCAAAAAGWAgEAAAABpgIBAAAAAacCAACFBQAgqAICAAAAAakCAQAAAAGqAgAAhgUAIKsCAQAAAAGsAgAAhwUAIK4CAAAArgICrwIBAAAAAbACAQAAAAGxAgEAAAABsgICAAAAAbMCCAAAAAG0AkAAAAABtQIgAAAAAQEXAADmAQAwARcAAOYBADAYBAAA2wQAIAYAANwEACAHAADdBAAg7QEBAOIDACHwAUAA4wMAIYICQADjAwAhhwIBAOIDACGIAggA2QQAIZYCAQDiAwAhpgIBAP8DACGnAgAA1QQAIKgCAgCNBAAhqQIBAOIDACGqAgAA1gQAIKsCAQDiAwAhrAIAANcEACCuAgAA2ASuAiKvAgEA_wMAIbACAQD_AwAhsQIBAP8DACGyAgIA2gQAIbMCCADZBAAhtAJAAOwDACG1AiAA7gMAIQIAAADcAQAgFwAA6QEAIBXtAQEA4gMAIfABQADjAwAhggJAAOMDACGHAgEA4gMAIYgCCADZBAAhlgIBAOIDACGmAgEA_wMAIacCAADVBAAgqAICAI0EACGpAgEA4gMAIaoCAADWBAAgqwIBAOIDACGsAgAA1wQAIK4CAADYBK4CIq8CAQD_AwAhsAIBAP8DACGxAgEA_wMAIbICAgDaBAAhswIIANkEACG0AkAA7AMAIbUCIADuAwAhAgAAAN8BACAXAADrAQAgAgAAAN8BACAXAADrAQAgAwAAANwBACAeAADkAQAgHwAA6QEAIAEAAADcAQAgAQAAAN8BACANCAAA0AQAICQAANMEACAlAADSBAAglgEAANEEACCXAQAA1AQAIIgCAADoAwAgpgIAAOgDACCvAgAA6AMAILACAADoAwAgsQIAAOgDACCyAgAA6AMAILMCAADoAwAgtAIAAOgDACAY6gEAAJ4DADDrAQAA8gEAEOwBAACeAwAw7QEBAOkCACHwAUAA6gIAIYICQADqAgAhhwIBAOkCACGIAggAoAMAIZYCAQDpAgAhpgIBAP0CACGnAgAAkwMAIKgCAgD_AgAhqQIBAOkCACGqAgAAkwMAIKsCAQDpAgAhrAIAAJMDACCuAgAAnwOuAiKvAgEA_QIAIbACAQD9AgAhsQIBAP0CACGyAgIAoQMAIbMCCACgAwAhtAJAAPECACG1AiAA8wIAIQMAAADfAQAgAQAA8QEAMCMAAPIBACADAAAA3wEAIAEAAOABADACAADcAQAgAQAAACAAIAEAAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAeACABAAAfADACAAAgACAOAwAAgwQAIA8AAM8EACDtAQEAAAAB7gEBAAAAAfABQAAAAAGAAgAAAKECAoICQAAAAAGKAgEAAAABngIBAAAAAZ8CCAAAAAGiAgAAAKICA6MCAQAAAAGkAgEAAAABpQIBAAAAAQEXAAD6AQAgDO0BAQAAAAHuAQEAAAAB8AFAAAAAAYACAAAAoQICggJAAAAAAYoCAQAAAAGeAgEAAAABnwIIAAAAAaICAAAAogIDowIBAAAAAaQCAQAAAAGlAgEAAAABARcAAPwBADABFwAA_AEAMAEAAAAiACAOAwAAgQQAIA8AAM4EACDtAQEA4gMAIe4BAQDiAwAh8AFAAOMDACGAAgAA_QOhAiKCAkAA4wMAIYoCAQDiAwAhngIBAP8DACGfAggA_AMAIaICAAD-A6ICI6MCAQD_AwAhpAIBAP8DACGlAgEA_wMAIQIAAAAgACAXAACAAgAgDO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIYACAAD9A6ECIoICQADjAwAhigIBAOIDACGeAgEA_wMAIZ8CCAD8AwAhogIAAP4DogIjowIBAP8DACGkAgEA_wMAIaUCAQD_AwAhAgAAAB4AIBcAAIICACACAAAAHgAgFwAAggIAIAEAAAAiACADAAAAIAAgHgAA-gEAIB8AAIACACABAAAAIAAgAQAAAB4AIAoIAADJBAAgJAAAzAQAICUAAMsEACCWAQAAygQAIJcBAADNBAAgngIAAOgDACCiAgAA6AMAIKMCAADoAwAgpAIAAOgDACClAgAA6AMAIA_qAQAAlwMAMOsBAACKAgAQ7AEAAJcDADDtAQEA6QIAIe4BAQDpAgAh8AFAAOoCACGAAgAAmAOhAiKCAkAA6gIAIYoCAQDpAgAhngIBAP0CACGfAggA_gIAIaICAACZA6ICI6MCAQD9AgAhpAIBAP0CACGlAgEA_QIAIQMAAAAeACABAACJAgAwIwAAigIAIAMAAAAeACABAAAfADACAAAgACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIA4DAADFBAAgBQAAxgQAIAoAAMcEACALAADIBAAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABARcAAJICACAK7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABARcAAJQCADABFwAAlAIAMA4DAACkBAAgBQAApQQAIAoAAKYEACALAACnBAAg7QEBAOIDACHuAQEA4gMAIe8BAQDiAwAh8AFAAOMDACGAAgAAowSbAiKVAgIAjQQAIZYCAQDiAwAhlwIBAOIDACGYAgAAogQAIJkCIADuAwAhAgAAAAUAIBcAAJcCACAK7QEBAOIDACHuAQEA4gMAIe8BAQDiAwAh8AFAAOMDACGAAgAAowSbAiKVAgIAjQQAIZYCAQDiAwAhlwIBAOIDACGYAgAAogQAIJkCIADuAwAhAgAAAAMAIBcAAJkCACACAAAAAwAgFwAAmQIAIAMAAAAFACAeAACSAgAgHwAAlwIAIAEAAAAFACABAAAAAwAgBQgAAJ0EACAkAACgBAAgJQAAnwQAIJYBAACeBAAglwEAAKEEACAN6gEAAJIDADDrAQAAoAIAEOwBAACSAwAw7QEBAOkCACHuAQEA6QIAIe8BAQDpAgAh8AFAAOoCACGAAgAAlAObAiKVAgIA_wIAIZYCAQDpAgAhlwIBAOkCACGYAgAAkwMAIJkCIADzAgAhAwAAAAMAIAEAAJ8CADAjAACgAgAgAwAAAAMAIAEAAAQAMAIAAAUAIA4MAACRAwAg6gEAAIkDADDrAQAApgIAEOwBAACJAwAw7QEBAAAAAfABQACQAwAhggJAAJADACGFAgAAAIUCAoYCAQCKAwAhhwIBAIwDACGIAggAjQMAIYkCAgCOAwAhigIBAIoDACGLAgAAjwMAIAEAAACjAgAgAQAAAKMCACAODAAAkQMAIOoBAACJAwAw6wEAAKYCABDsAQAAiQMAMO0BAQCKAwAh8AFAAJADACGCAkAAkAMAIYUCAACLA4UCIoYCAQCKAwAhhwIBAIwDACGIAggAjQMAIYkCAgCOAwAhigIBAIoDACGLAgAAjwMAIAIMAACcBAAghwIAAOgDACADAAAApgIAIAEAAKcCADACAACjAgAgAwAAAKYCACABAACnAgAwAgAAowIAIAMAAACmAgAgAQAApwIAMAIAAKMCACALDAAAmwQAIO0BAQAAAAHwAUAAAAABggJAAAAAAYUCAAAAhQIChgIBAAAAAYcCAQAAAAGIAggAAAABiQICAAAAAYoCAQAAAAGLAoAAAAABARcAAKsCACAK7QEBAAAAAfABQAAAAAGCAkAAAAABhQIAAACFAgKGAgEAAAABhwIBAAAAAYgCCAAAAAGJAgIAAAABigIBAAAAAYsCgAAAAAEBFwAArQIAMAEXAACtAgAwCwwAAI4EACDtAQEA4gMAIfABQADjAwAhggJAAOMDACGFAgAAjASFAiKGAgEA4gMAIYcCAQD_AwAhiAIIAPwDACGJAgIAjQQAIYoCAQDiAwAhiwKAAAAAAQIAAACjAgAgFwAAsAIAIArtAQEA4gMAIfABQADjAwAhggJAAOMDACGFAgAAjASFAiKGAgEA4gMAIYcCAQD_AwAhiAIIAPwDACGJAgIAjQQAIYoCAQDiAwAhiwKAAAAAAQIAAACmAgAgFwAAsgIAIAIAAACmAgAgFwAAsgIAIAMAAACjAgAgHgAAqwIAIB8AALACACABAAAAowIAIAEAAACmAgAgBggAAIcEACAkAACKBAAgJQAAiQQAIJYBAACIBAAglwEAAIsEACCHAgAA6AMAIA3qAQAA-wIAMOsBAAC5AgAQ7AEAAPsCADDtAQEA6QIAIfABQADqAgAhggJAAOoCACGFAgAA_AKFAiKGAgEA6QIAIYcCAQD9AgAhiAIIAP4CACGJAgIA_wIAIYoCAQDpAgAhiwIAAIADACADAAAApgIAIAEAALgCADAjAAC5AgAgAwAAAKYCACABAACnAgAwAgAAowIAIAEAAAAlACABAAAAJQAgAwAAACIAIAEAACQAMAIAACUAIAMAAAAiACABAAAkADACAAAlACADAAAAIgAgAQAAJAAwAgAAJQAgDQMAAIQEACANAACFBAAgDgAAhgQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAfwBAQAAAAH9AUAAAAAB_gFAAAAAAYACAAAAgAICgQIgAAAAAYICQAAAAAGDAkAAAAABARcAAMECACAK7QEBAAAAAe4BAQAAAAHwAUAAAAAB_AEBAAAAAf0BQAAAAAH-AUAAAAABgAIAAACAAgKBAiAAAAABggJAAAAAAYMCQAAAAAEBFwAAwwIAMAEXAADDAgAwDQMAAO8DACANAADwAwAgDgAA8QMAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIfwBAQDiAwAh_QFAAOMDACH-AUAA7AMAIYACAADtA4ACIoECIADuAwAhggJAAOMDACGDAkAA7AMAIQIAAAAlACAXAADGAgAgCu0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIfwBAQDiAwAh_QFAAOMDACH-AUAA7AMAIYACAADtA4ACIoECIADuAwAhggJAAOMDACGDAkAA7AMAIQIAAAAiACAXAADIAgAgAgAAACIAIBcAAMgCACADAAAAJQAgHgAAwQIAIB8AAMYCACABAAAAJQAgAQAAACIAIAUIAADpAwAgJAAA6wMAICUAAOoDACD-AQAA6AMAIIMCAADoAwAgDeoBAADwAgAw6wEAAM8CABDsAQAA8AIAMO0BAQDpAgAh7gEBAOkCACHwAUAA6gIAIfwBAQDpAgAh_QFAAOoCACH-AUAA8QIAIYACAADyAoACIoECIADzAgAhggJAAOoCACGDAkAA8QIAIQMAAAAiACABAADOAgAwIwAAzwIAIAMAAAAiACABAAAkADACAAAlACABAAAACgAgAQAAAAoAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAYDAADmAwAgBQAA5wMAIO0BAQAAAAHuAQEAAAAB7wEBAAAAAfABQAAAAAEBFwAA1wIAIATtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAUAAAAABARcAANkCADABFwAA2QIAMAYDAADkAwAgBQAA5QMAIO0BAQDiAwAh7gEBAOIDACHvAQEA4gMAIfABQADjAwAhAgAAAAoAIBcAANwCACAE7QEBAOIDACHuAQEA4gMAIe8BAQDiAwAh8AFAAOMDACECAAAACAAgFwAA3gIAIAIAAAAIACAXAADeAgAgAwAAAAoAIB4AANcCACAfAADcAgAgAQAAAAoAIAEAAAAIACADCAAA3wMAICQAAOEDACAlAADgAwAgB-oBAADoAgAw6wEAAOUCABDsAQAA6AIAMO0BAQDpAgAh7gEBAOkCACHvAQEA6QIAIfABQADqAgAhAwAAAAgAIAEAAOQCADAjAADlAgAgAwAAAAgAIAEAAAkAMAIAAAoAIAfqAQAA6AIAMOsBAADlAgAQ7AEAAOgCADDtAQEA6QIAIe4BAQDpAgAh7wEBAOkCACHwAUAA6gIAIQ4IAADsAgAgJAAA7wIAICUAAO8CACDxAQEAAAAB8gEBAAAABPMBAQAAAAT0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAO4CACH5AQEAAAAB-gEBAAAAAfsBAQAAAAELCAAA7AIAICQAAO0CACAlAADtAgAg8QFAAAAAAfIBQAAAAATzAUAAAAAE9AFAAAAAAfUBQAAAAAH2AUAAAAAB9wFAAAAAAfgBQADrAgAhCwgAAOwCACAkAADtAgAgJQAA7QIAIPEBQAAAAAHyAUAAAAAE8wFAAAAABPQBQAAAAAH1AUAAAAAB9gFAAAAAAfcBQAAAAAH4AUAA6wIAIQjxAQIAAAAB8gECAAAABPMBAgAAAAT0AQIAAAAB9QECAAAAAfYBAgAAAAH3AQIAAAAB-AECAOwCACEI8QFAAAAAAfIBQAAAAATzAUAAAAAE9AFAAAAAAfUBQAAAAAH2AUAAAAAB9wFAAAAAAfgBQADtAgAhDggAAOwCACAkAADvAgAgJQAA7wIAIPEBAQAAAAHyAQEAAAAE8wEBAAAABPQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEA7gIAIfkBAQAAAAH6AQEAAAAB-wEBAAAAAQvxAQEAAAAB8gEBAAAABPMBAQAAAAT0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAO8CACH5AQEAAAAB-gEBAAAAAfsBAQAAAAEN6gEAAPACADDrAQAAzwIAEOwBAADwAgAw7QEBAOkCACHuAQEA6QIAIfABQADqAgAh_AEBAOkCACH9AUAA6gIAIf4BQADxAgAhgAIAAPICgAIigQIgAPMCACGCAkAA6gIAIYMCQADxAgAhCwgAAPkCACAkAAD6AgAgJQAA-gIAIPEBQAAAAAHyAUAAAAAF8wFAAAAABfQBQAAAAAH1AUAAAAAB9gFAAAAAAfcBQAAAAAH4AUAA-AIAIQcIAADsAgAgJAAA9wIAICUAAPcCACDxAQAAAIACAvIBAAAAgAII8wEAAACAAgj4AQAA9gKAAiIFCAAA7AIAICQAAPUCACAlAAD1AgAg8QEgAAAAAfgBIAD0AgAhBQgAAOwCACAkAAD1AgAgJQAA9QIAIPEBIAAAAAH4ASAA9AIAIQLxASAAAAAB-AEgAPUCACEHCAAA7AIAICQAAPcCACAlAAD3AgAg8QEAAACAAgLyAQAAAIACCPMBAAAAgAII-AEAAPYCgAIiBPEBAAAAgAIC8gEAAACAAgjzAQAAAIACCPgBAAD3AoACIgsIAAD5AgAgJAAA-gIAICUAAPoCACDxAUAAAAAB8gFAAAAABfMBQAAAAAX0AUAAAAAB9QFAAAAAAfYBQAAAAAH3AUAAAAAB-AFAAPgCACEI8QECAAAAAfIBAgAAAAXzAQIAAAAF9AECAAAAAfUBAgAAAAH2AQIAAAAB9wECAAAAAfgBAgD5AgAhCPEBQAAAAAHyAUAAAAAF8wFAAAAABfQBQAAAAAH1AUAAAAAB9gFAAAAAAfcBQAAAAAH4AUAA-gIAIQ3qAQAA-wIAMOsBAAC5AgAQ7AEAAPsCADDtAQEA6QIAIfABQADqAgAhggJAAOoCACGFAgAA_AKFAiKGAgEA6QIAIYcCAQD9AgAhiAIIAP4CACGJAgIA_wIAIYoCAQDpAgAhiwIAAIADACAHCAAA7AIAICQAAIgDACAlAACIAwAg8QEAAACFAgLyAQAAAIUCCPMBAAAAhQII-AEAAIcDhQIiDggAAPkCACAkAACGAwAgJQAAhgMAIPEBAQAAAAHyAQEAAAAF8wEBAAAABfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAhQMAIfkBAQAAAAH6AQEAAAAB-wEBAAAAAQ0IAADsAgAgJAAAgwMAICUAAIMDACCWAQAAgwMAIJcBAACDAwAg8QEIAAAAAfIBCAAAAATzAQgAAAAE9AEIAAAAAfUBCAAAAAH2AQgAAAAB9wEIAAAAAfgBCACEAwAhDQgAAOwCACAkAADsAgAgJQAA7AIAIJYBAACDAwAglwEAAOwCACDxAQIAAAAB8gECAAAABPMBAgAAAAT0AQIAAAAB9QECAAAAAfYBAgAAAAH3AQIAAAAB-AECAIIDACEPCAAA7AIAICQAAIEDACAlAACBAwAg8QGAAAAAAfQBgAAAAAH1AYAAAAAB9gGAAAAAAfcBgAAAAAH4AYAAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABjwKAAAAAAZACgAAAAAGRAoAAAAABDPEBgAAAAAH0AYAAAAAB9QGAAAAAAfYBgAAAAAH3AYAAAAAB-AGAAAAAAYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CgAAAAAGQAoAAAAABkQKAAAAAAQ0IAADsAgAgJAAA7AIAICUAAOwCACCWAQAAgwMAIJcBAADsAgAg8QECAAAAAfIBAgAAAATzAQIAAAAE9AECAAAAAfUBAgAAAAH2AQIAAAAB9wECAAAAAfgBAgCCAwAhCPEBCAAAAAHyAQgAAAAE8wEIAAAABPQBCAAAAAH1AQgAAAAB9gEIAAAAAfcBCAAAAAH4AQgAgwMAIQ0IAADsAgAgJAAAgwMAICUAAIMDACCWAQAAgwMAIJcBAACDAwAg8QEIAAAAAfIBCAAAAATzAQgAAAAE9AEIAAAAAfUBCAAAAAH2AQgAAAAB9wEIAAAAAfgBCACEAwAhDggAAPkCACAkAACGAwAgJQAAhgMAIPEBAQAAAAHyAQEAAAAF8wEBAAAABfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAhQMAIfkBAQAAAAH6AQEAAAAB-wEBAAAAAQvxAQEAAAAB8gEBAAAABfMBAQAAAAX0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAIYDACH5AQEAAAAB-gEBAAAAAfsBAQAAAAEHCAAA7AIAICQAAIgDACAlAACIAwAg8QEAAACFAgLyAQAAAIUCCPMBAAAAhQII-AEAAIcDhQIiBPEBAAAAhQIC8gEAAACFAgjzAQAAAIUCCPgBAACIA4UCIg4MAACRAwAg6gEAAIkDADDrAQAApgIAEOwBAACJAwAw7QEBAIoDACHwAUAAkAMAIYICQACQAwAhhQIAAIsDhQIihgIBAIoDACGHAgEAjAMAIYgCCACNAwAhiQICAI4DACGKAgEAigMAIYsCAACPAwAgC_EBAQAAAAHyAQEAAAAE8wEBAAAABPQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEA7wIAIfkBAQAAAAH6AQEAAAAB-wEBAAAAAQTxAQAAAIUCAvIBAAAAhQII8wEAAACFAgj4AQAAiAOFAiIL8QEBAAAAAfIBAQAAAAXzAQEAAAAF9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQCGAwAh-QEBAAAAAfoBAQAAAAH7AQEAAAABCPEBCAAAAAHyAQgAAAAE8wEIAAAABPQBCAAAAAH1AQgAAAAB9gEIAAAAAfcBCAAAAAH4AQgAgwMAIQjxAQIAAAAB8gECAAAABPMBAgAAAAT0AQIAAAAB9QECAAAAAfYBAgAAAAH3AQIAAAAB-AECAOwCACEM8QGAAAAAAfQBgAAAAAH1AYAAAAAB9gGAAAAAAfcBgAAAAAH4AYAAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABjwKAAAAAAZACgAAAAAGRAoAAAAABCPEBQAAAAAHyAUAAAAAE8wFAAAAABPQBQAAAAAH1AUAAAAAB9gFAAAAAAfcBQAAAAAH4AUAA7QIAIQOSAgAAIgAgkwIAACIAIJQCAAAiACAN6gEAAJIDADDrAQAAoAIAEOwBAACSAwAw7QEBAOkCACHuAQEA6QIAIe8BAQDpAgAh8AFAAOoCACGAAgAAlAObAiKVAgIA_wIAIZYCAQDpAgAhlwIBAOkCACGYAgAAkwMAIJkCIADzAgAhBPEBAQAAAAWbAgEAAAABnAIBAAAABJ0CAQAAAAQHCAAA7AIAICQAAJYDACAlAACWAwAg8QEAAACbAgLyAQAAAJsCCPMBAAAAmwII-AEAAJUDmwIiBwgAAOwCACAkAACWAwAgJQAAlgMAIPEBAAAAmwIC8gEAAACbAgjzAQAAAJsCCPgBAACVA5sCIgTxAQAAAJsCAvIBAAAAmwII8wEAAACbAgj4AQAAlgObAiIP6gEAAJcDADDrAQAAigIAEOwBAACXAwAw7QEBAOkCACHuAQEA6QIAIfABQADqAgAhgAIAAJgDoQIiggJAAOoCACGKAgEA6QIAIZ4CAQD9AgAhnwIIAP4CACGiAgAAmQOiAiOjAgEA_QIAIaQCAQD9AgAhpQIBAP0CACEHCAAA7AIAICQAAJ0DACAlAACdAwAg8QEAAAChAgLyAQAAAKECCPMBAAAAoQII-AEAAJwDoQIiBwgAAPkCACAkAACbAwAgJQAAmwMAIPEBAAAAogID8gEAAACiAgnzAQAAAKICCfgBAACaA6ICIwcIAAD5AgAgJAAAmwMAICUAAJsDACDxAQAAAKICA_IBAAAAogIJ8wEAAACiAgn4AQAAmgOiAiME8QEAAACiAgPyAQAAAKICCfMBAAAAogIJ-AEAAJsDogIjBwgAAOwCACAkAACdAwAgJQAAnQMAIPEBAAAAoQIC8gEAAAChAgjzAQAAAKECCPgBAACcA6ECIgTxAQAAAKECAvIBAAAAoQII8wEAAAChAgj4AQAAnQOhAiIY6gEAAJ4DADDrAQAA8gEAEOwBAACeAwAw7QEBAOkCACHwAUAA6gIAIYICQADqAgAhhwIBAOkCACGIAggAoAMAIZYCAQDpAgAhpgIBAP0CACGnAgAAkwMAIKgCAgD_AgAhqQIBAOkCACGqAgAAkwMAIKsCAQDpAgAhrAIAAJMDACCuAgAAnwOuAiKvAgEA_QIAIbACAQD9AgAhsQIBAP0CACGyAgIAoQMAIbMCCACgAwAhtAJAAPECACG1AiAA8wIAIQcIAADsAgAgJAAApgMAICUAAKYDACDxAQAAAK4CAvIBAAAArgII8wEAAACuAgj4AQAApQOuAiINCAAA-QIAICQAAKMDACAlAACjAwAglgEAAKMDACCXAQAAowMAIPEBCAAAAAHyAQgAAAAF8wEIAAAABfQBCAAAAAH1AQgAAAAB9gEIAAAAAfcBCAAAAAH4AQgApAMAIQ0IAAD5AgAgJAAA-QIAICUAAPkCACCWAQAAowMAIJcBAAD5AgAg8QECAAAAAfIBAgAAAAXzAQIAAAAF9AECAAAAAfUBAgAAAAH2AQIAAAAB9wECAAAAAfgBAgCiAwAhDQgAAPkCACAkAAD5AgAgJQAA-QIAIJYBAACjAwAglwEAAPkCACDxAQIAAAAB8gECAAAABfMBAgAAAAX0AQIAAAAB9QECAAAAAfYBAgAAAAH3AQIAAAAB-AECAKIDACEI8QEIAAAAAfIBCAAAAAXzAQgAAAAF9AEIAAAAAfUBCAAAAAH2AQgAAAAB9wEIAAAAAfgBCACjAwAhDQgAAPkCACAkAACjAwAgJQAAowMAIJYBAACjAwAglwEAAKMDACDxAQgAAAAB8gEIAAAABfMBCAAAAAX0AQgAAAAB9QEIAAAAAfYBCAAAAAH3AQgAAAAB-AEIAKQDACEHCAAA7AIAICQAAKYDACAlAACmAwAg8QEAAACuAgLyAQAAAK4CCPMBAAAArgII-AEAAKUDrgIiBPEBAAAArgIC8gEAAACuAgjzAQAAAK4CCPgBAACmA64CIhsEAACtAwAgBgAArgMAIAcAAK8DACDqAQAApwMAMOsBAADfAQAQ7AEAAKcDADDtAQEAigMAIfABQACQAwAhggJAAJADACGHAgEAigMAIYgCCACpAwAhlgIBAIoDACGmAgEAjAMAIacCAACTAwAgqAICAI4DACGpAgEAigMAIaoCAACTAwAgqwIBAIoDACGsAgAAkwMAIK4CAACoA64CIq8CAQCMAwAhsAIBAIwDACGxAgEAjAMAIbICAgCqAwAhswIIAKkDACG0AkAAqwMAIbUCIACsAwAhBPEBAAAArgIC8gEAAACuAgjzAQAAAK4CCPgBAACmA64CIgjxAQgAAAAB8gEIAAAABfMBCAAAAAX0AQgAAAAB9QEIAAAAAfYBCAAAAAH3AQgAAAAB-AEIAKMDACEI8QECAAAAAfIBAgAAAAXzAQIAAAAF9AECAAAAAfUBAgAAAAH2AQIAAAAB9wECAAAAAfgBAgD5AgAhCPEBQAAAAAHyAUAAAAAF8wFAAAAABfQBQAAAAAH1AUAAAAAB9gFAAAAAAfcBQAAAAAH4AUAA-gIAIQLxASAAAAAB-AEgAPUCACEDkgIAAAMAIJMCAAADACCUAgAAAwAgA5ICAAAIACCTAgAACAAglAIAAAgAIAOSAgAADAAgkwIAAAwAIJQCAAAMACAG6gEAALADADDrAQAA2QEAEOwBAACwAwAw7QEBAOkCACHuAQEA6QIAIbYCAQDpAgAhC-oBAACxAwAw6wEAAMMBABDsAQAAsQMAMO0BAQDpAgAh7gEBAOkCACHvAQEA6QIAIfABQADqAgAhggJAAOoCACG4AgAAsgO4AiK5AkAA6gIAIboCQADxAgAhBwgAAOwCACAkAAC0AwAgJQAAtAMAIPEBAAAAuAIC8gEAAAC4AgjzAQAAALgCCPgBAACzA7gCIgcIAADsAgAgJAAAtAMAICUAALQDACDxAQAAALgCAvIBAAAAuAII8wEAAAC4Agj4AQAAswO4AiIE8QEAAAC4AgLyAQAAALgCCPMBAAAAuAII-AEAALQDuAIiCeoBAAC1AwAw6wEAAK0BABDsAQAAtQMAMO0BAQDpAgAh7gEBAOkCACHwAUAA6gIAIZcCAQDpAgAhtgIBAOkCACG7AgEA_QIAIQnqAQAAtgMAMOsBAACXAQAQ7AEAALYDADDtAQEA6QIAIfABQADqAgAhggJAAOoCACG6AkAA6gIAIbwCAQDpAgAhvQIBAOkCACEJ6gEAALcDADDrAQAAhAEAEOwBAAC3AwAw7QEBAIoDACHwAUAAkAMAIYICQACQAwAhugJAAJADACG8AgEAigMAIb0CAQCKAwAhEOoBAAC4AwAw6wEAAH4AEOwBAAC4AwAw7QEBAOkCACHuAQEA6QIAIfABQADqAgAhggJAAOoCACG-AgEA6QIAIb8CAQDpAgAhwAIBAP0CACHBAgEA_QIAIcICAQD9AgAhwwJAAPECACHEAkAA8QIAIcUCAQD9AgAhxgIBAP0CACEL6gEAALkDADDrAQAAaAAQ7AEAALkDADDtAQEA6QIAIe4BAQDpAgAh8AFAAOoCACGCAkAA6gIAIboCQADqAgAhxwIBAOkCACHIAgEA_QIAIckCAQD9AgAhEeoBAAC6AwAw6wEAAFIAEOwBAAC6AwAw7QEBAOkCACHwAUAA6gIAIYACAAC8A9MCIoICQADqAgAhhQIBAOkCACG0AkAA8QIAIbUCIADzAgAhygIBAOkCACHLAiAA8wIAIcwCAQD9AgAhzQIBAP0CACHOAgEA_QIAIc8CQADxAgAh0QIAALsD0QIiBwgAAOwCACAkAADAAwAgJQAAwAMAIPEBAAAA0QIC8gEAAADRAgjzAQAAANECCPgBAAC_A9ECIgcIAADsAgAgJAAAvgMAICUAAL4DACDxAQAAANMCAvIBAAAA0wII8wEAAADTAgj4AQAAvQPTAiIHCAAA7AIAICQAAL4DACAlAAC-AwAg8QEAAADTAgLyAQAAANMCCPMBAAAA0wII-AEAAL0D0wIiBPEBAAAA0wIC8gEAAADTAgjzAQAAANMCCPgBAAC-A9MCIgcIAADsAgAgJAAAwAMAICUAAMADACDxAQAAANECAvIBAAAA0QII8wEAAADRAgj4AQAAvwPRAiIE8QEAAADRAgLyAQAAANECCPMBAAAA0QII-AEAAMAD0QIiGgQAAK0DACAGAACuAwAgBwAArwMAIAoAAMUDACALAADGAwAgDgAAxAMAIA8AAMcDACAQAADIAwAgEQAAyQMAIOoBAADBAwAw6wEAAD8AEOwBAADBAwAw7QEBAIoDACHwAUAAkAMAIYACAADDA9MCIoICQACQAwAhhQIBAIoDACG0AkAAqwMAIbUCIACsAwAhygIBAIoDACHLAiAArAMAIcwCAQCMAwAhzQIBAIwDACHOAgEAjAMAIc8CQACrAwAh0QIAAMID0QIiBPEBAAAA0QIC8gEAAADRAgjzAQAAANECCPgBAADAA9ECIgTxAQAAANMCAvIBAAAA0wII8wEAAADTAgj4AQAAvgPTAiIDkgIAAB4AIJMCAAAeACCUAgAAHgAgA5ICAAATACCTAgAAEwAglAIAABMAIAOSAgAAFwAgkwIAABcAIJQCAAAXACASAwAAywMAIA0AAM8DACAOAADEAwAg6gEAAM0DADDrAQAAIgAQ7AEAAM0DADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACH8AQEAigMAIf0BQACQAwAh_gFAAKsDACGAAgAAzgOAAiKBAiAArAMAIYICQACQAwAhgwJAAKsDACHWAgAAIgAg1wIAACIAIAOSAgAALgAgkwIAAC4AIJQCAAAuACADkgIAADIAIJMCAAAyACCUAgAAMgAgEQMAAMsDACDqAQAAygMAMOsBAAAyABDsAQAAygMAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIYICQACQAwAhvgIBAIoDACG_AgEAigMAIcACAQCMAwAhwQIBAIwDACHCAgEAjAMAIcMCQACrAwAhxAJAAKsDACHFAgEAjAMAIcYCAQCMAwAhHAQAAK0DACAGAACuAwAgBwAArwMAIAoAAMUDACALAADGAwAgDgAAxAMAIA8AAMcDACAQAADIAwAgEQAAyQMAIOoBAADBAwAw6wEAAD8AEOwBAADBAwAw7QEBAIoDACHwAUAAkAMAIYACAADDA9MCIoICQACQAwAhhQIBAIoDACG0AkAAqwMAIbUCIACsAwAhygIBAIoDACHLAiAArAMAIcwCAQCMAwAhzQIBAIwDACHOAgEAjAMAIc8CQACrAwAh0QIAAMID0QIi1gIAAD8AINcCAAA_ACAMAwAAywMAIOoBAADMAwAw6wEAAC4AEOwBAADMAwAw7QEBAIoDACHuAQEAigMAIfABQACQAwAhggJAAJADACG6AkAAkAMAIccCAQCKAwAhyAIBAIwDACHJAgEAjAMAIRADAADLAwAgDQAAzwMAIA4AAMQDACDqAQAAzQMAMOsBAAAiABDsAQAAzQMAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIfwBAQCKAwAh_QFAAJADACH-AUAAqwMAIYACAADOA4ACIoECIACsAwAhggJAAJADACGDAkAAqwMAIQTxAQAAAIACAvIBAAAAgAII8wEAAACAAgj4AQAA9wKAAiIQDAAAkQMAIOoBAACJAwAw6wEAAKYCABDsAQAAiQMAMO0BAQCKAwAh8AFAAJADACGCAkAAkAMAIYUCAACLA4UCIoYCAQCKAwAhhwIBAIwDACGIAggAjQMAIYkCAgCOAwAhigIBAIoDACGLAgAAjwMAINYCAACmAgAg1wIAAKYCACARAwAAywMAIA8AAMcDACDqAQAA0AMAMOsBAAAeABDsAQAA0AMAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIYACAADRA6ECIoICQACQAwAhigIBAIoDACGeAgEAjAMAIZ8CCACNAwAhogIAANIDogIjowIBAIwDACGkAgEAjAMAIaUCAQCMAwAhBPEBAAAAoQIC8gEAAAChAgjzAQAAAKECCPgBAACdA6ECIgTxAQAAAKICA_IBAAAAogIJ8wEAAACiAgn4AQAAmwOiAiMLAwAAywMAIAkAANQDACDqAQAA0wMAMOsBAAAXABDsAQAA0wMAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIZcCAQCKAwAhtgIBAIoDACG7AgEAjAMAIRMDAADLAwAgBQAA2gMAIAoAAMUDACALAADGAwAg6gEAAN0DADDrAQAAAwAQ7AEAAN0DADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYACAADeA5sCIpUCAgCOAwAhlgIBAIoDACGXAgEAigMAIZgCAACTAwAgmQIgAKwDACHWAgAAAwAg1wIAAAMAIALuAQEAAAABtgIBAAAAAQgDAADLAwAgCQAA1AMAIOoBAADWAwAw6wEAABMAEOwBAADWAwAw7QEBAIoDACHuAQEAigMAIbYCAQCKAwAhA-4BAQAAAAHvAQEAAAABuAIAAAC4AgINAwAAywMAIAUAANoDACDqAQAA2AMAMOsBAAAMABDsAQAA2AMAMO0BAQCKAwAh7gEBAIoDACHvAQEAigMAIfABQACQAwAhggJAAJADACG4AgAA2QO4AiK5AkAAkAMAIboCQACrAwAhBPEBAAAAuAIC8gEAAAC4AgjzAQAAALgCCPgBAAC0A7gCIh0EAACtAwAgBgAArgMAIAcAAK8DACDqAQAApwMAMOsBAADfAQAQ7AEAAKcDADDtAQEAigMAIfABQACQAwAhggJAAJADACGHAgEAigMAIYgCCACpAwAhlgIBAIoDACGmAgEAjAMAIacCAACTAwAgqAICAI4DACGpAgEAigMAIaoCAACTAwAgqwIBAIoDACGsAgAAkwMAIK4CAACoA64CIq8CAQCMAwAhsAIBAIwDACGxAgEAjAMAIbICAgCqAwAhswIIAKkDACG0AkAAqwMAIbUCIACsAwAh1gIAAN8BACDXAgAA3wEAIALuAQEAAAAB7wEBAAAAAQkDAADLAwAgBQAA2gMAIOoBAADcAwAw6wEAAAgAEOwBAADcAwAw7QEBAIoDACHuAQEAigMAIe8BAQCKAwAh8AFAAJADACERAwAAywMAIAUAANoDACAKAADFAwAgCwAAxgMAIOoBAADdAwAw6wEAAAMAEOwBAADdAwAw7QEBAIoDACHuAQEAigMAIe8BAQCKAwAh8AFAAJADACGAAgAA3gObAiKVAgIAjgMAIZYCAQCKAwAhlwIBAIoDACGYAgAAkwMAIJkCIACsAwAhBPEBAAAAmwIC8gEAAACbAgjzAQAAAJsCCPgBAACWA5sCIgAAAAHbAgEAAAABAdsCQAAAAAEFHgAA9QYAIB8AAPsGACDYAgAA9gYAINkCAAD6BgAg3gIAAAEAIAUeAADzBgAgHwAA-AYAINgCAAD0BgAg2QIAAPcGACDeAgAA3AEAIAMeAAD1BgAg2AIAAPYGACDeAgAAAQAgAx4AAPMGACDYAgAA9AYAIN4CAADcAQAgAAAAAAHbAkAAAAABAdsCAAAAgAICAdsCIAAAAAEFHgAA5QYAIB8AAPEGACDYAgAA5gYAINkCAADwBgAg3gIAAAEAIAUeAADjBgAgHwAA7gYAINgCAADkBgAg2QIAAO0GACDeAgAAowIAIAseAADyAwAwHwAA9wMAMNgCAADzAwAw2QIAAPQDADDaAgAA9QMAINsCAAD2AwAw3AIAAPYDADDdAgAA9gMAMN4CAAD2AwAw3wIAAPgDADDgAgAA-QMAMAwDAACDBAAg7QEBAAAAAe4BAQAAAAHwAUAAAAABgAIAAAChAgKCAkAAAAABigIBAAAAAZ8CCAAAAAGiAgAAAKICA6MCAQAAAAGkAgEAAAABpQIBAAAAAQIAAAAgACAeAACCBAAgAwAAACAAIB4AAIIEACAfAACABAAgARcAAOwGADARAwAAywMAIA8AAMcDACDqAQAA0AMAMOsBAAAeABDsAQAA0AMAMO0BAQAAAAHuAQEAigMAIfABQACQAwAhgAIAANEDoQIiggJAAJADACGKAgEAigMAIZ4CAQCMAwAhnwIIAI0DACGiAgAA0gOiAiOjAgEAjAMAIaQCAQCMAwAhpQIBAIwDACECAAAAIAAgFwAAgAQAIAIAAAD6AwAgFwAA-wMAIA_qAQAA-QMAMOsBAAD6AwAQ7AEAAPkDADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGAAgAA0QOhAiKCAkAAkAMAIYoCAQCKAwAhngIBAIwDACGfAggAjQMAIaICAADSA6ICI6MCAQCMAwAhpAIBAIwDACGlAgEAjAMAIQ_qAQAA-QMAMOsBAAD6AwAQ7AEAAPkDADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGAAgAA0QOhAiKCAkAAkAMAIYoCAQCKAwAhngIBAIwDACGfAggAjQMAIaICAADSA6ICI6MCAQCMAwAhpAIBAIwDACGlAgEAjAMAIQvtAQEA4gMAIe4BAQDiAwAh8AFAAOMDACGAAgAA_QOhAiKCAkAA4wMAIYoCAQDiAwAhnwIIAPwDACGiAgAA_gOiAiOjAgEA_wMAIaQCAQD_AwAhpQIBAP8DACEF2wIIAAAAAeECCAAAAAHiAggAAAAB4wIIAAAAAeQCCAAAAAEB2wIAAAChAgIB2wIAAACiAgMB2wIBAAAAAQwDAACBBAAg7QEBAOIDACHuAQEA4gMAIfABQADjAwAhgAIAAP0DoQIiggJAAOMDACGKAgEA4gMAIZ8CCAD8AwAhogIAAP4DogIjowIBAP8DACGkAgEA_wMAIaUCAQD_AwAhBR4AAOcGACAfAADqBgAg2AIAAOgGACDZAgAA6QYAIN4CAAABACAMAwAAgwQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAYACAAAAoQICggJAAAAAAYoCAQAAAAGfAggAAAABogIAAACiAgOjAgEAAAABpAIBAAAAAaUCAQAAAAEDHgAA5wYAINgCAADoBgAg3gIAAAEAIAMeAADlBgAg2AIAAOYGACDeAgAAAQAgAx4AAOMGACDYAgAA5AYAIN4CAACjAgAgBB4AAPIDADDYAgAA8wMAMNoCAAD1AwAg3gIAAPYDADAAAAAAAAHbAgAAAIUCAgXbAgIAAAAB4QICAAAAAeICAgAAAAHjAgIAAAAB5AICAAAAAQseAACPBAAwHwAAlAQAMNgCAACQBAAw2QIAAJEEADDaAgAAkgQAINsCAACTBAAw3AIAAJMEADDdAgAAkwQAMN4CAACTBAAw3wIAAJUEADDgAgAAlgQAMAsDAACEBAAgDgAAhgQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAf0BQAAAAAH-AUAAAAABgAIAAACAAgKBAiAAAAABggJAAAAAAYMCQAAAAAECAAAAJQAgHgAAmgQAIAMAAAAlACAeAACaBAAgHwAAmQQAIAEXAADiBgAwEAMAAMsDACANAADPAwAgDgAAxAMAIOoBAADNAwAw6wEAACIAEOwBAADNAwAw7QEBAAAAAe4BAQAAAAHwAUAAkAMAIfwBAQCKAwAh_QFAAJADACH-AUAAqwMAIYACAADOA4ACIoECIACsAwAhggJAAJADACGDAkAAqwMAIQIAAAAlACAXAACZBAAgAgAAAJcEACAXAACYBAAgDeoBAACWBAAw6wEAAJcEABDsAQAAlgQAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIfwBAQCKAwAh_QFAAJADACH-AUAAqwMAIYACAADOA4ACIoECIACsAwAhggJAAJADACGDAkAAqwMAIQ3qAQAAlgQAMOsBAACXBAAQ7AEAAJYEADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACH8AQEAigMAIf0BQACQAwAh_gFAAKsDACGAAgAAzgOAAiKBAiAArAMAIYICQACQAwAhgwJAAKsDACEJ7QEBAOIDACHuAQEA4gMAIfABQADjAwAh_QFAAOMDACH-AUAA7AMAIYACAADtA4ACIoECIADuAwAhggJAAOMDACGDAkAA7AMAIQsDAADvAwAgDgAA8QMAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIf0BQADjAwAh_gFAAOwDACGAAgAA7QOAAiKBAiAA7gMAIYICQADjAwAhgwJAAOwDACELAwAAhAQAIA4AAIYEACDtAQEAAAAB7gEBAAAAAfABQAAAAAH9AUAAAAAB_gFAAAAAAYACAAAAgAICgQIgAAAAAYICQAAAAAGDAkAAAAABBB4AAI8EADDYAgAAkAQAMNoCAACSBAAg3gIAAJMEADAAAAAAAAAC2wIBAAAABOUCAQAAAAUB2wIAAACbAgIFHgAAzgYAIB8AAOAGACDYAgAAzwYAINkCAADfBgAg3gIAAAEAIAUeAADMBgAgHwAA3QYAINgCAADNBgAg2QIAANwGACDeAgAA3AEAIAseAAC2BAAwHwAAuwQAMNgCAAC3BAAw2QIAALgEADDaAgAAuQQAINsCAAC6BAAw3AIAALoEADDdAgAAugQAMN4CAAC6BAAw3wIAALwEADDgAgAAvQQAMAseAACoBAAwHwAArQQAMNgCAACpBAAw2QIAAKoEADDaAgAAqwQAINsCAACsBAAw3AIAAKwEADDdAgAArAQAMN4CAACsBAAw3wIAAK4EADDgAgAArwQAMAYDAAC1BAAg7QEBAAAAAe4BAQAAAAHwAUAAAAABlwIBAAAAAbsCAQAAAAECAAAAGQAgHgAAtAQAIAMAAAAZACAeAAC0BAAgHwAAsgQAIAEXAADbBgAwCwMAAMsDACAJAADUAwAg6gEAANMDADDrAQAAFwAQ7AEAANMDADDtAQEAAAAB7gEBAIoDACHwAUAAkAMAIZcCAQCKAwAhtgIBAIoDACG7AgEAjAMAIQIAAAAZACAXAACyBAAgAgAAALAEACAXAACxBAAgCeoBAACvBAAw6wEAALAEABDsAQAArwQAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIZcCAQCKAwAhtgIBAIoDACG7AgEAjAMAIQnqAQAArwQAMOsBAACwBAAQ7AEAAK8EADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGXAgEAigMAIbYCAQCKAwAhuwIBAIwDACEF7QEBAOIDACHuAQEA4gMAIfABQADjAwAhlwIBAOIDACG7AgEA_wMAIQYDAACzBAAg7QEBAOIDACHuAQEA4gMAIfABQADjAwAhlwIBAOIDACG7AgEA_wMAIQUeAADWBgAgHwAA2QYAINgCAADXBgAg2QIAANgGACDeAgAAAQAgBgMAALUEACDtAQEAAAAB7gEBAAAAAfABQAAAAAGXAgEAAAABuwIBAAAAAQMeAADWBgAg2AIAANcGACDeAgAAAQAgAwMAAMMEACDtAQEAAAAB7gEBAAAAAQIAAAAVACAeAADCBAAgAwAAABUAIB4AAMIEACAfAADABAAgARcAANUGADAJAwAAywMAIAkAANQDACDqAQAA1gMAMOsBAAATABDsAQAA1gMAMO0BAQAAAAHuAQEAigMAIbYCAQCKAwAh0wIAANUDACACAAAAFQAgFwAAwAQAIAIAAAC-BAAgFwAAvwQAIAbqAQAAvQQAMOsBAAC-BAAQ7AEAAL0EADDtAQEAigMAIe4BAQCKAwAhtgIBAIoDACEG6gEAAL0EADDrAQAAvgQAEOwBAAC9BAAw7QEBAIoDACHuAQEAigMAIbYCAQCKAwAhAu0BAQDiAwAh7gEBAOIDACEDAwAAwQQAIO0BAQDiAwAh7gEBAOIDACEFHgAA0AYAIB8AANMGACDYAgAA0QYAINkCAADSBgAg3gIAAAEAIAMDAADDBAAg7QEBAAAAAe4BAQAAAAEDHgAA0AYAINgCAADRBgAg3gIAAAEAIAHbAgEAAAAEAx4AAM4GACDYAgAAzwYAIN4CAAABACADHgAAzAYAINgCAADNBgAg3gIAANwBACAEHgAAtgQAMNgCAAC3BAAw2gIAALkEACDeAgAAugQAMAQeAACoBAAw2AIAAKkEADDaAgAAqwQAIN4CAACsBAAwAAAAAAAHHgAAxwYAIB8AAMoGACDYAgAAyAYAINkCAADJBgAg3AIAACIAIN0CAAAiACDeAgAAJQAgAx4AAMcGACDYAgAAyAYAIN4CAAAlACAAAAAAAALbAgEAAAAE5QIBAAAABQLbAgEAAAAE5QIBAAAABQLbAgEAAAAE5QIBAAAABQHbAgAAAK4CAgXbAggAAAAB4QIIAAAAAeICCAAAAAHjAggAAAAB5AIIAAAAAQXbAgIAAAAB4QICAAAAAeICAgAAAAHjAgIAAAAB5AICAAAAAQseAAD5BAAwHwAA_gQAMNgCAAD6BAAw2QIAAPsEADDaAgAA_AQAINsCAAD9BAAw3AIAAP0EADDdAgAA_QQAMN4CAAD9BAAw3wIAAP8EADDgAgAAgAUAMAseAADtBAAwHwAA8gQAMNgCAADuBAAw2QIAAO8EADDaAgAA8AQAINsCAADxBAAw3AIAAPEEADDdAgAA8QQAMN4CAADxBAAw3wIAAPMEADDgAgAA9AQAMAseAADeBAAwHwAA4wQAMNgCAADfBAAw2QIAAOAEADDaAgAA4QQAINsCAADiBAAw3AIAAOIEADDdAgAA4gQAMN4CAADiBAAw3wIAAOQEADDgAgAA5QQAMAgDAADsBAAg7QEBAAAAAe4BAQAAAAHwAUAAAAABggJAAAAAAbgCAAAAuAICuQJAAAAAAboCQAAAAAECAAAADgAgHgAA6wQAIAMAAAAOACAeAADrBAAgHwAA6QQAIAEXAADGBgAwDgMAAMsDACAFAADaAwAg6gEAANgDADDrAQAADAAQ7AEAANgDADDtAQEAAAAB7gEBAIoDACHvAQEAigMAIfABQACQAwAhggJAAJADACG4AgAA2QO4AiK5AkAAkAMAIboCQACrAwAh1AIAANcDACACAAAADgAgFwAA6QQAIAIAAADmBAAgFwAA5wQAIAvqAQAA5QQAMOsBAADmBAAQ7AEAAOUEADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYICQACQAwAhuAIAANkDuAIiuQJAAJADACG6AkAAqwMAIQvqAQAA5QQAMOsBAADmBAAQ7AEAAOUEADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYICQACQAwAhuAIAANkDuAIiuQJAAJADACG6AkAAqwMAIQftAQEA4gMAIe4BAQDiAwAh8AFAAOMDACGCAkAA4wMAIbgCAADoBLgCIrkCQADjAwAhugJAAOwDACEB2wIAAAC4AgIIAwAA6gQAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIYICQADjAwAhuAIAAOgEuAIiuQJAAOMDACG6AkAA7AMAIQUeAADBBgAgHwAAxAYAINgCAADCBgAg2QIAAMMGACDeAgAAAQAgCAMAAOwEACDtAQEAAAAB7gEBAAAAAfABQAAAAAGCAkAAAAABuAIAAAC4AgK5AkAAAAABugJAAAAAAQMeAADBBgAg2AIAAMIGACDeAgAAAQAgBAMAAOYDACDtAQEAAAAB7gEBAAAAAfABQAAAAAECAAAACgAgHgAA-AQAIAMAAAAKACAeAAD4BAAgHwAA9wQAIAEXAADABgAwCgMAAMsDACAFAADaAwAg6gEAANwDADDrAQAACAAQ7AEAANwDADDtAQEAAAAB7gEBAIoDACHvAQEAigMAIfABQACQAwAh1QIAANsDACACAAAACgAgFwAA9wQAIAIAAAD1BAAgFwAA9gQAIAfqAQAA9AQAMOsBAAD1BAAQ7AEAAPQEADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIQfqAQAA9AQAMOsBAAD1BAAQ7AEAAPQEADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIQPtAQEA4gMAIe4BAQDiAwAh8AFAAOMDACEEAwAA5AMAIO0BAQDiAwAh7gEBAOIDACHwAUAA4wMAIQQDAADmAwAg7QEBAAAAAe4BAQAAAAHwAUAAAAABDAMAAMUEACAKAADHBAAgCwAAyAQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABAgAAAAUAIB4AAIQFACADAAAABQAgHgAAhAUAIB8AAIMFACABFwAAvwYAMBEDAADLAwAgBQAA2gMAIAoAAMUDACALAADGAwAg6gEAAN0DADDrAQAAAwAQ7AEAAN0DADDtAQEAAAAB7gEBAIoDACHvAQEAigMAIfABQACQAwAhgAIAAN4DmwIilQICAI4DACGWAgEAigMAIZcCAQCKAwAhmAIAAJMDACCZAiAArAMAIQIAAAAFACAXAACDBQAgAgAAAIEFACAXAACCBQAgDeoBAACABQAw6wEAAIEFABDsAQAAgAUAMO0BAQCKAwAh7gEBAIoDACHvAQEAigMAIfABQACQAwAhgAIAAN4DmwIilQICAI4DACGWAgEAigMAIZcCAQCKAwAhmAIAAJMDACCZAiAArAMAIQ3qAQAAgAUAMOsBAACBBQAQ7AEAAIAFADDtAQEAigMAIe4BAQCKAwAh7wEBAIoDACHwAUAAkAMAIYACAADeA5sCIpUCAgCOAwAhlgIBAIoDACGXAgEAigMAIZgCAACTAwAgmQIgAKwDACEJ7QEBAOIDACHuAQEA4gMAIfABQADjAwAhgAIAAKMEmwIilQICAI0EACGWAgEA4gMAIZcCAQDiAwAhmAIAAKIEACCZAiAA7gMAIQwDAACkBAAgCgAApgQAIAsAAKcEACDtAQEA4gMAIe4BAQDiAwAh8AFAAOMDACGAAgAAowSbAiKVAgIAjQQAIZYCAQDiAwAhlwIBAOIDACGYAgAAogQAIJkCIADuAwAhDAMAAMUEACAKAADHBAAgCwAAyAQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABAdsCAQAAAAQB2wIBAAAABAHbAgEAAAAEBB4AAPkEADDYAgAA-gQAMNoCAAD8BAAg3gIAAP0EADAEHgAA7QQAMNgCAADuBAAw2gIAAPAEACDeAgAA8QQAMAQeAADeBAAw2AIAAN8EADDaAgAA4QQAIN4CAADiBAAwAAAAAAAABR4AALoGACAfAAC9BgAg2AIAALsGACDZAgAAvAYAIN4CAAAFACADHgAAugYAINgCAAC7BgAg3gIAAAUAIAAAAAUeAAC1BgAgHwAAuAYAINgCAAC2BgAg2QIAALcGACDeAgAA3AEAIAMeAAC1BgAg2AIAALYGACDeAgAA3AEAIAAAAAUeAACwBgAgHwAAswYAINgCAACxBgAg2QIAALIGACDeAgAABQAgAx4AALAGACDYAgAAsQYAIN4CAAAFACAAAAAAAAAFHgAAqwYAIB8AAK4GACDYAgAArAYAINkCAACtBgAg3gIAAAEAIAMeAACrBgAg2AIAAKwGACDeAgAAAQAgAAAABR4AAKYGACAfAACpBgAg2AIAAKcGACDZAgAAqAYAIN4CAAABACADHgAApgYAINgCAACnBgAg3gIAAAEAIAAAAAHbAgAAANECAgHbAgAAANMCAgseAACCBgAwHwAAhgYAMNgCAACDBgAw2QIAAIQGADDaAgAAhQYAINsCAAD9BAAw3AIAAP0EADDdAgAA_QQAMN4CAAD9BAAw3wIAAIcGADDgAgAAgAUAMAseAAD5BQAwHwAA_QUAMNgCAAD6BQAw2QIAAPsFADDaAgAA_AUAINsCAADxBAAw3AIAAPEEADDdAgAA8QQAMN4CAADxBAAw3wIAAP4FADDgAgAA9AQAMAseAADwBQAwHwAA9AUAMNgCAADxBQAw2QIAAPIFADDaAgAA8wUAINsCAAD2AwAw3AIAAPYDADDdAgAA9gMAMN4CAAD2AwAw3wIAAPUFADDgAgAA-QMAMAseAADnBQAwHwAA6wUAMNgCAADoBQAw2QIAAOkFADDaAgAA6gUAINsCAAC6BAAw3AIAALoEADDdAgAAugQAMN4CAAC6BAAw3wIAAOwFADDgAgAAvQQAMAseAADeBQAwHwAA4gUAMNgCAADfBQAw2QIAAOAFADDaAgAA4QUAINsCAACsBAAw3AIAAKwEADDdAgAArAQAMN4CAACsBAAw3wIAAOMFADDgAgAArwQAMAceAADZBQAgHwAA3AUAINgCAADaBQAg2QIAANsFACDcAgAAIgAg3QIAACIAIN4CAAAlACALHgAA0AUAMB8AANQFADDYAgAA0QUAMNkCAADSBQAw2gIAANMFACDbAgAA4gQAMNwCAADiBAAw3QIAAOIEADDeAgAA4gQAMN8CAADVBQAw4AIAAOUEADALHgAAxAUAMB8AAMkFADDYAgAAxQUAMNkCAADGBQAw2gIAAMcFACDbAgAAyAUAMNwCAADIBQAw3QIAAMgFADDeAgAAyAUAMN8CAADKBQAw4AIAAMsFADALHgAAuAUAMB8AAL0FADDYAgAAuQUAMNkCAAC6BQAw2gIAALsFACDbAgAAvAUAMNwCAAC8BQAw3QIAALwFADDeAgAAvAUAMN8CAAC-BQAw4AIAAL8FADAM7QEBAAAAAfABQAAAAAGCAkAAAAABvgIBAAAAAb8CAQAAAAHAAgEAAAABwQIBAAAAAcICAQAAAAHDAkAAAAABxAJAAAAAAcUCAQAAAAHGAgEAAAABAgAAADQAIB4AAMMFACADAAAANAAgHgAAwwUAIB8AAMIFACABFwAApQYAMBEDAADLAwAg6gEAAMoDADDrAQAAMgAQ7AEAAMoDADDtAQEAAAAB7gEBAIoDACHwAUAAkAMAIYICQACQAwAhvgIBAIoDACG_AgEAigMAIcACAQCMAwAhwQIBAIwDACHCAgEAjAMAIcMCQACrAwAhxAJAAKsDACHFAgEAjAMAIcYCAQCMAwAhAgAAADQAIBcAAMIFACACAAAAwAUAIBcAAMEFACAQ6gEAAL8FADDrAQAAwAUAEOwBAAC_BQAw7QEBAIoDACHuAQEAigMAIfABQACQAwAhggJAAJADACG-AgEAigMAIb8CAQCKAwAhwAIBAIwDACHBAgEAjAMAIcICAQCMAwAhwwJAAKsDACHEAkAAqwMAIcUCAQCMAwAhxgIBAIwDACEQ6gEAAL8FADDrAQAAwAUAEOwBAAC_BQAw7QEBAIoDACHuAQEAigMAIfABQACQAwAhggJAAJADACG-AgEAigMAIb8CAQCKAwAhwAIBAIwDACHBAgEAjAMAIcICAQCMAwAhwwJAAKsDACHEAkAAqwMAIcUCAQCMAwAhxgIBAIwDACEM7QEBAOIDACHwAUAA4wMAIYICQADjAwAhvgIBAOIDACG_AgEA4gMAIcACAQD_AwAhwQIBAP8DACHCAgEA_wMAIcMCQADsAwAhxAJAAOwDACHFAgEA_wMAIcYCAQD_AwAhDO0BAQDiAwAh8AFAAOMDACGCAkAA4wMAIb4CAQDiAwAhvwIBAOIDACHAAgEA_wMAIcECAQD_AwAhwgIBAP8DACHDAkAA7AMAIcQCQADsAwAhxQIBAP8DACHGAgEA_wMAIQztAQEAAAAB8AFAAAAAAYICQAAAAAG-AgEAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABxQIBAAAAAcYCAQAAAAEH7QEBAAAAAfABQAAAAAGCAkAAAAABugJAAAAAAccCAQAAAAHIAgEAAAAByQIBAAAAAQIAAAAwACAeAADPBQAgAwAAADAAIB4AAM8FACAfAADOBQAgARcAAKQGADAMAwAAywMAIOoBAADMAwAw6wEAAC4AEOwBAADMAwAw7QEBAAAAAe4BAQCKAwAh8AFAAJADACGCAkAAkAMAIboCQACQAwAhxwIBAAAAAcgCAQCMAwAhyQIBAIwDACECAAAAMAAgFwAAzgUAIAIAAADMBQAgFwAAzQUAIAvqAQAAywUAMOsBAADMBQAQ7AEAAMsFADDtAQEAigMAIe4BAQCKAwAh8AFAAJADACGCAkAAkAMAIboCQACQAwAhxwIBAIoDACHIAgEAjAMAIckCAQCMAwAhC-oBAADLBQAw6wEAAMwFABDsAQAAywUAMO0BAQCKAwAh7gEBAIoDACHwAUAAkAMAIYICQACQAwAhugJAAJADACHHAgEAigMAIcgCAQCMAwAhyQIBAIwDACEH7QEBAOIDACHwAUAA4wMAIYICQADjAwAhugJAAOMDACHHAgEA4gMAIcgCAQD_AwAhyQIBAP8DACEH7QEBAOIDACHwAUAA4wMAIYICQADjAwAhugJAAOMDACHHAgEA4gMAIcgCAQD_AwAhyQIBAP8DACEH7QEBAAAAAfABQAAAAAGCAkAAAAABugJAAAAAAccCAQAAAAHIAgEAAAAByQIBAAAAAQgFAACXBQAg7QEBAAAAAe8BAQAAAAHwAUAAAAABggJAAAAAAbgCAAAAuAICuQJAAAAAAboCQAAAAAECAAAADgAgHgAA2AUAIAMAAAAOACAeAADYBQAgHwAA1wUAIAEXAACjBgAwAgAAAA4AIBcAANcFACACAAAA5gQAIBcAANYFACAH7QEBAOIDACHvAQEA4gMAIfABQADjAwAhggJAAOMDACG4AgAA6AS4AiK5AkAA4wMAIboCQADsAwAhCAUAAJYFACDtAQEA4gMAIe8BAQDiAwAh8AFAAOMDACGCAkAA4wMAIbgCAADoBLgCIrkCQADjAwAhugJAAOwDACEIBQAAlwUAIO0BAQAAAAHvAQEAAAAB8AFAAAAAAYICQAAAAAG4AgAAALgCArkCQAAAAAG6AkAAAAABCw0AAIUEACAOAACGBAAg7QEBAAAAAfABQAAAAAH8AQEAAAAB_QFAAAAAAf4BQAAAAAGAAgAAAIACAoECIAAAAAGCAkAAAAABgwJAAAAAAQIAAAAlACAeAADZBQAgAwAAACIAIB4AANkFACAfAADdBQAgDQAAACIAIA0AAPADACAOAADxAwAgFwAA3QUAIO0BAQDiAwAh8AFAAOMDACH8AQEA4gMAIf0BQADjAwAh_gFAAOwDACGAAgAA7QOAAiKBAiAA7gMAIYICQADjAwAhgwJAAOwDACELDQAA8AMAIA4AAPEDACDtAQEA4gMAIfABQADjAwAh_AEBAOIDACH9AUAA4wMAIf4BQADsAwAhgAIAAO0DgAIigQIgAO4DACGCAkAA4wMAIYMCQADsAwAhBgkAAJwFACDtAQEAAAAB8AFAAAAAAZcCAQAAAAG2AgEAAAABuwIBAAAAAQIAAAAZACAeAADmBQAgAwAAABkAIB4AAOYFACAfAADlBQAgARcAAKIGADACAAAAGQAgFwAA5QUAIAIAAACwBAAgFwAA5AUAIAXtAQEA4gMAIfABQADjAwAhlwIBAOIDACG2AgEA4gMAIbsCAQD_AwAhBgkAAJsFACDtAQEA4gMAIfABQADjAwAhlwIBAOIDACG2AgEA4gMAIbsCAQD_AwAhBgkAAJwFACDtAQEAAAAB8AFAAAAAAZcCAQAAAAG2AgEAAAABuwIBAAAAAQMJAACSBQAg7QEBAAAAAbYCAQAAAAECAAAAFQAgHgAA7wUAIAMAAAAVACAeAADvBQAgHwAA7gUAIAEXAAChBgAwAgAAABUAIBcAAO4FACACAAAAvgQAIBcAAO0FACAC7QEBAOIDACG2AgEA4gMAIQMJAACRBQAg7QEBAOIDACG2AgEA4gMAIQMJAACSBQAg7QEBAAAAAbYCAQAAAAEMDwAAzwQAIO0BAQAAAAHwAUAAAAABgAIAAAChAgKCAkAAAAABigIBAAAAAZ4CAQAAAAGfAggAAAABogIAAACiAgOjAgEAAAABpAIBAAAAAaUCAQAAAAECAAAAIAAgHgAA-AUAIAMAAAAgACAeAAD4BQAgHwAA9wUAIAEXAACgBgAwAgAAACAAIBcAAPcFACACAAAA-gMAIBcAAPYFACAL7QEBAOIDACHwAUAA4wMAIYACAAD9A6ECIoICQADjAwAhigIBAOIDACGeAgEA_wMAIZ8CCAD8AwAhogIAAP4DogIjowIBAP8DACGkAgEA_wMAIaUCAQD_AwAhDA8AAM4EACDtAQEA4gMAIfABQADjAwAhgAIAAP0DoQIiggJAAOMDACGKAgEA4gMAIZ4CAQD_AwAhnwIIAPwDACGiAgAA_gOiAiOjAgEA_wMAIaQCAQD_AwAhpQIBAP8DACEMDwAAzwQAIO0BAQAAAAHwAUAAAAABgAIAAAChAgKCAkAAAAABigIBAAAAAZ4CAQAAAAGfAggAAAABogIAAACiAgOjAgEAAAABpAIBAAAAAaUCAQAAAAEEBQAA5wMAIO0BAQAAAAHvAQEAAAAB8AFAAAAAAQIAAAAKACAeAACBBgAgAwAAAAoAIB4AAIEGACAfAACABgAgARcAAJ8GADACAAAACgAgFwAAgAYAIAIAAAD1BAAgFwAA_wUAIAPtAQEA4gMAIe8BAQDiAwAh8AFAAOMDACEEBQAA5QMAIO0BAQDiAwAh7wEBAOIDACHwAUAA4wMAIQQFAADnAwAg7QEBAAAAAe8BAQAAAAHwAUAAAAABDAUAAMYEACAKAADHBAAgCwAAyAQAIO0BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABAgAAAAUAIB4AAIoGACADAAAABQAgHgAAigYAIB8AAIkGACABFwAAngYAMAIAAAAFACAXAACJBgAgAgAAAIEFACAXAACIBgAgCe0BAQDiAwAh7wEBAOIDACHwAUAA4wMAIYACAACjBJsCIpUCAgCNBAAhlgIBAOIDACGXAgEA4gMAIZgCAACiBAAgmQIgAO4DACEMBQAApQQAIAoAAKYEACALAACnBAAg7QEBAOIDACHvAQEA4gMAIfABQADjAwAhgAIAAKMEmwIilQICAI0EACGWAgEA4gMAIZcCAQDiAwAhmAIAAKIEACCZAiAA7gMAIQwFAADGBAAgCgAAxwQAIAsAAMgEACDtAQEAAAAB7wEBAAAAAfABQAAAAAGAAgAAAJsCApUCAgAAAAGWAgEAAAABlwIBAAAAAZgCAADEBAAgmQIgAAAAAQQeAACCBgAw2AIAAIMGADDaAgAAhQYAIN4CAAD9BAAwBB4AAPkFADDYAgAA-gUAMNoCAAD8BQAg3gIAAPEEADAEHgAA8AUAMNgCAADxBQAw2gIAAPMFACDeAgAA9gMAMAQeAADnBQAw2AIAAOgFADDaAgAA6gUAIN4CAAC6BAAwBB4AAN4FADDYAgAA3wUAMNoCAADhBQAg3gIAAKwEADADHgAA2QUAINgCAADaBQAg3gIAACUAIAQeAADQBQAw2AIAANEFADDaAgAA0wUAIN4CAADiBAAwBB4AAMQFADDYAgAAxQUAMNoCAADHBQAg3gIAAMgFADAEHgAAuAUAMNgCAAC5BQAw2gIAALsFACDeAgAAvAUAMAAAAAUDAACaBgAgDQAAmwYAIA4AAJQGACD-AQAA6AMAIIMCAADoAwAgAAAOBAAAiwUAIAYAAIwFACAHAACNBQAgCgAAlQYAIAsAAJYGACAOAACUBgAgDwAAlwYAIBAAAJgGACARAACZBgAgtAIAAOgDACDMAgAA6AMAIM0CAADoAwAgzgIAAOgDACDPAgAA6AMAIAIMAACcBAAghwIAAOgDACAEAwAAmgYAIAUAAJ0GACAKAACVBgAgCwAAlgYAIAsEAACLBQAgBgAAjAUAIAcAAI0FACCIAgAA6AMAIKYCAADoAwAgrwIAAOgDACCwAgAA6AMAILECAADoAwAgsgIAAOgDACCzAgAA6AMAILQCAADoAwAgCe0BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABA-0BAQAAAAHvAQEAAAAB8AFAAAAAAQvtAQEAAAAB8AFAAAAAAYACAAAAoQICggJAAAAAAYoCAQAAAAGeAgEAAAABnwIIAAAAAaICAAAAogIDowIBAAAAAaQCAQAAAAGlAgEAAAABAu0BAQAAAAG2AgEAAAABBe0BAQAAAAHwAUAAAAABlwIBAAAAAbYCAQAAAAG7AgEAAAABB-0BAQAAAAHvAQEAAAAB8AFAAAAAAYICQAAAAAG4AgAAALgCArkCQAAAAAG6AkAAAAABB-0BAQAAAAHwAUAAAAABggJAAAAAAboCQAAAAAHHAgEAAAAByAIBAAAAAckCAQAAAAEM7QEBAAAAAfABQAAAAAGCAkAAAAABvgIBAAAAAb8CAQAAAAHAAgEAAAABwQIBAAAAAcICAQAAAAHDAkAAAAABxAJAAAAAAcUCAQAAAAHGAgEAAAABFgQAAIsGACAGAACMBgAgBwAAkQYAIAoAAI4GACALAACPBgAgDgAAjQYAIA8AAJAGACARAACTBgAg7QEBAAAAAfABQAAAAAGAAgAAANMCAoICQAAAAAGFAgEAAAABtAJAAAAAAbUCIAAAAAHKAgEAAAABywIgAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CQAAAAAHRAgAAANECAgIAAAABACAeAACmBgAgAwAAAD8AIB4AAKYGACAfAACqBgAgGAAAAD8AIAQAAK8FACAGAACwBQAgBwAAtQUAIAoAALIFACALAACzBQAgDgAAsQUAIA8AALQFACARAAC3BQAgFwAAqgYAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIhYEAACvBQAgBgAAsAUAIAcAALUFACAKAACyBQAgCwAAswUAIA4AALEFACAPAAC0BQAgEQAAtwUAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIhYEAACLBgAgBgAAjAYAIAcAAJEGACAKAACOBgAgCwAAjwYAIA4AAI0GACAPAACQBgAgEAAAkgYAIO0BAQAAAAHwAUAAAAABgAIAAADTAgKCAkAAAAABhQIBAAAAAbQCQAAAAAG1AiAAAAABygIBAAAAAcsCIAAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB0QIAAADRAgICAAAAAQAgHgAAqwYAIAMAAAA_ACAeAACrBgAgHwAArwYAIBgAAAA_ACAEAACvBQAgBgAAsAUAIAcAALUFACAKAACyBQAgCwAAswUAIA4AALEFACAPAAC0BQAgEAAAtgUAIBcAAK8GACDtAQEA4gMAIfABQADjAwAhgAIAAK4F0wIiggJAAOMDACGFAgEA4gMAIbQCQADsAwAhtQIgAO4DACHKAgEA4gMAIcsCIADuAwAhzAIBAP8DACHNAgEA_wMAIc4CAQD_AwAhzwJAAOwDACHRAgAArQXRAiIWBAAArwUAIAYAALAFACAHAAC1BQAgCgAAsgUAIAsAALMFACAOAACxBQAgDwAAtAUAIBAAALYFACDtAQEA4gMAIfABQADjAwAhgAIAAK4F0wIiggJAAOMDACGFAgEA4gMAIbQCQADsAwAhtQIgAO4DACHKAgEA4gMAIcsCIADuAwAhzAIBAP8DACHNAgEA_wMAIc4CAQD_AwAhzwJAAOwDACHRAgAArQXRAiINAwAAxQQAIAUAAMYEACAKAADHBAAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABAgAAAAUAIB4AALAGACADAAAAAwAgHgAAsAYAIB8AALQGACAPAAAAAwAgAwAApAQAIAUAAKUEACAKAACmBAAgFwAAtAYAIO0BAQDiAwAh7gEBAOIDACHvAQEA4gMAIfABQADjAwAhgAIAAKMEmwIilQICAI0EACGWAgEA4gMAIZcCAQDiAwAhmAIAAKIEACCZAiAA7gMAIQ0DAACkBAAgBQAApQQAIAoAAKYEACDtAQEA4gMAIe4BAQDiAwAh7wEBAOIDACHwAUAA4wMAIYACAACjBJsCIpUCAgCNBAAhlgIBAOIDACGXAgEA4gMAIZgCAACiBAAgmQIgAO4DACEXBAAAiAUAIAYAAIkFACDtAQEAAAAB8AFAAAAAAYICQAAAAAGHAgEAAAABiAIIAAAAAZYCAQAAAAGmAgEAAAABpwIAAIUFACCoAgIAAAABqQIBAAAAAaoCAACGBQAgqwIBAAAAAawCAACHBQAgrgIAAACuAgKvAgEAAAABsAIBAAAAAbECAQAAAAGyAgIAAAABswIIAAAAAbQCQAAAAAG1AiAAAAABAgAAANwBACAeAAC1BgAgAwAAAN8BACAeAAC1BgAgHwAAuQYAIBkAAADfAQAgBAAA2wQAIAYAANwEACAXAAC5BgAg7QEBAOIDACHwAUAA4wMAIYICQADjAwAhhwIBAOIDACGIAggA2QQAIZYCAQDiAwAhpgIBAP8DACGnAgAA1QQAIKgCAgCNBAAhqQIBAOIDACGqAgAA1gQAIKsCAQDiAwAhrAIAANcEACCuAgAA2ASuAiKvAgEA_wMAIbACAQD_AwAhsQIBAP8DACGyAgIA2gQAIbMCCADZBAAhtAJAAOwDACG1AiAA7gMAIRcEAADbBAAgBgAA3AQAIO0BAQDiAwAh8AFAAOMDACGCAkAA4wMAIYcCAQDiAwAhiAIIANkEACGWAgEA4gMAIaYCAQD_AwAhpwIAANUEACCoAgIAjQQAIakCAQDiAwAhqgIAANYEACCrAgEA4gMAIawCAADXBAAgrgIAANgErgIirwIBAP8DACGwAgEA_wMAIbECAQD_AwAhsgICANoEACGzAggA2QQAIbQCQADsAwAhtQIgAO4DACENAwAAxQQAIAUAAMYEACALAADIBAAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAYACAAAAmwIClQICAAAAAZYCAQAAAAGXAgEAAAABmAIAAMQEACCZAiAAAAABAgAAAAUAIB4AALoGACADAAAAAwAgHgAAugYAIB8AAL4GACAPAAAAAwAgAwAApAQAIAUAAKUEACALAACnBAAgFwAAvgYAIO0BAQDiAwAh7gEBAOIDACHvAQEA4gMAIfABQADjAwAhgAIAAKMEmwIilQICAI0EACGWAgEA4gMAIZcCAQDiAwAhmAIAAKIEACCZAiAA7gMAIQ0DAACkBAAgBQAApQQAIAsAAKcEACDtAQEA4gMAIe4BAQDiAwAh7wEBAOIDACHwAUAA4wMAIYACAACjBJsCIpUCAgCNBAAhlgIBAOIDACGXAgEA4gMAIZgCAACiBAAgmQIgAO4DACEJ7QEBAAAAAe4BAQAAAAHwAUAAAAABgAIAAACbAgKVAgIAAAABlgIBAAAAAZcCAQAAAAGYAgAAxAQAIJkCIAAAAAED7QEBAAAAAe4BAQAAAAHwAUAAAAABFgQAAIsGACAGAACMBgAgCgAAjgYAIAsAAI8GACAOAACNBgAgDwAAkAYAIBAAAJIGACARAACTBgAg7QEBAAAAAfABQAAAAAGAAgAAANMCAoICQAAAAAGFAgEAAAABtAJAAAAAAbUCIAAAAAHKAgEAAAABywIgAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CQAAAAAHRAgAAANECAgIAAAABACAeAADBBgAgAwAAAD8AIB4AAMEGACAfAADFBgAgGAAAAD8AIAQAAK8FACAGAACwBQAgCgAAsgUAIAsAALMFACAOAACxBQAgDwAAtAUAIBAAALYFACARAAC3BQAgFwAAxQYAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIhYEAACvBQAgBgAAsAUAIAoAALIFACALAACzBQAgDgAAsQUAIA8AALQFACAQAAC2BQAgEQAAtwUAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIgftAQEAAAAB7gEBAAAAAfABQAAAAAGCAkAAAAABuAIAAAC4AgK5AkAAAAABugJAAAAAAQwDAACEBAAgDQAAhQQAIO0BAQAAAAHuAQEAAAAB8AFAAAAAAfwBAQAAAAH9AUAAAAAB_gFAAAAAAYACAAAAgAICgQIgAAAAAYICQAAAAAGDAkAAAAABAgAAACUAIB4AAMcGACADAAAAIgAgHgAAxwYAIB8AAMsGACAOAAAAIgAgAwAA7wMAIA0AAPADACAXAADLBgAg7QEBAOIDACHuAQEA4gMAIfABQADjAwAh_AEBAOIDACH9AUAA4wMAIf4BQADsAwAhgAIAAO0DgAIigQIgAO4DACGCAkAA4wMAIYMCQADsAwAhDAMAAO8DACANAADwAwAg7QEBAOIDACHuAQEA4gMAIfABQADjAwAh_AEBAOIDACH9AUAA4wMAIf4BQADsAwAhgAIAAO0DgAIigQIgAO4DACGCAkAA4wMAIYMCQADsAwAhFwYAAIkFACAHAACKBQAg7QEBAAAAAfABQAAAAAGCAkAAAAABhwIBAAAAAYgCCAAAAAGWAgEAAAABpgIBAAAAAacCAACFBQAgqAICAAAAAakCAQAAAAGqAgAAhgUAIKsCAQAAAAGsAgAAhwUAIK4CAAAArgICrwIBAAAAAbACAQAAAAGxAgEAAAABsgICAAAAAbMCCAAAAAG0AkAAAAABtQIgAAAAAQIAAADcAQAgHgAAzAYAIBYGAACMBgAgBwAAkQYAIAoAAI4GACALAACPBgAgDgAAjQYAIA8AAJAGACAQAACSBgAgEQAAkwYAIO0BAQAAAAHwAUAAAAABgAIAAADTAgKCAkAAAAABhQIBAAAAAbQCQAAAAAG1AiAAAAABygIBAAAAAcsCIAAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB0QIAAADRAgICAAAAAQAgHgAAzgYAIBYEAACLBgAgBgAAjAYAIAcAAJEGACALAACPBgAgDgAAjQYAIA8AAJAGACAQAACSBgAgEQAAkwYAIO0BAQAAAAHwAUAAAAABgAIAAADTAgKCAkAAAAABhQIBAAAAAbQCQAAAAAG1AiAAAAABygIBAAAAAcsCIAAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB0QIAAADRAgICAAAAAQAgHgAA0AYAIAMAAAA_ACAeAADQBgAgHwAA1AYAIBgAAAA_ACAEAACvBQAgBgAAsAUAIAcAALUFACALAACzBQAgDgAAsQUAIA8AALQFACAQAAC2BQAgEQAAtwUAIBcAANQGACDtAQEA4gMAIfABQADjAwAhgAIAAK4F0wIiggJAAOMDACGFAgEA4gMAIbQCQADsAwAhtQIgAO4DACHKAgEA4gMAIcsCIADuAwAhzAIBAP8DACHNAgEA_wMAIc4CAQD_AwAhzwJAAOwDACHRAgAArQXRAiIWBAAArwUAIAYAALAFACAHAAC1BQAgCwAAswUAIA4AALEFACAPAAC0BQAgEAAAtgUAIBEAALcFACDtAQEA4gMAIfABQADjAwAhgAIAAK4F0wIiggJAAOMDACGFAgEA4gMAIbQCQADsAwAhtQIgAO4DACHKAgEA4gMAIcsCIADuAwAhzAIBAP8DACHNAgEA_wMAIc4CAQD_AwAhzwJAAOwDACHRAgAArQXRAiIC7QEBAAAAAe4BAQAAAAEWBAAAiwYAIAYAAIwGACAHAACRBgAgCgAAjgYAIA4AAI0GACAPAACQBgAgEAAAkgYAIBEAAJMGACDtAQEAAAAB8AFAAAAAAYACAAAA0wICggJAAAAAAYUCAQAAAAG0AkAAAAABtQIgAAAAAcoCAQAAAAHLAiAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAdECAAAA0QICAgAAAAEAIB4AANYGACADAAAAPwAgHgAA1gYAIB8AANoGACAYAAAAPwAgBAAArwUAIAYAALAFACAHAAC1BQAgCgAAsgUAIA4AALEFACAPAAC0BQAgEAAAtgUAIBEAALcFACAXAADaBgAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiFgQAAK8FACAGAACwBQAgBwAAtQUAIAoAALIFACAOAACxBQAgDwAAtAUAIBAAALYFACARAAC3BQAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiBe0BAQAAAAHuAQEAAAAB8AFAAAAAAZcCAQAAAAG7AgEAAAABAwAAAN8BACAeAADMBgAgHwAA3gYAIBkAAADfAQAgBgAA3AQAIAcAAN0EACAXAADeBgAg7QEBAOIDACHwAUAA4wMAIYICQADjAwAhhwIBAOIDACGIAggA2QQAIZYCAQDiAwAhpgIBAP8DACGnAgAA1QQAIKgCAgCNBAAhqQIBAOIDACGqAgAA1gQAIKsCAQDiAwAhrAIAANcEACCuAgAA2ASuAiKvAgEA_wMAIbACAQD_AwAhsQIBAP8DACGyAgIA2gQAIbMCCADZBAAhtAJAAOwDACG1AiAA7gMAIRcGAADcBAAgBwAA3QQAIO0BAQDiAwAh8AFAAOMDACGCAkAA4wMAIYcCAQDiAwAhiAIIANkEACGWAgEA4gMAIaYCAQD_AwAhpwIAANUEACCoAgIAjQQAIakCAQDiAwAhqgIAANYEACCrAgEA4gMAIawCAADXBAAgrgIAANgErgIirwIBAP8DACGwAgEA_wMAIbECAQD_AwAhsgICANoEACGzAggA2QQAIbQCQADsAwAhtQIgAO4DACEDAAAAPwAgHgAAzgYAIB8AAOEGACAYAAAAPwAgBgAAsAUAIAcAALUFACAKAACyBQAgCwAAswUAIA4AALEFACAPAAC0BQAgEAAAtgUAIBEAALcFACAXAADhBgAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiFgYAALAFACAHAAC1BQAgCgAAsgUAIAsAALMFACAOAACxBQAgDwAAtAUAIBAAALYFACARAAC3BQAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiCe0BAQAAAAHuAQEAAAAB8AFAAAAAAf0BQAAAAAH-AUAAAAABgAIAAACAAgKBAiAAAAABggJAAAAAAYMCQAAAAAEK7QEBAAAAAfABQAAAAAGCAkAAAAABhQIAAACFAgKGAgEAAAABhwIBAAAAAYgCCAAAAAGJAgIAAAABigIBAAAAAYsCgAAAAAECAAAAowIAIB4AAOMGACAWBAAAiwYAIAYAAIwGACAHAACRBgAgCgAAjgYAIAsAAI8GACAOAACNBgAgEAAAkgYAIBEAAJMGACDtAQEAAAAB8AFAAAAAAYACAAAA0wICggJAAAAAAYUCAQAAAAG0AkAAAAABtQIgAAAAAcoCAQAAAAHLAiAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAdECAAAA0QICAgAAAAEAIB4AAOUGACAWBAAAiwYAIAYAAIwGACAHAACRBgAgCgAAjgYAIAsAAI8GACAPAACQBgAgEAAAkgYAIBEAAJMGACDtAQEAAAAB8AFAAAAAAYACAAAA0wICggJAAAAAAYUCAQAAAAG0AkAAAAABtQIgAAAAAcoCAQAAAAHLAiAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAdECAAAA0QICAgAAAAEAIB4AAOcGACADAAAAPwAgHgAA5wYAIB8AAOsGACAYAAAAPwAgBAAArwUAIAYAALAFACAHAAC1BQAgCgAAsgUAIAsAALMFACAPAAC0BQAgEAAAtgUAIBEAALcFACAXAADrBgAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiFgQAAK8FACAGAACwBQAgBwAAtQUAIAoAALIFACALAACzBQAgDwAAtAUAIBAAALYFACARAAC3BQAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiC-0BAQAAAAHuAQEAAAAB8AFAAAAAAYACAAAAoQICggJAAAAAAYoCAQAAAAGfAggAAAABogIAAACiAgOjAgEAAAABpAIBAAAAAaUCAQAAAAEDAAAApgIAIB4AAOMGACAfAADvBgAgDAAAAKYCACAXAADvBgAg7QEBAOIDACHwAUAA4wMAIYICQADjAwAhhQIAAIwEhQIihgIBAOIDACGHAgEA_wMAIYgCCAD8AwAhiQICAI0EACGKAgEA4gMAIYsCgAAAAAEK7QEBAOIDACHwAUAA4wMAIYICQADjAwAhhQIAAIwEhQIihgIBAOIDACGHAgEA_wMAIYgCCAD8AwAhiQICAI0EACGKAgEA4gMAIYsCgAAAAAEDAAAAPwAgHgAA5QYAIB8AAPIGACAYAAAAPwAgBAAArwUAIAYAALAFACAHAAC1BQAgCgAAsgUAIAsAALMFACAOAACxBQAgEAAAtgUAIBEAALcFACAXAADyBgAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiFgQAAK8FACAGAACwBQAgBwAAtQUAIAoAALIFACALAACzBQAgDgAAsQUAIBAAALYFACARAAC3BQAg7QEBAOIDACHwAUAA4wMAIYACAACuBdMCIoICQADjAwAhhQIBAOIDACG0AkAA7AMAIbUCIADuAwAhygIBAOIDACHLAiAA7gMAIcwCAQD_AwAhzQIBAP8DACHOAgEA_wMAIc8CQADsAwAh0QIAAK0F0QIiFwQAAIgFACAHAACKBQAg7QEBAAAAAfABQAAAAAGCAkAAAAABhwIBAAAAAYgCCAAAAAGWAgEAAAABpgIBAAAAAacCAACFBQAgqAICAAAAAakCAQAAAAGqAgAAhgUAIKsCAQAAAAGsAgAAhwUAIK4CAAAArgICrwIBAAAAAbACAQAAAAGxAgEAAAABsgICAAAAAbMCCAAAAAG0AkAAAAABtQIgAAAAAQIAAADcAQAgHgAA8wYAIBYEAACLBgAgBwAAkQYAIAoAAI4GACALAACPBgAgDgAAjQYAIA8AAJAGACAQAACSBgAgEQAAkwYAIO0BAQAAAAHwAUAAAAABgAIAAADTAgKCAkAAAAABhQIBAAAAAbQCQAAAAAG1AiAAAAABygIBAAAAAcsCIAAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB0QIAAADRAgICAAAAAQAgHgAA9QYAIAMAAADfAQAgHgAA8wYAIB8AAPkGACAZAAAA3wEAIAQAANsEACAHAADdBAAgFwAA-QYAIO0BAQDiAwAh8AFAAOMDACGCAkAA4wMAIYcCAQDiAwAhiAIIANkEACGWAgEA4gMAIaYCAQD_AwAhpwIAANUEACCoAgIAjQQAIakCAQDiAwAhqgIAANYEACCrAgEA4gMAIawCAADXBAAgrgIAANgErgIirwIBAP8DACGwAgEA_wMAIbECAQD_AwAhsgICANoEACGzAggA2QQAIbQCQADsAwAhtQIgAO4DACEXBAAA2wQAIAcAAN0EACDtAQEA4gMAIfABQADjAwAhggJAAOMDACGHAgEA4gMAIYgCCADZBAAhlgIBAOIDACGmAgEA_wMAIacCAADVBAAgqAICAI0EACGpAgEA4gMAIaoCAADWBAAgqwIBAOIDACGsAgAA1wQAIK4CAADYBK4CIq8CAQD_AwAhsAIBAP8DACGxAgEA_wMAIbICAgDaBAAhswIIANkEACG0AkAA7AMAIbUCIADuAwAhAwAAAD8AIB4AAPUGACAfAAD8BgAgGAAAAD8AIAQAAK8FACAHAAC1BQAgCgAAsgUAIAsAALMFACAOAACxBQAgDwAAtAUAIBAAALYFACARAAC3BQAgFwAA_AYAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIhYEAACvBQAgBwAAtQUAIAoAALIFACALAACzBQAgDgAAsQUAIA8AALQFACAQAAC2BQAgEQAAtwUAIO0BAQDiAwAh8AFAAOMDACGAAgAArgXTAiKCAkAA4wMAIYUCAQDiAwAhtAJAAOwDACG1AiAA7gMAIcoCAQDiAwAhywIgAO4DACHMAgEA_wMAIc0CAQD_AwAhzgIBAP8DACHPAkAA7AMAIdECAACtBdECIgoEBgIGHQQHLQUIABEKKgcLKwgOIQoPLAsQMQ8RNRAFAwABBQADCAAJChYHCxoIBAQHAgYLBAcPBQgABgIDAAEFAAMCAwABBQADAwQQAAYRAAcSAAIDAAEJAAICAwABCQACAgobAAscAAIDAAEPIwsEAwABCAAODQAMDigKAggADQwmCwEMJwABDikAAQMAAQEDAAEIBDYABjcABzsACjkACzoADjgAEDwAET0AAAAAAwgAFiQAFyUAGAAAAAMIABYkABclABgBAwABAQMAAQMIAB0kAB4lAB8AAAADCAAdJAAeJQAfAQMAAQEDAAEDCAAkJAAlJQAmAAAAAwgAJCQAJSUAJgAAAAMIACwkAC0lAC4AAAADCAAsJAAtJQAuAgMAAQkAAgIDAAEJAAIDCAAzJAA0JQA1AAAAAwgAMyQANCUANQIDAAEFAAMCAwABBQADAwgAOiQAOyUAPAAAAAMIADokADslADwCAwABCQACAgMAAQkAAgMIAEEkAEIlAEMAAAADCABBJABCJQBDAAAFCABIJABLJQBMlgEASZcBAEoAAAAAAAUIAEgkAEslAEyWAQBJlwEASgIDAAEP_wELAgMAAQ-FAgsFCABRJABUJQBVlgEAUpcBAFMAAAAAAAUIAFEkAFQlAFWWAQBSlwEAUwIDAAEFAAMCAwABBQADBQgAWiQAXSUAXpYBAFuXAQBcAAAAAAAFCABaJABdJQBelgEAW5cBAFwAAAUIAGMkAGYlAGeWAQBklwEAZQAAAAAABQgAYyQAZiUAZ5YBAGSXAQBlAgMAAQ0ADAIDAAENAAwDCABsJABtJQBuAAAAAwgAbCQAbSUAbgIDAAEFAAMCAwABBQADAwgAcyQAdCUAdQAAAAMIAHMkAHQlAHUSAgETPgEUQQEVQgEWQwEYRQEZRxIaSBMbSgEcTBIdTRQgTgEhTwEiUBImUxUnVBkoVQ8pVg8qVw8rWA8sWQ8tWw8uXRIvXhowYA8xYhIyYxszZA80ZQ81ZhI2aRw3aiA4axA5bBA6bRA7bhA8bxA9cRA-cxI_dCFAdhBBeBJCeSJDehBEexBFfBJGfyNHgAEnSIIBKEmDAShKhgEoS4cBKEyIAShNigEoTowBEk-NASlQjwEoUZEBElKSASpTkwEoVJQBKFWVARJWmAErV5kBL1iaAQhZmwEIWpwBCFudAQhcngEIXaABCF6iARJfowEwYKUBCGGnARJiqAExY6kBCGSqAQhlqwESZq4BMmevATZosAEFabEBBWqyAQVrswEFbLQBBW22AQVuuAESb7kBN3C7AQVxvQEScr4BOHO_AQV0wAEFdcEBEnbEATl3xQE9eMYBB3nHAQd6yAEHe8kBB3zKAQd9zAEHfs4BEn_PAT6AAdEBB4EB0wESggHUAT-DAdUBB4QB1gEHhQHXARKGAdoBQIcB2wFEiAHdAQOJAd4BA4oB4QEDiwHiAQOMAeMBA40B5QEDjgHnARKPAegBRZAB6gEDkQHsARKSAe0BRpMB7gEDlAHvAQOVAfABEpgB8wFHmQH0AU2aAfUBCpsB9gEKnAH3AQqdAfgBCp4B-QEKnwH7AQqgAf0BEqEB_gFOogGBAgqjAYMCEqQBhAJPpQGGAgqmAYcCCqcBiAISqAGLAlCpAYwCVqoBjQICqwGOAgKsAY8CAq0BkAICrgGRAgKvAZMCArABlQISsQGWAleyAZgCArMBmgIStAGbAli1AZwCArYBnQICtwGeAhK4AaECWbkBogJfugGkAgy7AaUCDLwBqAIMvQGpAgy-AaoCDL8BrAIMwAGuAhLBAa8CYMIBsQIMwwGzAhLEAbQCYcUBtQIMxgG2AgzHAbcCEsgBugJiyQG7AmjKAbwCC8sBvQILzAG-AgvNAb8CC84BwAILzwHCAgvQAcQCEtEBxQJp0gHHAgvTAckCEtQBygJq1QHLAgvWAcwCC9cBzQIS2AHQAmvZAdECb9oB0gIE2wHTAgTcAdQCBN0B1QIE3gHWAgTfAdgCBOAB2gIS4QHbAnDiAd0CBOMB3wIS5AHgAnHlAeECBOYB4gIE5wHjAhLoAeYCcukB5wJ2"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var Role = {
  USER: "USER",
  ADMIN: "ADMIN"
};
var ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
  BLOCKED: "BLOCKED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};
var SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PAUSED: "PAUSED"
};
var SubscriptionTierName = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PREMIUM: "PREMIUM",
  VIP: "VIP"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = env.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import { oAuthProxy } from "better-auth/plugins";
import bcrypt from "bcryptjs";
var auth = betterAuth({
  baseURL: process.env.FRONTEND_URL,
  trustedOrigins: [process.env.FRONTEND_URL],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        return hashed.replace("$2b$", "$2a$");
      },
      verify: async ({ hash, password }) => {
        const normalizedHash = hash.replace("$2b$", "$2a$");
        return bcrypt.compare(password, normalizedHash);
      }
    }
    // Note: Password reset is handled manually in auth.service.ts
    // to avoid Better Auth's API limitations
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  account: { skipStateCookieCheck: true },
  // solved redirect issue
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          partitioned: process.env.NODE_ENV === "production"
        }
      },
      state: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          partitioned: process.env.NODE_ENV === "production"
        }
      }
    }
  },
  plugins: [oAuthProxy()]
});

// src/app/lib/email.ts
import nodemailer from "nodemailer";
var EmailService = class {
  transporter = null;
  constructor() {
    this.initializeTransporter();
  }
  initializeTransporter() {
    if (env.SMTP_ENV === "production") {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: env.SMTP_SECURE === "true",
        // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: env.ETHEREAL_USER || "test@ethereal.email",
          pass: env.ETHEREAL_PASS || "test-password"
        }
      });
    }
  }
  async sendEmail(params) {
    try {
      if (!this.transporter) {
        console.error("Email transporter not initialized");
        return false;
      }
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html
      });
      console.log("Email sent:", info.response);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
  generateVerificationEmailTemplate(params) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8f9fa; }
            .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CineTube!</h1>
            </div>
            <div class="content">
              <p>Hi ${params.name},</p>
              <p>Thank you for registering with CineTube. Please verify your email address to activate your account.</p>
              <a href="${params.verificationLink}" class="button">Verify Email</a>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This link expires in 24 hours. If you didn't create this account, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 CineTube. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  generatePasswordResetTemplate(params) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - CineTube</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f5f5f5;
              line-height: 1.6;
              color: #333;
            }
            
            .email-wrapper {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            }
            
            .header {
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              padding: 48px 40px;
              text-align: center;
            }
            
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header .subtitle {
              color: #a0a0a0;
              font-size: 14px;
              margin-top: 8px;
              font-weight: 400;
            }
            
            .content {
              padding: 48px 40px;
              background: #ffffff;
            }
            
            .greeting {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 16px;
            }
            
            .message {
              font-size: 15px;
              color: #555;
              line-height: 1.8;
              margin-bottom: 32px;
            }
            
            .button-container {
              text-align: center;
              margin: 32px 0;
            }
            
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
              color: #ffffff !important;
              font-size: 16px;
              font-weight: 600;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 8px;
              box-shadow: 0 4px 16px rgba(229, 9, 20, 0.3);
              transition: all 0.3s ease;
            }
            
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
            }
            
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
              margin: 32px 0;
            }
            
            .security-notice {
              background: #f8f9fa;
              border-left: 4px solid #e50914;
              padding: 20px 24px;
              border-radius: 0 8px 8px 0;
              margin-top: 24px;
            }
            
            .security-notice h4 {
              font-size: 14px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 8px;
            }
            
            .security-notice p {
              font-size: 13px;
              color: #666;
              margin: 0;
            }
            
            .expiry-warning {
              text-align: center;
              font-size: 13px;
              color: #888;
              margin-top: 24px;
              padding: 16px;
              background: #fafafa;
              border-radius: 6px;
            }
            
            .footer {
              background: #1a1a2e;
              padding: 32px 40px;
              text-align: center;
            }
            
            .footer-brand {
              color: #ffffff;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .footer-copy {
              color: #888;
              font-size: 12px;
            }
            
            .social-links {
              margin-top: 20px;
            }
            
            .social-links a {
              display: inline-block;
              margin: 0 12px;
              color: #888;
              text-decoration: none;
              font-size: 12px;
            }
            
            @media (max-width: 600px) {
              .email-wrapper { margin: 0; border-radius: 0; }
              .header, .content, .footer { padding: 32px 24px; }
              .header h1 { font-size: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>Password Reset</h1>
              <p class="subtitle">CineTube Security</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${params.name},</p>
              <p class="message">
                We received a request to reset the password for your CineTube account. 
                To proceed, please click the button below. This secure link will take you 
                to our password reset page where you can create a new password.
              </p>
              
              <div class="button-container">
                <a href="${params.resetLink}" class="button">Reset My Password</a>
              </div>
              
              <div class="divider"></div>
              
              <p class="expiry-warning">
                <strong>\u23F1 This link expires in 1 hour</strong><br>
                For security reasons, this password reset link will expire shortly. 
                If you need a new link, please visit the login page and request another reset.
              </p>
              
              <div class="security-notice">
                <h4>\u{1F512} Didn't request this reset?</h4>
                <p>
                  If you didn't make this request, your account is still secure. 
                  No changes have been made to your password. You can safely ignore this email.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-brand">CineTube</p>
              <p class="footer-copy">\xA9 2026 CineTube. All rights reserved.</p>
              <div class="social-links">
                <a href="#">Support</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  generatePaymentReceiptTemplate(params) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt - CineTube</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
              line-height: 1.6;
              color: #e0e0e0;
              min-height: 100vh;
            }
            
            .email-wrapper {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(180deg, #1e1e2e 0%, #252538 100%);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(229, 9, 20, 0.2);
            }
            
            .header {
              background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
              padding: 40px;
              text-align: center;
              position: relative;
            }
            
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            }
            
            .header-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header .subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              margin-top: 8px;
              font-weight: 500;
            }
            
            .content {
              padding: 40px;
            }
            
            .greeting {
              font-size: 18px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 12px;
            }
            
            .message {
              font-size: 15px;
              color: #a0a0b0;
              line-height: 1.8;
              margin-bottom: 28px;
            }
            
            .receipt-box {
              background: linear-gradient(180deg, #2a2a3e 0%, #32324a 100%);
              border-radius: 12px;
              padding: 28px;
              margin-bottom: 24px;
              border: 1px solid rgba(229, 9, 20, 0.15);
            }
            
            .receipt-title {
              font-size: 18px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .receipt-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            
            .receipt-row:last-child {
              border-bottom: none;
            }
            
            .receipt-row.total {
              background: rgba(229, 9, 20, 0.1);
              margin: 0 -12px;
              padding: 16px 12px;
              border-radius: 8px;
              border: 1px solid rgba(229, 9, 20, 0.2);
            }
            
            .receipt-label {
              font-size: 14px;
              color: #a0a0b0;
              font-weight: 500;
            }
            
            .receipt-value {
              font-size: 14px;
              color: #ffffff;
              font-weight: 500;
              text-align: right;
            }
            
            .receipt-row.total .receipt-label,
            .receipt-row.total .receipt-value {
              font-size: 16px;
              font-weight: 700;
              color: #ffffff;
            }
            
            .amount-highlight {
              color: #4ade80;
              font-weight: 700;
            }
            
            .transaction-id {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #808090;
              word-break: break-all;
              background: rgba(0, 0, 0, 0.3);
              padding: 8px 12px;
              border-radius: 6px;
              margin-top: 4px;
            }
            
            .benefits {
              background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0.05) 100%);
              border: 1px solid rgba(229, 9, 20, 0.2);
              border-radius: 10px;
              padding: 20px;
              margin-top: 24px;
            }
            
            .benefits-title {
              font-size: 14px;
              font-weight: 600;
              color: #e50914;
              margin-bottom: 12px;
            }
            
            .benefits-list {
              list-style: none;
              font-size: 14px;
              color: #c0c0d0;
            }
            
            .benefits-list li {
              padding: 4px 0;
              padding-left: 20px;
              position: relative;
            }
            
            .benefits-list li::before {
              content: '\u2713';
              position: absolute;
              left: 0;
              color: #4ade80;
              font-weight: 700;
            }
            
            .footer {
              background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
              padding: 32px 40px;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .footer-brand {
              font-size: 20px;
              font-weight: 700;
              color: #e50914;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .footer-copy {
              font-size: 12px;
              color: #606070;
              margin-bottom: 16px;
            }
            
            .social-links {
              display: flex;
              justify-content: center;
              gap: 20px;
            }
            
            .social-links a {
              color: #808090;
              text-decoration: none;
              font-size: 12px;
              transition: color 0.2s;
            }
            
            .social-links a:hover {
              color: #e50914;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="header-icon">\u{1F3AC}</div>
              <h1>Payment Successful!</h1>
              <p class="subtitle">Welcome to Premium Streaming</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${params.name},</p>
              <p class="message">Thank you for your payment! Your ${params.subscriptionTier} subscription has been activated. Get ready to enjoy unlimited premium content.</p>
              
              <div class="receipt-box">
                <div class="receipt-title">\u{1F4C4} Receipt Details</div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Plan</span>
                  <span class="receipt-value">${params.subscriptionTier}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Billing Period</span>
                  <span class="receipt-value">${params.billingDate}</span>
                </div>
                
                <div class="receipt-row total">
                  <span class="receipt-label">Total Paid</span>
                  <span class="receipt-value amount-highlight">${params.currency} ${params.amount.toFixed(2)}</span>
                </div>
                
                <div class="receipt-row" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <span class="receipt-label">Transaction ID</span>
                  <span class="receipt-value">
                    <div class="transaction-id">${params.transactionId}</div>
                  </span>
                </div>
              </div>
              
              <div class="benefits">
                <div class="benefits-title">\u2728 Your Premium Benefits</div>
                <ul class="benefits-list">
                  <li>Ad-free streaming experience</li>
                  <li>HD & 4K quality content</li>
                  <li>Download for offline viewing</li>
                  <li>Multiple device access</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-brand">CineTube</p>
              <p class="footer-copy">\xA9 2026 CineTube. All rights reserved.</p>
              <div class="social-links">
                <a href="#">Support</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  async sendVerificationEmail(params) {
    const html = this.generateVerificationEmailTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Verify Your CineTube Email",
      html
    });
  }
  async sendPasswordResetEmail(params) {
    const html = this.generatePasswordResetTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Reset Your CineTube Password",
      html
    });
  }
  async sendPaymentReceipt(params) {
    const html = this.generatePaymentReceiptTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Payment Receipt - CineTube",
      html
    });
  }
};
var emailService = new EmailService();

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var jwtUtils = class {
  /**
   * Generate JWT token
   */
  static generateToken(payload, secret, expiresIn = "15m") {
    return jwt.sign(payload, secret, { expiresIn });
  }
  /**
   * Verify JWT token
   */
  static verifyToken(token, secret) {
    try {
      const decoded = jwt.verify(token, secret);
      return {
        success: true,
        data: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Token verification failed"
      };
    }
  }
  /**
   * Decode token without verification
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
  /**
   * Generate access and refresh tokens
   */
  static generateTokenPair(payload, accessTokenSecret, refreshTokenSecret) {
    return {
      accessToken: this.generateToken(payload, accessTokenSecret, "15m"),
      refreshToken: this.generateToken(payload, refreshTokenSecret, "7d")
    };
  }
};

// src/app/module/auth/auth.service.ts
var register = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Failed to register user");
  }
  try {
    const verificationLink = `${env.FRONTEND_URL}/verify-email`;
    await emailService.sendVerificationEmail({
      email: data.user.email,
      name: data.user.name || "User",
      verificationLink
    });
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name
      },
      message: "Registration successful. Please check your email to verify your account."
    };
  } catch (err) {
    console.log("Transaction error", err);
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    });
    throw err;
  }
};
var logIn = async (payload, expressRes) => {
  const { email, password } = payload;
  const authResponse = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true
  });
  if (!authResponse.ok) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password");
  }
  const setCookie = authResponse.headers.get("set-cookie");
  if (setCookie) {
    expressRes.setHeader("Set-Cookie", setCookie);
  }
  const authData = await authResponse.json();
  const user = await prisma.user.findUnique({
    where: { id: authData.user.id }
  });
  if (!user) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status2.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "User is deleted");
  }
  const { accessToken, refreshToken: refreshToken2 } = jwtUtils.generateTokenPair(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    env.ACCESS_TOKEN_SECRET,
    env.REFRESH_TOKEN_SECRET
  );
  const latestSession = await prisma.session.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified
    },
    sessionToken: latestSession?.token || null,
    accessToken,
    refreshToken: refreshToken2
  };
};
var refreshToken = async (payload) => {
  const { refreshToken: token } = payload;
  if (!token) {
    throw new AppError_default(
      status2.UNAUTHORIZED,
      "Refresh token is required"
    );
  }
  const verifiedToken = jwtUtils.verifyToken(
    token,
    env.REFRESH_TOKEN_SECRET
  );
  if (!verifiedToken.success || !verifiedToken.data) {
    throw new AppError_default(
      status2.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.data.userId }
  });
  if (!user) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status2.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "User is deleted");
  }
  const newAccessToken = jwtUtils.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    env.ACCESS_TOKEN_SECRET,
    "15m"
  );
  return {
    accessToken: newAccessToken
  };
};
var logout = async () => {
  return {
    message: "Logged out successfully"
  };
};
var forgotPassword = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return { message: "If an account exists, a password reset email has been sent" };
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1e3);
    await prisma.verification.deleteMany({
      where: { identifier: `password-reset-${email}` }
    });
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: `password-reset-${email}`,
        value: hashedToken,
        expiresAt: tokenExpiry
      }
    });
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailSent = await emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name || "User",
      resetLink: resetUrl
    });
    if (!emailSent) {
      console.error(`[forgotPassword] Failed to send email to: ${email}`);
      throw new Error("Failed to send email");
    }
    return { message: "If an account exists, a password reset email has been sent" };
  } catch (error) {
    console.error(`[forgotPassword] Error:`, error);
    return { message: "If an account exists, a password reset email has been sent" };
  }
};
var resetPassword = async (token, newPassword) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const verifications = await prisma.verification.findMany({
      where: {
        identifier: { startsWith: "password-reset-" },
        value: hashedToken
      }
    });
    const verification = verifications[0];
    if (!verification) {
      throw new AppError_default(status2.BAD_REQUEST, "Invalid or expired reset token");
    }
    if (verification.expiresAt < /* @__PURE__ */ new Date()) {
      await prisma.verification.delete({ where: { id: verification.id } });
      throw new AppError_default(status2.BAD_REQUEST, "Reset token has expired. Please request a new one.");
    }
    const email = verification.identifier.replace("password-reset-", "");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError_default(status2.NOT_FOUND, "User not found");
    }
    const bcrypt2 = await import("bcryptjs");
    const salt = bcrypt2.genSaltSync(10);
    let hashedPassword = bcrypt2.hashSync(newPassword, salt);
    if (hashedPassword.startsWith("$2b$")) {
      hashedPassword = hashedPassword.replace("$2b$", "$2a$");
    }
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential"
      }
    });
    if (account) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          password: hashedPassword,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
    } else {
      const newAccountId = crypto.randomUUID();
      await prisma.account.create({
        data: {
          id: newAccountId,
          accountId: email,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: /* @__PURE__ */ new Date() }
    });
    await prisma.verification.delete({ where: { id: verification.id } });
    return { message: "Password reset successfully. Please login with your new password." };
  } catch (error) {
    if (error instanceof AppError_default) throw error;
    console.error("[resetPassword] Error:", error);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to reset password");
  }
};
var verifyEmail = async (email) => {
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true }
  });
  if (!user) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  return {
    message: "Email verified successfully",
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified
    }
  };
};
var AuthService = {
  register,
  logIn,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail
};

// src/app/module/auth/auth.controller.ts
import status3 from "http-status";

// src/app/utils/cookie.ts
var CookieUtils = class {
  /**
   * Get cookie value from request
   */
  static getCookie(req, name) {
    return req.cookies[name];
  }
  /**
   * Set cookie in response
   */
  static setCookie(res, name, value, options) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      ...options
    });
  }
  /**
   * Clear cookie from response
   */
  static clearCookie(res, name) {
    res.clearCookie(name, { path: "/" });
  }
  /**
   * Set multiple cookies
   */
  static setMultipleCookies(res, cookies) {
    cookies.forEach((cookie) => {
      this.setCookie(res, cookie.name, cookie.value, cookie.options);
    });
  }
};

// src/app/module/auth/auth.validation.ts
import { z } from "zod";
var forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email address")
  })
});
var resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must not exceed 128 characters").regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
  })
});

// src/app/module/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.register(payload);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
  });
});
var logIn2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.logIn(payload, res);
  CookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 15 * 60 * 1e3,
    // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  CookieUtils.setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1e3,
    // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: result
  });
});
var refresh = catchAsync(async (req, res) => {
  const refreshToken2 = CookieUtils.getCookie(req, "refreshToken") || req.body.refreshToken;
  if (!refreshToken2) {
    throw new Error("Refresh token is required");
  }
  const result = await AuthService.refreshToken({ refreshToken: refreshToken2 });
  CookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 15 * 60 * 1e3,
    // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result
  });
});
var logout2 = catchAsync(async (req, res) => {
  const result = await AuthService.logout();
  res.clearCookie("session");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const validatedData = forgotPasswordSchema.parse({ body: req.body });
  const result = await AuthService.forgotPassword(validatedData.body.email);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const validatedData = resetPasswordSchema.parse({ body: req.body });
  const result = await AuthService.resetPassword(
    validatedData.body.token,
    validatedData.body.newPassword
  );
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.verifyEmail(email);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: result.message,
    data: result.user
  });
});
var AuthController = {
  register: register2,
  logIn: logIn2,
  refresh,
  logout: logout2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  verifyEmail: verifyEmail2
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var createAuthMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let authenticatedUser = null;
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (session && session.user) {
        const user = session.user;
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED || user.isDeleted) {
          throw new AppError_default(
            status4.UNAUTHORIZED,
            "Unauthorized access! User is not active."
          );
        }
        authenticatedUser = {
          id: user.id,
          role: user.role,
          email: user.email
        };
      }
      if (!authenticatedUser) {
        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (accessToken) {
          const verifiedToken = jwtUtils.verifyToken(
            accessToken,
            env.ACCESS_TOKEN_SECRET
          );
          if (verifiedToken.success && verifiedToken.data) {
            authenticatedUser = {
              id: verifiedToken.data.userId,
              role: verifiedToken.data.role,
              email: verifiedToken.data.email
            };
          }
        }
      }
      if (!authenticatedUser) {
        throw new AppError_default(
          status4.UNAUTHORIZED,
          "Unauthorized access! Please provide a valid session or access token."
        );
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(authenticatedUser.role)) {
        throw new AppError_default(
          status4.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource."
        );
      }
      req.user = authenticatedUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var requireAuth = createAuthMiddleware();
var requireRole = (...roles) => {
  return createAuthMiddleware(...roles);
};
var checkRole = (...roles) => {
  return requireRole(...roles);
};

// src/app/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
var passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 3,
  // 3 attempts per window
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  skip: () => {
    return process.env.NODE_ENV === "test";
  }
});
var strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// src/app/module/auth/auth.route.ts
var router = Router();
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.logIn);
router.post("/refresh", AuthController.refresh);
router.post("/logout", requireAuth, AuthController.logout);
router.post("/forgot-password", passwordResetLimiter, AuthController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);
var AuthRoutes = router;

// src/app/module/movies/movies.route.ts
import { Router as Router2 } from "express";

// src/app/module/movies/movies.service.ts
var generateSlug = (str) => {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
};
var MoviesService = class {
  /**
   * Create a new movie
   */
  async createMovie(data) {
    try {
      const movieSlug = generateSlug(data.title);
      const existingMovie = await prisma.movie.findUnique({
        where: { slug: movieSlug }
      });
      if (existingMovie) {
        throw new AppError_default(400, "A movie with this title already exists");
      }
      const movie = await prisma.movie.create({
        data: {
          title: data.title,
          description: data.description,
          genre: data.genre,
          releaseYear: data.releaseYear,
          director: data.director,
          cast: data.cast || [],
          posterUrl: data.posterUrl,
          trailerUrl: data.trailerUrl,
          duration: data.duration,
          language: data.language || ["English"],
          pricing: data.pricing || "PREMIUM",
          price: data.price,
          youtubeLink: data.youtubeLink,
          slug: movieSlug,
          platform: data.platform
        }
      });
      return movie;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(
        500,
        "Failed to create movie"
      );
    }
  }
  /**
   * Get movies with filters, pagination, and sorting
   */
  async getMovies(filters) {
    try {
      const {
        limit = 10,
        page = 1,
        genre,
        releaseYear,
        yearMin,
        yearMax,
        pricing,
        minRating,
        maxRating,
        sortBy = "createdAt",
        order = "desc",
        search,
        language
      } = filters;
      const skip = (page - 1) * limit;
      const whereClause = {
        isDeleted: false
      };
      if (search) {
        whereClause.OR = [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            director: {
              contains: search,
              mode: "insensitive"
            }
          }
        ];
      }
      if (genre && genre.length > 0) {
        whereClause.genre = {
          hasSome: genre
        };
      }
      if (releaseYear) {
        whereClause.releaseYear = releaseYear;
      } else if (yearMin !== void 0 || yearMax !== void 0) {
        whereClause.releaseYear = {};
        if (yearMin !== void 0) {
          whereClause.releaseYear.gte = yearMin;
        }
        if (yearMax !== void 0) {
          whereClause.releaseYear.lte = yearMax;
        }
      }
      if (pricing) {
        whereClause.pricing = pricing;
      }
      if (language) {
        whereClause.language = {
          has: language
        };
      }
      if (minRating !== void 0 && maxRating !== void 0) {
        whereClause.averageRating = {
          gte: minRating,
          lte: maxRating
        };
      } else if (minRating !== void 0) {
        whereClause.averageRating = {
          gte: minRating
        };
      } else if (maxRating !== void 0) {
        whereClause.averageRating = {
          lte: maxRating
        };
      }
      const orderBy = {};
      if (sortBy === "rating") {
        orderBy.averageRating = order;
      } else if (sortBy === "releaseYear") {
        orderBy.releaseYear = order;
      } else if (sortBy === "title") {
        orderBy.title = order;
      } else {
        orderBy.createdAt = order;
      }
      const [total, movies] = await Promise.all([
        prisma.movie.count({ where: whereClause }),
        prisma.movie.findMany({
          where: whereClause,
          orderBy,
          skip,
          take: limit
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: movies,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch movies");
    }
  }
  /**
   * Get a single movie by slug
   */
  async getMovieBySlug(movieSlug) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { slug: movieSlug }
      });
      if (!movie || movie.isDeleted) {
        return null;
      }
      return movie;
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch movie");
    }
  }
  /**
   * Get a single movie by ID
   */
  async getMovieById(id) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id }
      });
      if (!movie || movie.isDeleted) {
        return null;
      }
      return movie;
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch movie");
    }
  }
  /**
   * Update a movie
   */
  async updateMovie(id, data) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id }
      });
      if (!movie) {
        throw new AppError_default(404, "Movie not found");
      }
      if (movie.isDeleted) {
        throw new AppError_default(404, "Movie not found");
      }
      let newSlug = movie.slug;
      if (data.title) {
        newSlug = generateSlug(data.title);
        const existingMovie = await prisma.movie.findUnique({
          where: { slug: newSlug }
        });
        if (existingMovie && existingMovie.id !== id) {
          throw new AppError_default(400, "A movie with this title already exists");
        }
      }
      const updatedMovie = await prisma.movie.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          genre: data.genre,
          releaseYear: data.releaseYear,
          director: data.director,
          cast: data.cast,
          posterUrl: data.posterUrl === "" ? null : data.posterUrl,
          trailerUrl: data.trailerUrl === "" ? null : data.trailerUrl,
          duration: data.duration,
          language: data.language,
          pricing: data.pricing,
          price: data.price,
          youtubeLink: data.youtubeLink === "" ? null : data.youtubeLink,
          slug: newSlug,
          platform: data.platform,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      return updatedMovie;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update movie");
    }
  }
  /**
   * Soft delete a movie
   */
  async deleteMovie(id) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id }
      });
      if (!movie) {
        throw new AppError_default(404, "Movie not found");
      }
      if (movie.isDeleted) {
        throw new AppError_default(404, "Movie not found");
      }
      const deletedMovie = await prisma.movie.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
      return deletedMovie;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete movie");
    }
  }
};
var moviesService = new MoviesService();

// src/app/module/movies/movies.validation.ts
import { z as z2 } from "zod";
var createMovieSchema = z2.object({
  body: z2.object({
    title: z2.string().min(1, "Title is required").max(255),
    description: z2.string().min(10, "Description must be at least 10 characters"),
    genre: z2.array(z2.string()).min(1, "At least one genre is required"),
    releaseYear: z2.number().int().min(1800).max((/* @__PURE__ */ new Date()).getFullYear() + 5),
    director: z2.string().min(1),
    cast: z2.array(z2.string()).default([]),
    platform: z2.string().min(1, "Platform is required"),
    posterUrl: z2.string().url("Invalid poster URL").optional(),
    trailerUrl: z2.string().url("Invalid trailer URL").optional(),
    duration: z2.number().int().min(1, "Duration must be at least 1 minute").optional(),
    language: z2.array(z2.string()).default(["English"]),
    pricing: z2.enum(["FREE", "PREMIUM"]).default("PREMIUM"),
    price: z2.number().min(0).optional(),
    youtubeLink: z2.string().url("Invalid YouTube URL").optional()
  })
});
var updateMovieSchema = z2.object({
  body: z2.object({
    title: z2.string().min(1).max(255).optional(),
    description: z2.string().min(10).optional(),
    genre: z2.array(z2.string()).min(1).optional(),
    releaseYear: z2.number().int().min(1800).max((/* @__PURE__ */ new Date()).getFullYear() + 5).optional(),
    director: z2.string().min(1).optional(),
    cast: z2.array(z2.string()).optional(),
    platform: z2.string().min(1).optional(),
    posterUrl: z2.string().url().optional().or(z2.literal("")),
    trailerUrl: z2.string().url().optional().or(z2.literal("")),
    duration: z2.number().int().min(1).optional(),
    language: z2.array(z2.string()).optional(),
    pricing: z2.enum(["FREE", "PREMIUM"]).optional(),
    price: z2.number().min(0).optional(),
    youtubeLink: z2.string().url().optional().or(z2.literal(""))
  })
});
var getMoviesQuerySchema = z2.object({
  query: z2.object({
    // Pagination
    limit: z2.coerce.number().int().min(1).max(100).default(10),
    page: z2.coerce.number().int().min(1).default(1),
    // Filtering
    genre: z2.union([z2.string(), z2.array(z2.string())]).optional().transform((value) => {
      if (!value) return void 0;
      return Array.isArray(value) ? value : [value];
    }),
    releaseYear: z2.coerce.number().int().min(1800).optional(),
    yearMin: z2.coerce.number().int().min(1800).optional(),
    yearMax: z2.coerce.number().int().min(1800).optional(),
    pricing: z2.enum(["FREE", "PREMIUM"]).optional(),
    language: z2.string().optional(),
    minRating: z2.coerce.number().min(0).max(10).optional(),
    maxRating: z2.coerce.number().min(0).max(10).optional(),
    // Sorting
    sortBy: z2.enum(["rating", "releaseYear", "createdAt", "title"]).default("createdAt"),
    order: z2.enum(["asc", "desc"]).default("desc"),
    // Search
    search: z2.string().optional()
  })
});
var getMovieBySlugSchema = z2.object({
  params: z2.object({
    slug: z2.string().min(1)
  })
});
var deleteMovieSchema = z2.object({
  params: z2.object({
    id: z2.string().uuid("Invalid movie ID")
  })
});
var updateMovieParamsSchema = z2.object({
  params: z2.object({
    id: z2.string().uuid("Invalid movie ID")
  })
});

// src/app/module/movies/movies.controller.ts
var MoviesController = class {
  /**
   * Create a new movie (Admin only)
   */
  static createMovie = catchAsync(async (req, res) => {
    const validatedData = createMovieSchema.parse({ body: req.body });
    const movie = await moviesService.createMovie(validatedData.body);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Movie created successfully",
      data: movie
    });
  });
  /**
   * Get all movies with filters and pagination
   */
  static getMovies = catchAsync(async (req, res) => {
    const validatedQuery = getMoviesQuerySchema.parse({ query: req.query || {} });
    const result = await moviesService.getMovies(validatedQuery.query);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movies retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get a single movie by slug or ID
   */
  static getMovieBySlug = catchAsync(async (req, res) => {
    const slugOrId = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    let movie = null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slugOrId)) {
      movie = await moviesService.getMovieById(slugOrId);
    }
    if (!movie) {
      movie = await moviesService.getMovieBySlug(slugOrId);
    }
    if (!movie) {
      throw new AppError_default(404, "Movie not found");
    }
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie retrieved successfully",
      data: movie
    });
  });
  /**
   * Update a movie (Admin only)
   */
  static updateMovie = catchAsync(async (req, res) => {
    const validatedParams = updateMovieParamsSchema.parse({ params: req.params });
    const validatedData = updateMovieSchema.parse({ body: req.body });
    const movie = await moviesService.updateMovie(
      validatedParams.params.id,
      validatedData.body
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie updated successfully",
      data: movie
    });
  });
  /**
   * Delete a movie (Admin only)
   */
  static deleteMovie = catchAsync(async (req, res) => {
    const validatedParams = deleteMovieSchema.parse({ params: req.params });
    await moviesService.deleteMovie(validatedParams.params.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie deleted successfully",
      data: null
    });
  });
};

// src/app/module/movies/movies.route.ts
var router2 = Router2();
router2.get("/movies", MoviesController.getMovies);
router2.get("/movies/:slug", MoviesController.getMovieBySlug);
router2.post("/movies", requireAuth, async (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: "Only admins can create movies"
    });
  }
  next();
}, MoviesController.createMovie);
router2.patch("/movies/:id", requireAuth, async (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: "Only admins can update movies"
    });
  }
  next();
}, MoviesController.updateMovie);
router2.delete("/movies/:id", requireAuth, async (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: "Only admins can delete movies"
    });
  }
  next();
}, MoviesController.deleteMovie);
var movies_route_default = router2;

// src/app/module/reviews/reviews.route.ts
import { Router as Router3 } from "express";

// src/app/module/reviews/reviews.service.ts
var ReviewsService = class {
  /**
   * Recalculate and update movie's average rating
   */
  async updateMovieRating(movieId) {
    const result = await prisma.review.aggregate({
      where: {
        movieId,
        status: "APPROVED"
      },
      _avg: {
        rating: true
      }
    });
    const avgRating = result._avg.rating || 0;
    await prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: Math.round(avgRating * 10) / 10
      }
    });
  }
  /**
   * Create a new review
   */
  async createReview(userId, data) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id: data.movieId }
      });
      if (!movie || movie.isDeleted) {
        throw new AppError_default(404, "Movie not found");
      }
      const existingReview = await prisma.review.findFirst({
        where: {
          movieId: data.movieId,
          userId
        }
      });
      if (existingReview) {
        throw new AppError_default(400, "You have already reviewed this movie");
      }
      const review = await prisma.review.create({
        data: {
          movieId: data.movieId,
          userId,
          rating: data.rating,
          title: data.title,
          content: data.comment,
          spoiler: data.containsSpoiler ?? false,
          tags: data.tags ?? [],
          status: "PENDING"
        }
      });
      await this.updateMovieRating(data.movieId);
      return review;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to create review");
    }
  }
  /**
   * Get reviews with filters and pagination
   */
  async getReviews(filters) {
    try {
      const {
        movieId,
        status: status8,
        tag,
        spoiler,
        sortBy = "createdAt",
        order = "desc",
        limit = 10,
        page = 1
      } = filters;
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (movieId) {
        whereClause.movieId = movieId;
      }
      if (status8) {
        whereClause.status = status8;
      }
      if (typeof spoiler === "boolean") {
        whereClause.spoiler = spoiler;
      }
      if (tag) {
        whereClause.tags = { has: tag };
      }
      let orderBy = {};
      if (sortBy === "rating") {
        orderBy.rating = order;
      } else if (sortBy === "likes") {
        orderBy = {
          likes: {
            _count: order
          }
        };
      } else {
        orderBy.createdAt = order;
      }
      const [total, reviews] = await Promise.all([
        prisma.review.count({ where: whereClause }),
        prisma.review.findMany({
          where: whereClause,
          orderBy,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            movie: {
              select: {
                id: true,
                title: true
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch reviews");
    }
  }
  /**
   * Get a single review by ID
   */
  async getReviewById(id) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          },
          movie: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      });
      return review;
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch review");
    }
  }
  /**
   * Update a review (user can only update own review)
   */
  async updateReview(id, userId, data) {
    try {
      const review = await prisma.review.findUnique({
        where: { id }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      if (review.userId !== userId) {
        throw new AppError_default(403, "You can only update your own reviews");
      }
      if (review.status === "APPROVED") {
        throw new AppError_default(403, "Published reviews cannot be edited");
      }
      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          rating: data.rating ?? review.rating,
          title: data.title ?? review.title,
          content: data.comment ?? review.content,
          spoiler: data.containsSpoiler ?? review.spoiler,
          tags: data.tags ?? review.tags
        }
      });
      return updatedReview;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      console.error("[UpdateReview Error]", error);
      throw new AppError_default(500, "Failed to update review");
    }
  }
  /**
   * Delete a review (user can only delete own review)
   */
  async deleteReview(id, userId) {
    try {
      const review = await prisma.review.findUnique({
        where: { id }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      if (review.userId !== userId) {
        throw new AppError_default(403, "You can only delete your own reviews");
      }
      if (review.status === "APPROVED") {
        throw new AppError_default(403, "Published reviews cannot be deleted");
      }
      await prisma.comment.deleteMany({
        where: { reviewId: id }
      });
      const deletedReview = await prisma.review.delete({
        where: { id }
      });
      return deletedReview;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete review");
    }
  }
  /**
   * Get reviews for a specific movie
   */
  async getMovieReviews(movieId, limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const movie = await prisma.movie.findUnique({
        where: { id: movieId }
      });
      if (!movie || movie.isDeleted) {
        throw new AppError_default(404, "Movie not found");
      }
      const [total, reviews] = await Promise.all([
        prisma.review.count({
          where: {
            movieId,
            status: "APPROVED"
          }
        }),
        prisma.review.findMany({
          where: {
            movieId,
            status: "APPROVED"
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch movie reviews");
    }
  }
};
var reviewsService = new ReviewsService();

// src/app/module/reviews/reviews.validation.ts
import { z as z3 } from "zod";
var createReviewSchema = z3.object({
  body: z3.object({
    movieId: z3.string().uuid("Invalid movie ID"),
    rating: z3.number().int().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),
    title: z3.string().min(3, "Title must be at least 3 characters").max(100),
    comment: z3.string().min(10, "Comment must be at least 10 characters").max(5e3),
    containsSpoiler: z3.boolean().default(false),
    tags: z3.array(z3.string().trim().min(1).max(30)).max(8).default([])
  })
});
var updateReviewSchema = z3.object({
  body: z3.object({
    rating: z3.number().int().min(1).max(10).optional(),
    title: z3.string().min(3).max(100).optional(),
    comment: z3.string().min(10).max(5e3).optional(),
    containsSpoiler: z3.boolean().optional(),
    tags: z3.array(z3.string().trim().min(1).max(30)).max(8).optional()
  })
});
var getReviewsQuerySchema = z3.object({
  query: z3.object({
    movieId: z3.string().uuid().optional(),
    status: z3.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    tag: z3.string().trim().min(1).max(30).optional(),
    spoiler: z3.enum(["true", "false"]).transform((value) => value === "true").optional(),
    sortBy: z3.enum(["rating", "createdAt", "likes"]).default("createdAt"),
    order: z3.enum(["asc", "desc"]).default("desc"),
    limit: z3.coerce.number().int().min(1).max(100).default(10),
    page: z3.coerce.number().int().min(1).default(1)
  })
});
var getReviewByIdSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid("Invalid review ID")
  })
});
var deleteReviewSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid("Invalid review ID")
  })
});
var updateReviewParamsSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid("Invalid review ID")
  })
});

// src/app/module/reviews/reviews.controller.ts
var ReviewsController = class {
  /**
   * Create a new review
   */
  static createReview = catchAsync(async (req, res) => {
    const validatedData = createReviewSchema.parse({ body: req.body });
    const review = await reviewsService.createReview(req.user.id, validatedData.body);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Review created successfully",
      data: review
    });
  });
  /**
   * Get all reviews with filters and pagination
   */
  static getReviews = catchAsync(async (req, res) => {
    const validatedQuery = getReviewsQuerySchema.parse({ query: req.query });
    const result = await reviewsService.getReviews(validatedQuery.query);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Reviews retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get a single review by ID
   */
  static getReviewById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await reviewsService.getReviewById(id);
    if (!review) {
      throw new AppError_default(404, "Review not found");
    }
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review retrieved successfully",
      data: review
    });
  });
  /**
   * Get reviews for a specific movie
   */
  static getMovieReviews = catchAsync(async (req, res) => {
    const { movieId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const result = await reviewsService.getMovieReviews(
      movieId,
      parseInt(limit),
      parseInt(page)
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie reviews retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Update a review (user can only update own review)
   */
  static updateReview = catchAsync(async (req, res) => {
    const validatedParams = updateReviewParamsSchema.parse({ params: req.params });
    const validatedData = updateReviewSchema.parse({ body: req.body });
    const review = await reviewsService.updateReview(
      validatedParams.params.id,
      req.user.id,
      validatedData.body
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: review
    });
  });
  /**
   * Delete a review (user can only delete own review)
   */
  static deleteReview = catchAsync(async (req, res) => {
    const validatedParams = deleteReviewSchema.parse({ params: req.params });
    await reviewsService.deleteReview(validatedParams.params.id, req.user.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: null
    });
  });
};

// src/app/module/reviews/reviews.route.ts
var router3 = Router3();
router3.get("/reviews", ReviewsController.getReviews);
router3.get("/reviews/:id", ReviewsController.getReviewById);
router3.get("/movies/:movieId/reviews", ReviewsController.getMovieReviews);
router3.post("/reviews", requireAuth, ReviewsController.createReview);
router3.patch("/reviews/:id", requireAuth, ReviewsController.updateReview);
router3.delete("/reviews/:id", requireAuth, ReviewsController.deleteReview);
var reviews_route_default = router3;

// src/app/module/comments/comments.route.ts
import { Router as Router4 } from "express";

// src/app/module/comments/comments.service.ts
var CommentsService = class {
  /**
   * Create a new comment on a review
   */
  async createComment(userId, data) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: data.reviewId }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      const comment = await prisma.comment.create({
        data: {
          reviewId: data.reviewId,
          userId,
          content: data.content
        }
      });
      return comment;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to create comment");
    }
  }
  /**
   * Get comments with filters and pagination
   */
  async getComments(filters) {
    try {
      const { reviewId, limit = 10, page = 1 } = filters;
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (reviewId) {
        whereClause.reviewId = reviewId;
      }
      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: whereClause }),
        prisma.comment.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: comments,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch comments");
    }
  }
  /**
   * Update a comment (user can only update own comment)
   */
  async updateComment(id, userId, data) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id }
      });
      if (!comment) {
        throw new AppError_default(404, "Comment not found");
      }
      if (comment.userId !== userId) {
        throw new AppError_default(403, "You can only update your own comments");
      }
      const updatedComment = await prisma.comment.update({
        where: { id },
        data: {
          content: data.content
        }
      });
      return updatedComment;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update comment");
    }
  }
  /**
   * Delete a comment (user can only delete own comment)
   */
  async deleteComment(id, userId) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id }
      });
      if (!comment) {
        throw new AppError_default(404, "Comment not found");
      }
      if (comment.userId !== userId) {
        throw new AppError_default(403, "You can only delete your own comments");
      }
      const deletedComment = await prisma.comment.delete({
        where: { id }
      });
      return deletedComment;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete comment");
    }
  }
  /**
   * Get comments for a specific review
   */
  async getReviewComments(reviewId, limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const review = await prisma.review.findUnique({
        where: { id: reviewId }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { reviewId } }),
        prisma.comment.findMany({
          where: { reviewId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: comments,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch review comments");
    }
  }
};
var commentsService = new CommentsService();

// src/app/module/comments/comments.validation.ts
import { z as z4 } from "zod";
var createCommentSchema = z4.object({
  body: z4.object({
    reviewId: z4.string().uuid("Invalid review ID"),
    content: z4.string().min(1, "Content is required").max(1e3)
  })
});
var updateCommentSchema = z4.object({
  body: z4.object({
    content: z4.string().min(1).max(1e3)
  })
});
var getCommentsQuerySchema = z4.object({
  query: z4.object({
    reviewId: z4.string().uuid().optional(),
    limit: z4.coerce.number().int().min(1).max(100).default(10),
    page: z4.coerce.number().int().min(1).default(1)
  })
});
var deleteCommentSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid comment ID")
  })
});
var updateCommentParamsSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid comment ID")
  })
});

// src/app/module/comments/comments.controller.ts
var CommentsController = class {
  /**
   * Create a new comment on a review
   */
  static createComment = catchAsync(async (req, res) => {
    const validatedData = createCommentSchema.parse({ body: req.body });
    const comment = await commentsService.createComment(req.user.id, validatedData.body);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Comment created successfully",
      data: comment
    });
  });
  /**
   * Get all comments with filters and pagination
   */
  static getComments = catchAsync(async (req, res) => {
    const validatedQuery = getCommentsQuerySchema.parse({ query: req.query });
    const result = await commentsService.getComments(validatedQuery.query);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Comments retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get comments for a specific review
   */
  static getReviewComments = catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const result = await commentsService.getReviewComments(
      reviewId,
      parseInt(limit),
      parseInt(page)
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review comments retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Update a comment (user can only update own comment)
   */
  static updateComment = catchAsync(async (req, res) => {
    const validatedParams = updateCommentParamsSchema.parse({ params: req.params });
    const validatedData = updateCommentSchema.parse({ body: req.body });
    const comment = await commentsService.updateComment(
      validatedParams.params.id,
      req.user.id,
      validatedData.body
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Comment updated successfully",
      data: comment
    });
  });
  /**
   * Delete a comment (user can only delete own comment)
   */
  static deleteComment = catchAsync(async (req, res) => {
    const validatedParams = deleteCommentSchema.parse({ params: req.params });
    await commentsService.deleteComment(validatedParams.params.id, req.user.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Comment deleted successfully",
      data: null
    });
  });
};

// src/app/module/comments/comments.route.ts
var router4 = Router4();
router4.get("/comments", CommentsController.getComments);
router4.get("/reviews/:reviewId/comments", CommentsController.getReviewComments);
router4.post("/comments", requireAuth, CommentsController.createComment);
router4.patch("/comments/:id", requireAuth, CommentsController.updateComment);
router4.delete("/comments/:id", requireAuth, CommentsController.deleteComment);
var comments_route_default = router4;

// src/app/module/likes/likes.route.ts
import { Router as Router5 } from "express";

// src/app/module/likes/likes.service.ts
var LikesService = class {
  /**
   * Toggle like on a review (create if doesn't exist, delete if exists)
   */
  async toggleLike(userId, reviewId) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_reviewId: {
            userId,
            reviewId
          }
        }
      });
      if (existingLike) {
        await prisma.like.delete({
          where: { id: existingLike.id }
        });
        return { liked: false };
      }
      const like = await prisma.like.create({
        data: {
          userId,
          reviewId
        }
      });
      return { liked: true, like };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to toggle like");
    }
  }
  /**
   * Get likes with filters and pagination
   */
  async getLikes(filters) {
    try {
      const { reviewId, limit = 10, page = 1 } = filters;
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (reviewId) whereClause.reviewId = reviewId;
      const [total, likes] = await Promise.all([
        prisma.like.count({ where: whereClause }),
        prisma.like.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { id: "desc" },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            review: {
              select: { id: true, title: true, movieId: true }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: likes,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch likes");
    }
  }
  /**
   * Get likes for a specific review
   */
  async getReviewLikes(reviewId, limit = 10, page = 1) {
    return this.getLikes({ reviewId, limit, page });
  }
  /**
   * Get likes by a specific user
   */
  async getUserLikes(userId, limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const [total, likes] = await Promise.all([
        prisma.like.count({ where: { userId } }),
        prisma.like.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { id: "desc" },
          include: {
            review: {
              select: {
                id: true,
                title: true,
                movieId: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: likes,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch user likes");
    }
  }
  /**
   * Get the number of likes for a specific review
   */
  async getReviewLikesCount(reviewId) {
    try {
      return await prisma.like.count({
        where: { reviewId }
      });
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch likes count");
    }
  }
};
var likesService = new LikesService();

// src/app/module/likes/likes.validation.ts
import { z as z5 } from "zod";
var createLikeSchema = z5.object({
  body: z5.object({
    reviewId: z5.string().uuid("Invalid review ID")
  })
});
var getLikesQuerySchema = z5.object({
  query: z5.object({
    reviewId: z5.string().uuid().optional(),
    limit: z5.coerce.number().int().min(1).max(100).default(10),
    page: z5.coerce.number().int().min(1).default(1)
  })
});
var deleteLikeSchema = z5.object({
  params: z5.object({
    id: z5.string().uuid("Invalid like ID")
  })
});

// src/app/module/likes/likes.controller.ts
var LikesController = class {
  /**
   * Toggle like on a review
   */
  static toggleLike = catchAsync(async (req, res) => {
    const validatedData = createLikeSchema.parse({ body: req.body });
    const result = await likesService.toggleLike(req.user.id, validatedData.body.reviewId);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: result.liked ? "Like added successfully" : "Like removed successfully",
      data: result
    });
  });
  /**
   * Get likes with filters
   */
  static getLikes = catchAsync(async (req, res) => {
    const validatedQuery = getLikesQuerySchema.parse({ query: req.query });
    const result = await likesService.getLikes(validatedQuery.query);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Likes retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get likes for a specific movie
   */
  static getReviewLikes = catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const result = await likesService.getReviewLikes(
      reviewId,
      parseInt(limit),
      parseInt(page)
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review likes retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get likes count for a specific review
   */
  static getReviewLikesCount = catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const count = await likesService.getReviewLikesCount(reviewId);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review likes count retrieved successfully",
      data: {
        reviewId,
        likesCount: count
      }
    });
  });
  /**
   * Get likes by current user
   */
  static getUserLikes = catchAsync(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const result = await likesService.getUserLikes(
      req.user.id,
      parseInt(limit),
      parseInt(page)
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User likes retrieved successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
};

// src/app/module/likes/likes.route.ts
var router5 = Router5();
router5.get("/likes", LikesController.getLikes);
router5.get("/reviews/:reviewId/likes", LikesController.getReviewLikes);
router5.get("/reviews/:reviewId/likes/count", LikesController.getReviewLikesCount);
router5.post("/likes", requireAuth, LikesController.toggleLike);
router5.get("/user/likes", requireAuth, LikesController.getUserLikes);
var likes_route_default = router5;

// src/app/module/watchlist/watchlist.route.ts
import { Router as Router6 } from "express";

// src/app/module/watchlist/watchlist.service.ts
var WatchlistService = class {
  /**
   * Add a movie to user's watchlist
   */
  async addToWatchlist(userId, movieId) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id: movieId }
      });
      if (!movie || movie.isDeleted) {
        throw new AppError_default(404, "Movie not found");
      }
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          movieId
        }
      });
      if (existingWatchlist) {
        throw new AppError_default(400, "Movie is already in your watchlist");
      }
      const watchlist = await prisma.watchlist.create({
        data: {
          userId,
          movieId
        },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              slug: true,
              posterUrl: true,
              releaseYear: true
            }
          }
        }
      });
      return watchlist;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to add to watchlist");
    }
  }
  /**
   * Remove a movie from user's watchlist
   */
  async removeFromWatchlist(id, userId) {
    try {
      const watchlist = await prisma.watchlist.findUnique({
        where: { id }
      });
      if (!watchlist) {
        throw new AppError_default(404, "Watchlist entry not found");
      }
      if (watchlist.userId !== userId) {
        throw new AppError_default(403, "You can only remove your own watchlist entries");
      }
      const deleted = await prisma.watchlist.delete({
        where: { id }
      });
      return deleted;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to remove from watchlist");
    }
  }
  /**
   * Get user's watchlist with pagination and sorting
   */
  async getUserWatchlist(userId, limit = 10, page = 1, sortBy = "addedAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const orderByObj = {};
      if (sortBy === "title") {
        orderByObj.movie = { title: order };
      } else {
        orderByObj.createdAt = order;
      }
      const [total, watchlist] = await Promise.all([
        prisma.watchlist.count({ where: { userId } }),
        prisma.watchlist.findMany({
          where: { userId },
          orderBy: orderByObj,
          skip,
          take: limit,
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                posterUrl: true,
                releaseYear: true,
                director: true,
                averageRating: true,
                pricing: true,
                price: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: watchlist,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch watchlist");
    }
  }
  /**
   * Check if a movie is in user's watchlist
   */
  async checkIfInWatchlist(userId, movieId) {
    try {
      const watchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          movieId
        }
      });
      return !!watchlist;
    } catch (error) {
      throw new AppError_default(500, "Failed to check watchlist");
    }
  }
  /**
   * Get the count of movies in user's watchlist
   */
  async getWatchlistCount(userId) {
    try {
      const count = await prisma.watchlist.count({
        where: { userId }
      });
      return count;
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch watchlist count");
    }
  }
};
var watchlistService = new WatchlistService();

// src/app/module/watchlist/watchlist.validation.ts
import { z as z6 } from "zod";
var addToWatchlistSchema = z6.object({
  body: z6.object({
    movieId: z6.string().uuid("Invalid movie ID")
  })
});
var removeFromWatchlistSchema = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid watchlist ID")
  })
});
var getWatchlistQuerySchema = z6.object({
  query: z6.object({
    limit: z6.coerce.number().int().min(1).max(100).default(10),
    page: z6.coerce.number().int().min(1).default(1),
    sortBy: z6.enum(["addedAt", "title"]).default("addedAt"),
    order: z6.enum(["asc", "desc"]).default("desc")
  })
});
var checkWatchlistSchema = z6.object({
  query: z6.object({
    movieId: z6.string().uuid("Invalid movie ID")
  })
});

// src/app/module/watchlist/watchlist.controller.ts
var WatchlistController = class {
  /**
   * Add a movie to watchlist
   */
  addToWatchlist = catchAsync(async (req, res) => {
    const { body } = addToWatchlistSchema.parse({ body: req.body || {} });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await watchlistService.addToWatchlist(userId, body.movieId);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Added to watchlist successfully",
      data: result
    });
  });
  /**
   * Remove a movie from watchlist
   */
  removeFromWatchlist = catchAsync(async (req, res) => {
    const { params } = removeFromWatchlistSchema.parse({ params: req.params || {} });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await watchlistService.removeFromWatchlist(params.id, userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Removed from watchlist successfully",
      data: result
    });
  });
  /**
   * Get user's watchlist
   */
  getUserWatchlist = catchAsync(async (req, res) => {
    const { query } = getWatchlistQuerySchema.parse({ query: req.query || {} });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await watchlistService.getUserWatchlist(
      userId,
      query.limit,
      query.page,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Watchlist fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Check if a movie is in user's watchlist
   */
  checkIfInWatchlist = catchAsync(async (req, res) => {
    const { query } = checkWatchlistSchema.parse({ query: req.query || {} });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const inWatchlist = await watchlistService.checkIfInWatchlist(userId, query.movieId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Watchlist check completed",
      data: { inWatchlist }
    });
  });
  /**
   * Get watchlist count for a user
   */
  getWatchlistCount = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const count = await watchlistService.getWatchlistCount(userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Watchlist count fetched successfully",
      data: { count }
    });
  });
};
var watchlistController = new WatchlistController();

// src/app/module/watchlist/watchlist.route.ts
var router6 = Router6();
router6.post("/", requireAuth, watchlistController.addToWatchlist);
router6.delete("/:id", requireAuth, watchlistController.removeFromWatchlist);
router6.get("/user/watchlist", requireAuth, watchlistController.getUserWatchlist);
router6.get("/count/:userId", watchlistController.getWatchlistCount);
router6.get("/check", requireAuth, watchlistController.checkIfInWatchlist);
var watchlist_route_default = router6;

// src/app/module/payments/payments.route.ts
import { Router as Router7 } from "express";

// src/app/lib/stripe.ts
import Stripe from "stripe";
var stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
var stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia"
});
var STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// src/app/module/payments/payments.service.ts
var PaymentService = class {
  /**
   * Create a payment intent with Stripe
   */
  async createPaymentIntent(userId, input) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100),
        // Convert to cents
        currency: input.currency || "usd",
        description: input.description || `Payment for CineTube - User: ${user.email}`,
        metadata: {
          userId,
          email: user.email
        }
      });
      return {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        amount: input.amount,
        currency: input.currency || "usd"
      };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to create payment intent");
    }
  }
  /**
   * Create a checkout session for subscriptions
   */
  async createCheckoutSession(userId, tierId, interval) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError_default(404, "User not found");
      const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
      if (!tier) throw new AppError_default(404, "Subscription tier not found");
      let price = tier.price;
      let stripeInterval = tier.billingCycle === 12 ? "year" : "month";
      if (tier.name === "PREMIUM" && interval) {
        if (interval === "yearly") {
          price = 79.99;
          stripeInterval = "year";
        } else {
          price = 9.99;
          stripeInterval = "month";
        }
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: tier.currency || "usd",
              product_data: {
                name: `${tier.displayName} (${interval === "yearly" ? "Yearly" : "Monthly"})`,
                description: tier.description || ""
              },
              unit_amount: Math.round(price * 100),
              recurring: {
                interval: stripeInterval
              }
            },
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        customer_email: user.email,
        metadata: {
          userId,
          tierId,
          interval: interval || (tier.billingCycle === 12 ? "yearly" : "monthly")
        }
      });
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      throw new AppError_default(500, error.message || "Failed to create checkout session");
    }
  }
  /**
   * Create a payment record after successful Stripe payment
   */
  async createPayment(userId, input) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
      if (!intent) {
        throw new AppError_default(404, "Payment intent not found");
      }
      if (intent.metadata?.userId !== userId) {
        throw new AppError_default(403, "Payment intent does not belong to this user");
      }
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount: input.amount,
          currency: input.currency,
          status: PaymentStatus.PENDING,
          paymentMethod: input.method,
          transactionId: input.paymentIntentId,
          gateway: "STRIPE"
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return payment;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to create payment");
    }
  }
  /**
   * Get a single payment by ID
   */
  async getPayment(id) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      if (!payment) {
        throw new AppError_default(404, "Payment not found");
      }
      return payment;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch payment");
    }
  }
  /**
   * Get user's payments with pagination
   */
  async getUserPayments(userId, limit = 10, page = 1, status8, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const whereClause = { userId };
      if (status8) {
        whereClause.status = status8;
      }
      const [total, payments] = await Promise.all([
        prisma.payment.count({ where: whereClause }),
        prisma.payment.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: payments,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch {
      throw new AppError_default(500, "Failed to fetch user payments");
    }
  }
  /**
   * Get all payments (admin only)
   */
  async getAllPayments(limit = 10, page = 1, status8, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (status8) {
        whereClause.status = status8;
      }
      const [total, payments] = await Promise.all([
        prisma.payment.count({ where: whereClause }),
        prisma.payment.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: payments,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch {
      throw new AppError_default(500, "Failed to fetch payments");
    }
  }
  /**
   * Validate webhook signature from Stripe
   */
  async validatePaymentWebhook(body, signature) {
    try {
      if (!STRIPE_WEBHOOK_SECRET) {
        throw new AppError_default(500, "Stripe webhook secret not configured");
      }
      const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      return event;
    } catch {
      throw new AppError_default(400, "Invalid webhook signature");
    }
  }
  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntentId) {
    try {
      const payment = await prisma.payment.findFirst({
        where: { transactionId: paymentIntentId }
      });
      if (!payment) {
        return null;
      }
      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return updated;
    } catch (_error) {
      if (_error instanceof AppError_default) throw _error;
      throw new AppError_default(500, "Failed to process payment success");
    }
  }
  /**
   * Fulfill a subscription after successful checkout
   */
  async fulfillSubscription(session) {
    const { userId, tierId, interval } = session.metadata;
    if (!userId || !tierId) {
      console.error("[PaymentService] Missing userId or tierId in session metadata:", session.metadata);
      throw new AppError_default(400, "Missing userId or tierId in session metadata");
    }
    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    if (!tier) {
      console.error("[PaymentService] Subscription tier not found:", tierId);
      throw new AppError_default(404, "Subscription tier not found");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error("[PaymentService] User not found:", userId);
      throw new AppError_default(404, "User not found");
    }
    const endDate = /* @__PURE__ */ new Date();
    if (interval === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    await prisma.$transaction([
      // Create or Update subscription
      prisma.subscription.upsert({
        where: { userId },
        update: {
          tierId,
          status: SubscriptionStatus.ACTIVE,
          startDate: /* @__PURE__ */ new Date(),
          endDate,
          autoRenew: true
        },
        create: {
          userId,
          tierId,
          status: SubscriptionStatus.ACTIVE,
          startDate: /* @__PURE__ */ new Date(),
          endDate,
          autoRenew: true
        }
      }),
      // Create payment record
      prisma.payment.create({
        data: {
          userId,
          amount: tier.price,
          currency: tier.currency || "usd",
          status: PaymentStatus.COMPLETED,
          paymentMethod: "STRIPE",
          gateway: "STRIPE",
          transactionId: session.id
        }
      })
    ]);
    try {
      await emailService.sendPaymentReceipt({
        email: user.email,
        name: user.name || "User",
        amount: tier.price,
        currency: tier.currency || "USD",
        transactionId: session.id,
        subscriptionTier: tier.displayName || tier.name,
        billingDate: (/* @__PURE__ */ new Date()).toLocaleDateString()
      });
    } catch (error) {
      console.error("[PaymentService] Failed to send invoice email:", error);
    }
  }
  /**
   * Verify checkout session and fulfill subscription (fallback for webhook)
   */
  async verifyAndFulfillCheckoutSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        throw new AppError_default(404, "Checkout session not found");
      }
      if (session.payment_status !== "paid") {
        throw new AppError_default(400, `Payment status is ${session.payment_status}`);
      }
      const { userId, tierId } = session.metadata || {};
      if (!userId || !tierId) {
        throw new AppError_default(400, "Missing userId or tierId in session metadata");
      }
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId }
      });
      if (existingSubscription && existingSubscription.status === "ACTIVE") {
        return {
          message: "Subscription already active",
          subscription: existingSubscription
        };
      }
      const existingPayment = await prisma.payment.findFirst({
        where: { transactionId: sessionId }
      });
      if (existingPayment) {
        return {
          message: "Payment already recorded",
          payment: existingPayment
        };
      }
      await this.fulfillSubscription(session);
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { tier: true }
      });
      const payment = await prisma.payment.findFirst({
        where: { transactionId: sessionId }
      });
      return {
        message: "Subscription activated successfully",
        subscription,
        payment
      };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      console.error("[PaymentService] Failed to verify checkout session:", error);
      throw new AppError_default(500, "Failed to verify checkout session");
    }
  }
  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntentId) {
    try {
      const payment = await prisma.payment.findFirst({
        where: { transactionId: paymentIntentId }
      });
      if (!payment) {
        return null;
      }
      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return updated;
    } catch (_error) {
      if (_error instanceof AppError_default) throw _error;
      throw new AppError_default(500, "Failed to process payment failure");
    }
  }
  /**
   * Refund a payment
   */
  async refundPayment(paymentId, reason) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });
      if (!payment) {
        throw new AppError_default(404, "Payment not found");
      }
      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new AppError_default(400, "Only completed payments can be refunded");
      }
      if (!payment.transactionId) {
        throw new AppError_default(400, "Payment has no transaction ID to refund");
      }
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        reason: reason || "requested_by_customer"
      });
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REFUNDED
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return {
        payment: updated,
        refund: {
          id: refund.id,
          amount: refund.amount,
          status: refund.status
        }
      };
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to refund payment");
    }
  }
};
var paymentService = new PaymentService();

// src/app/module/payments/payments.validation.ts
import { z as z7 } from "zod";
var createPaymentIntentSchema = z7.object({
  amount: z7.number().positive("Amount must be positive"),
  currency: z7.string().default("usd"),
  description: z7.string().optional()
});
var createPaymentSchema = z7.object({
  paymentIntentId: z7.string(),
  amount: z7.number().positive(),
  currency: z7.string(),
  method: z7.enum(["STRIPE", "SSLCOMMERZ", "WALLET"]),
  description: z7.string().optional()
});
var getPaymentSchema = z7.object({
  id: z7.string().uuid()
});
var getPaymentsQuerySchema = z7.object({
  limit: z7.coerce.number().int().min(1).max(100).default(10),
  page: z7.coerce.number().int().min(1).default(1),
  status: z7.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  sortBy: z7.enum(["createdAt", "amount"]).default("createdAt"),
  order: z7.enum(["asc", "desc"]).default("desc")
});
var handlePaymentWebhookSchema = z7.object({
  type: z7.string(),
  data: z7.object({
    object: z7.object({
      id: z7.string(),
      status: z7.string(),
      amount: z7.number(),
      currency: z7.string(),
      metadata: z7.record(z7.string(), z7.string()).optional()
    })
  })
});

// src/app/module/payments/payments.controller.ts
var PaymentController = class {
  /**
   * Create a payment intent
   */
  createPaymentIntent = catchAsync(async (req, res) => {
    const body = createPaymentIntentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await paymentService.createPaymentIntent(userId, body);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Payment intent created successfully",
      data: result
    });
  });
  /**
   * Create a checkout session
   */
  createCheckoutSession = catchAsync(async (req, res) => {
    const { tierId, interval } = req.body;
    const userId = req.user?.id;
    if (!tierId) {
      throw new AppError_default(400, "Tier ID is required");
    }
    const result = await paymentService.createCheckoutSession(userId, tierId, interval);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Checkout session created successfully",
      data: result
    });
  });
  /**
   * Verify checkout session and fulfill subscription (fallback when webhook fails)
   */
  verifyCheckoutSession = catchAsync(async (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
      throw new AppError_default(400, "Session ID is required");
    }
    const result = await paymentService.verifyAndFulfillCheckoutSession(sessionId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Checkout session verified successfully",
      data: result
    });
  });
  /**
   * Create a payment record
   */
  createPayment = catchAsync(async (req, res) => {
    const body = createPaymentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await paymentService.createPayment(userId, body);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Payment created successfully",
      data: result
    });
  });
  /**
   * Get payment by ID
   */
  getPayment = catchAsync(async (req, res) => {
    const params = getPaymentSchema.parse(req.params);
    const result = await paymentService.getPayment(params.id);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Payment fetched successfully",
      data: result
    });
  });
  /**
   * Get user's payments
   */
  getUserPayments = catchAsync(async (req, res) => {
    const query = getPaymentsQuerySchema.parse(req.query);
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await paymentService.getUserPayments(
      userId,
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User payments fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Get all payments (admin only)
   */
  getAllPayments = catchAsync(async (req, res) => {
    const query = getPaymentsQuerySchema.parse(req.query);
    const result = await paymentService.getAllPayments(
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "All payments fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Refund a payment
   */
  refundPayment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (typeof id !== "string") {
      throw new AppError_default(400, "Invalid payment ID");
    }
    const result = await paymentService.refundPayment(id, reason);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Payment refunded successfully",
      data: result
    });
  });
  /**
   * Handle Stripe webhook
   */
  handleWebhook = catchAsync(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return sendResponse(res, {
        httpStatusCode: 400,
        success: false,
        message: "Missing stripe signature"
      });
    }
    const event = await paymentService.validatePaymentWebhook(req.body, signature);
    switch (event.type) {
      case "payment_intent.succeeded":
        await paymentService.handlePaymentSuccess(event.data.object.id);
        break;
      case "payment_intent.payment_failed":
        await paymentService.handlePaymentFailure(event.data.object.id);
        break;
      case "checkout.session.completed":
        await paymentService.fulfillSubscription(event.data.object);
        break;
      // Common Stripe noise for Checkout/subscriptions; fulfillment uses checkout.session.completed
      case "charge.succeeded":
      case "charge.updated":
      case "payment_intent.created":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "invoice.paid":
      case "invoice.payment_succeeded":
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Webhook processed successfully"
    });
  });
};
var paymentController = new PaymentController();

// src/app/module/payments/payments.route.ts
var router7 = Router7();
router7.post("/payments/intent", requireAuth, paymentController.createPaymentIntent);
router7.post("/payments/checkout-session", requireAuth, paymentController.createCheckoutSession);
router7.get("/payments/verify-session", requireAuth, paymentController.verifyCheckoutSession);
router7.post("/payments", requireAuth, paymentController.createPayment);
router7.get("/payments/:id", requireAuth, paymentController.getPayment);
router7.get("/user/payments", requireAuth, paymentController.getUserPayments);
router7.post("/payments/:id/refund", requireAuth, paymentController.refundPayment);
router7.get("/payments", checkRole("ADMIN"), paymentController.getAllPayments);
router7.post("/webhooks/stripe", paymentController.handleWebhook);
var payments_route_default = router7;

// src/app/module/subscriptions/subscriptions.route.ts
import { Router as Router8 } from "express";

// src/app/utils/subscriptionTierDefaults.ts
var DEFAULT_SUBSCRIPTION_TIERS = [
  {
    name: "FREE",
    displayName: "Free Tier",
    description: "Basic access with ads",
    price: 0,
    billingCycle: 1,
    currency: "USD",
    features: ["720p HD", "Ad-supported", "1 device"]
  },
  {
    name: "PREMIUM",
    displayName: "Monthly Premium",
    description: "Full access, zero ads",
    price: 9.99,
    billingCycle: 1,
    currency: "USD",
    features: ["4K Ultra HD", "Zero Ads", "Download movies", "3 devices"]
  },
  {
    name: "VIP",
    displayName: "Yearly VIP",
    description: "Best value, early access",
    price: 79.99,
    billingCycle: 12,
    currency: "USD",
    features: ["All Premium Features", "Save 33%", "Early Access", "Priority Support"]
  }
];
async function upsertDefaultSubscriptionTiers() {
  for (const tier of DEFAULT_SUBSCRIPTION_TIERS) {
    await prisma.subscriptionTier.upsert({
      where: { name: tier.name },
      update: {
        displayName: tier.displayName,
        description: tier.description,
        price: tier.price,
        billingCycle: tier.billingCycle,
        currency: tier.currency,
        features: tier.features
      },
      create: tier
    });
  }
}

// src/app/module/subscriptions/subscriptions.service.ts
var SubscriptionService = class {
  /**
   * Create a new subscription for user
   */
  async createSubscription(userId, input) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id: input.subscriptionTierId }
      });
      if (!tier) {
        throw new AppError_default(404, "Subscription tier not found");
      }
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE
        }
      });
      if (existingSubscription) {
        throw new AppError_default(400, "User already has an active subscription");
      }
      const endDate = /* @__PURE__ */ new Date();
      endDate.setMonth(endDate.getMonth() + (tier.billingCycle || 1));
      const subscription = await prisma.subscription.create({
        data: {
          userId,
          tierId: input.subscriptionTierId,
          status: SubscriptionStatus.ACTIVE,
          endDate,
          autoRenew: input.autoRenew ?? true
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return subscription;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to create subscription");
    }
  }
  /**
   * Get a subscription by ID
   */
  async getSubscription(id) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      if (!subscription) {
        throw new AppError_default(404, "Subscription not found");
      }
      return subscription;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch subscription");
    }
  }
  /**
   * Get user's active subscription
   */
  async getUserSubscription(userId) {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return subscription || null;
    } catch {
      throw new AppError_default(500, "Failed to fetch user subscription");
    }
  }
  /**
   * Get user's subscriptions with pagination
   */
  async getUserSubscriptions(userId, limit = 10, page = 1, status8, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const whereClause = { userId };
      if (status8) {
        whereClause.status = status8;
      }
      const [total, subscriptions] = await Promise.all([
        prisma.subscription.count({ where: whereClause }),
        prisma.subscription.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order },
          skip,
          take: limit,
          include: {
            tier: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: subscriptions,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch {
      throw new AppError_default(500, "Failed to fetch user subscriptions");
    }
  }
  /**
   * Get all subscriptions (admin only)
   */
  async getAllSubscriptions(limit = 10, page = 1, status8, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (status8) {
        whereClause.status = status8;
      }
      const [total, subscriptions] = await Promise.all([
        prisma.subscription.count({ where: whereClause }),
        prisma.subscription.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order },
          skip,
          take: limit,
          include: {
            tier: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: subscriptions,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch {
      throw new AppError_default(500, "Failed to fetch subscriptions");
    }
  }
  /**
   * Update a subscription
   */
  async updateSubscription(id, userId, input) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id }
      });
      if (!subscription) {
        throw new AppError_default(404, "Subscription not found");
      }
      if (subscription.userId !== userId) {
        throw new AppError_default(403, "You can only update your own subscriptions");
      }
      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          autoRenew: input.autoRenew,
          tierId: input.subscriptionTierId
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return updated;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update subscription");
    }
  }
  /**
   * Cancel a subscription
   */
  async cancelSubscription(id, userId) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id }
      });
      if (!subscription) {
        throw new AppError_default(404, "Subscription not found");
      }
      if (subscription.userId !== userId) {
        throw new AppError_default(403, "You can only cancel your own subscriptions");
      }
      const cancelled = await prisma.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          autoRenew: false,
          cancelledAt: /* @__PURE__ */ new Date()
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
      return cancelled;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to cancel subscription");
    }
  }
  /**
   * Check if user has access to content
   */
  async checkSubscriptionAccess(userId) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: {
          tier: true
        }
      });
      if (!subscription) {
        return {
          hasAccess: false,
          reason: "No active subscription"
        };
      }
      if (subscription.endDate && /* @__PURE__ */ new Date() > subscription.endDate) {
        if (subscription.autoRenew) {
          return {
            hasAccess: false,
            reason: "Subscription expired - renewal failed"
          };
        }
        return {
          hasAccess: false,
          reason: "Subscription expired"
        };
      }
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        return {
          hasAccess: false,
          reason: "Subscription is not active"
        };
      }
      return {
        hasAccess: true,
        subscriptionTier: subscription.tier,
        endDate: subscription.endDate
      };
    } catch {
      throw new AppError_default(500, "Failed to check subscription access");
    }
  }
  /**
   * Create a subscription tier (admin only)
   */
  async createSubscriptionTier(input) {
    try {
      const tier = await prisma.subscriptionTier.create({
        data: {
          name: input.name,
          displayName: input.name,
          description: input.description,
          price: input.price,
          billingCycle: input.billingCycle === "YEARLY" ? 12 : 1,
          features: input.features || []
        }
      });
      return tier;
    } catch {
      throw new AppError_default(500, "Failed to create subscription tier");
    }
  }
  /**
   * Get all subscription tiers
   */
  async getSubscriptionTiers(limit = 10, page = 1, isActive, sortBy = "price", order = "asc") {
    try {
      const requiredNames = [
        SubscriptionTierName.FREE,
        SubscriptionTierName.PREMIUM,
        SubscriptionTierName.VIP
      ];
      const existingRequired = await prisma.subscriptionTier.findMany({
        where: { name: { in: requiredNames } },
        select: { name: true }
      });
      if (existingRequired.length < requiredNames.length) {
        await upsertDefaultSubscriptionTiers();
      }
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (isActive !== void 0) {
        whereClause.isActive = isActive;
      }
      const [total, tiers] = await Promise.all([
        prisma.subscriptionTier.count({ where: whereClause }),
        prisma.subscriptionTier.findMany({
          where: whereClause,
          orderBy: { [sortBy]: order },
          skip,
          take: limit
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: tiers,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      };
    } catch {
      throw new AppError_default(500, "Failed to fetch subscription tiers");
    }
  }
  /**
   * Get a subscription tier by ID
   */
  async getSubscriptionTier(id) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id }
      });
      if (!tier) {
        throw new AppError_default(404, "Subscription tier not found");
      }
      return tier;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch subscription tier");
    }
  }
  /**
   * Update a subscription tier (admin only)
   */
  async updateSubscriptionTier(id, input) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id }
      });
      if (!tier) {
        throw new AppError_default(404, "Subscription tier not found");
      }
      const updated = await prisma.subscriptionTier.update({
        where: { id },
        data: {
          displayName: input.name,
          description: input.description,
          price: input.price,
          features: input.features
        }
      });
      return updated;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update subscription tier");
    }
  }
  /**
   * Delete a subscription tier (admin only)
   */
  async deleteSubscriptionTier(id) {
    try {
      const tier = await prisma.subscriptionTier.findUnique({
        where: { id }
      });
      if (!tier) {
        throw new AppError_default(404, "Subscription tier not found");
      }
      const activeSubscriptions = await prisma.subscription.count({
        where: {
          tierId: id,
          status: SubscriptionStatus.ACTIVE
        }
      });
      if (activeSubscriptions > 0) {
        throw new AppError_default(
          400,
          "Cannot delete tier with active subscriptions. Set isActive to false instead."
        );
      }
      const deleted = await prisma.subscriptionTier.delete({
        where: { id }
      });
      return deleted;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete subscription tier");
    }
  }
  /**
   * Renew expired subscriptions with autoRenew enabled
   */
  async renewExpiredSubscriptions() {
    try {
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          endDate: {
            lte: /* @__PURE__ */ new Date()
          },
          autoRenew: true,
          status: SubscriptionStatus.ACTIVE
        },
        include: {
          tier: true,
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });
      for (const subscription of expiredSubscriptions) {
        try {
          if (!subscription.endDate) continue;
          const newEndDate = new Date(subscription.endDate);
          newEndDate.setMonth(newEndDate.getMonth() + (subscription.tier.billingCycle || 1));
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              endDate: newEndDate
            }
          });
        } catch {
        }
      }
      return {
        message: "Subscription renewal process completed",
        processedCount: expiredSubscriptions.length
      };
    } catch {
      throw new AppError_default(500, "Failed to renew subscriptions");
    }
  }
};
var subscriptionService = new SubscriptionService();

// src/app/module/subscriptions/subscriptions.validation.ts
import { z as z8 } from "zod";
var createSubscriptionSchema = z8.object({
  subscriptionTierId: z8.string().uuid(),
  paymentMethodId: z8.string().optional(),
  autoRenew: z8.boolean().default(true)
});
var updateSubscriptionSchema = z8.object({
  id: z8.string().uuid(),
  autoRenew: z8.boolean().optional(),
  subscriptionTierId: z8.string().uuid().optional()
});
var cancelSubscriptionSchema = z8.object({
  id: z8.string().uuid(),
  reason: z8.string().optional()
});
var getSubscriptionSchema = z8.object({
  id: z8.string().uuid()
});
var getSubscriptionsQuerySchema = z8.object({
  limit: z8.coerce.number().int().min(1).max(100).default(10),
  page: z8.coerce.number().int().min(1).default(1),
  status: z8.enum(["ACTIVE", "CANCELLED", "EXPIRED", "PAUSED"]).optional(),
  sortBy: z8.enum(["createdAt", "renewalDate"]).default("createdAt"),
  order: z8.enum(["asc", "desc"]).default("desc")
});
var createSubscriptionTierSchema = z8.object({
  name: z8.string().min(1, "Tier name is required"),
  description: z8.string().optional(),
  price: z8.number().positive("Price must be positive"),
  billingCycle: z8.enum(["MONTHLY", "YEARLY"]),
  features: z8.array(z8.string()).default([]),
  maxConcurrentStreams: z8.number().int().positive().default(1),
  maxDownloads: z8.number().int().positive().default(0),
  isActive: z8.boolean().default(true)
});
var updateSubscriptionTierSchema = z8.object({
  id: z8.string().uuid(),
  name: z8.string().min(1).optional(),
  description: z8.string().optional(),
  price: z8.number().positive().optional(),
  features: z8.array(z8.string()).optional(),
  maxConcurrentStreams: z8.number().int().positive().optional(),
  maxDownloads: z8.number().int().positive().optional(),
  isActive: z8.boolean().optional()
});
var getSubscriptionTiersQuerySchema = z8.object({
  limit: z8.coerce.number().int().min(1).max(100).default(10),
  page: z8.coerce.number().int().min(1).default(1),
  isActive: z8.coerce.boolean().optional(),
  sortBy: z8.enum(["price", "createdAt"]).default("price"),
  order: z8.enum(["asc", "desc"]).default("asc")
});

// src/app/module/subscriptions/subscriptions.controller.ts
var SubscriptionController = class {
  /**
   * Create a new subscription
   */
  createSubscription = catchAsync(async (req, res) => {
    const body = createSubscriptionSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.createSubscription(userId, body);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Subscription created successfully",
      data: result
    });
  });
  /**
   * Get subscription by ID
   */
  getSubscription = catchAsync(async (req, res) => {
    const params = getSubscriptionSchema.parse(req.params);
    const result = await subscriptionService.getSubscription(params.id);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription fetched successfully",
      data: result
    });
  });
  /**
   * Get user's active subscription
   */
  getUserSubscription = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.getUserSubscription(userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User subscription fetched successfully",
      data: result
    });
  });
  /**
   * Get user's subscriptions
   */
  getUserSubscriptions = catchAsync(async (req, res) => {
    const query = getSubscriptionsQuerySchema.parse(req.query);
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.getUserSubscriptions(
      userId,
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User subscriptions fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Get all subscriptions (admin only)
   */
  getAllSubscriptions = catchAsync(async (req, res) => {
    const query = getSubscriptionsQuerySchema.parse(req.query);
    const result = await subscriptionService.getAllSubscriptions(
      query.limit,
      query.page,
      query.status,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "All subscriptions fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Update a subscription
   */
  updateSubscription = catchAsync(async (req, res) => {
    const params = updateSubscriptionSchema.parse({ ...req.body, id: req.params.id });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.updateSubscription(params.id, userId, params);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription updated successfully",
      data: result
    });
  });
  /**
   * Cancel a subscription
   */
  cancelSubscription = catchAsync(async (req, res) => {
    const params = cancelSubscriptionSchema.parse({ ...req.body, id: req.params.id });
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.cancelSubscription(params.id, userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription cancelled successfully",
      data: result
    });
  });
  /**
   * Check subscription access
   */
  checkSubscriptionAccess = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await subscriptionService.checkSubscriptionAccess(userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Access check completed",
      data: result
    });
  });
  /**
   * Create subscription tier (admin only)
   */
  createSubscriptionTier = catchAsync(async (req, res) => {
    const body = createSubscriptionTierSchema.parse(req.body);
    const result = await subscriptionService.createSubscriptionTier(body);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Subscription tier created successfully",
      data: result
    });
  });
  /**
   * Get all subscription tiers
   */
  getSubscriptionTiers = catchAsync(async (req, res) => {
    const query = getSubscriptionTiersQuerySchema.parse(req.query);
    const result = await subscriptionService.getSubscriptionTiers(
      query.limit,
      query.page,
      query.isActive,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription tiers fetched successfully",
      data: result.data,
      pagination: result.pagination
    });
  });
  /**
   * Get subscription tier by ID
   */
  getSubscriptionTier = catchAsync(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError_default(400, "Invalid subscription tier ID");
    }
    const result = await subscriptionService.getSubscriptionTier(id);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription tier fetched successfully",
      data: result
    });
  });
  /**
   * Update subscription tier (admin only)
   */
  updateSubscriptionTier = catchAsync(async (req, res) => {
    const body = updateSubscriptionTierSchema.parse({ ...req.body, id: req.params.id });
    const result = await subscriptionService.updateSubscriptionTier(body.id, body);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription tier updated successfully",
      data: result
    });
  });
  /**
   * Delete subscription tier (admin only)
   */
  deleteSubscriptionTier = catchAsync(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      throw new AppError_default(400, "Invalid subscription tier ID");
    }
    const result = await subscriptionService.deleteSubscriptionTier(id);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription tier deleted successfully",
      data: result
    });
  });
  /**
   * Renew expired subscriptions (admin/cron job)
   */
  renewSubscriptions = catchAsync(async (req, res) => {
    const result = await subscriptionService.renewExpiredSubscriptions();
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscriptions renewal process completed",
      data: result
    });
  });
};
var subscriptionController = new SubscriptionController();

// src/app/module/subscriptions/subscriptions.route.ts
var router8 = Router8();
router8.get("/subscription-tiers", subscriptionController.getSubscriptionTiers);
router8.get("/subscription-tiers/:id", subscriptionController.getSubscriptionTier);
router8.post("/subscriptions", requireAuth, subscriptionController.createSubscription);
router8.get("/subscriptions/:id", requireAuth, subscriptionController.getSubscription);
router8.get("/user/subscription", requireAuth, subscriptionController.getUserSubscription);
router8.get("/user/subscriptions", requireAuth, subscriptionController.getUserSubscriptions);
router8.patch("/subscriptions/:id", requireAuth, subscriptionController.updateSubscription);
router8.post("/subscriptions/:id/cancel", requireAuth, subscriptionController.cancelSubscription);
router8.get("/check-access", requireAuth, subscriptionController.checkSubscriptionAccess);
router8.post("/subscription-tiers", checkRole("ADMIN"), subscriptionController.createSubscriptionTier);
router8.patch("/subscription-tiers/:id", checkRole("ADMIN"), subscriptionController.updateSubscriptionTier);
router8.delete("/subscription-tiers/:id", checkRole("ADMIN"), subscriptionController.deleteSubscriptionTier);
router8.get("/subscriptions", checkRole("ADMIN"), subscriptionController.getAllSubscriptions);
router8.post("/subscriptions/renew", checkRole("ADMIN"), subscriptionController.renewSubscriptions);
var subscriptions_route_default = router8;

// src/app/module/moderation/moderation.route.ts
import { Router as Router9 } from "express";

// src/app/module/moderation/moderation.service.ts
var ModerationService = class {
  /**
   * Recalculate and update movie's average rating
   */
  async updateMovieRating(movieId) {
    const result = await prisma.review.aggregate({
      where: {
        movieId,
        status: "APPROVED"
      },
      _avg: {
        rating: true
      }
    });
    const avgRating = result._avg.rating || 0;
    await prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: Math.round(avgRating * 10) / 10
      }
    });
  }
  /**
   * Approve a pending review
   */
  async approveReview(id, adminId) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } }
        }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError_default(400, "Only pending reviews can be approved");
      }
      const approved = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.APPROVED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } }
        }
      });
      await this.logModerationAction(adminId, "APPROVED", "REVIEW", id);
      await this.updateMovieRating(review.movieId);
      return approved;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to approve review");
    }
  }
  /**
   * Reject a pending review
   */
  async rejectReview(id, adminId, input) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } }
        }
      });
      if (!review) {
        throw new AppError_default(404, "Review not found");
      }
      if (review.status !== ReviewStatus.PENDING) {
        throw new AppError_default(400, "Only pending reviews can be rejected");
      }
      const rejected = await prisma.review.update({
        where: { id },
        data: { status: ReviewStatus.REJECTED },
        include: {
          movie: true,
          user: { select: { id: true, email: true, name: true } }
        }
      });
      await this.logModerationAction(adminId, "REJECTED", "REVIEW", id, input.reason);
      await this.updateMovieRating(review.movieId);
      return rejected;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to reject review");
    }
  }
  /**
   * Delete a comment
   */
  async deleteComment(id, adminId, input) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          review: true,
          user: { select: { id: true, email: true, name: true } }
        }
      });
      if (!comment) {
        throw new AppError_default(404, "Comment not found");
      }
      const deleted = await prisma.comment.delete({
        where: { id }
      });
      await this.logModerationAction(adminId, "DELETED", "COMMENT", id, input.reason);
      return deleted;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete comment");
    }
  }
  /**
   * Suspend a user
   */
  async suspendUser(input, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const suspendUntil = input.duration ? new Date(Date.now() + input.duration * 24 * 60 * 60 * 1e3) : null;
      const suspended = await prisma.user.update({
        where: { id: input.userId },
        data: {
          status: "BLOCKED"
        }
      });
      await this.logModerationAction(adminId, "SUSPENDED", "USER", input.userId, input.reason);
      return suspended;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to suspend user");
    }
  }
  /**
   * Unsuspend a user
   */
  async unsuspendUser(userId, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      if (user.status !== "BLOCKED") {
        throw new AppError_default(400, "User is not blocked");
      }
      const unsuspended = await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" }
      });
      await this.logModerationAction(adminId, "UNSUSPENDED", "USER", userId);
      return unsuspended;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to unsuspend user");
    }
  }
  /**
   * Flag content for moderation review
   */
  async flagContent(userId, input) {
    throw new AppError_default(501, "Flag functionality not yet implemented - Flag model does not exist");
  }
  /**
   * Get moderation queue (pending reviews and comments)
   */
  async getModerationQueue(limit = 20, page = 1, status8, type, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const [pendingReviews, pendingComments, totalReviews, totalComments] = await Promise.all([
        type === "COMMENT" || !type ? prisma.comment.findMany({
          where: {},
          skip: type === "COMMENT" ? skip : 0,
          ...type === "COMMENT" ? { take: limit } : {},
          orderBy: { [sortBy]: order },
          include: {
            review: true,
            user: { select: { id: true, email: true, name: true } }
          }
        }) : Promise.resolve([]),
        type === "REVIEW" || !type ? prisma.review.findMany({
          where: { status: ReviewStatus.PENDING },
          skip: type === "REVIEW" ? skip : 0,
          ...type === "REVIEW" ? { take: limit } : {},
          orderBy: { [sortBy]: order },
          include: {
            movie: true,
            user: { select: { id: true, email: true, name: true } }
          }
        }) : Promise.resolve([]),
        type === "COMMENT" || !type ? prisma.comment.count() : Promise.resolve(0),
        type === "REVIEW" || !type ? prisma.review.count({ where: { status: ReviewStatus.PENDING } }) : Promise.resolve(0)
      ]);
      const total = totalReviews + totalComments;
      const pages = Math.ceil(total / limit);
      const combined = [
        ...pendingComments.map((r) => ({ type: "COMMENT", data: r })),
        ...pendingReviews.map((r) => ({ type: "REVIEW", data: r }))
      ];
      return {
        data: combined,
        pagination: { total, page, limit, pages }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch moderation queue");
    }
  }
  /**
   * Get flagged content
   */
  async getFlaggedContent(limit = 20, page = 1, contentType, status8 = "PENDING", sortBy = "flagCount", order = "desc") {
    return {
      data: [],
      pagination: { total: 0, page, limit, pages: 0 }
    };
  }
  /**
   * Resolve a flagged content
   */
  async resolveFlag(flagId, adminId, input) {
    throw new AppError_default(501, "Flag functionality not yet implemented - Flag model does not exist");
  }
  /**
   * Get moderation history
   */
  async getModerationHistory(limit = 20, page = 1, userId, action, sortBy = "createdAt", order = "desc") {
    return {
      data: [],
      pagination: { total: 0, page, limit, pages: 0 }
    };
  }
  /**
   * Get content moderation stats
   */
  async getContentModerationStats() {
    try {
      const [pendingReviewsCount, approvedReviewsCount, rejectedReviewsCount, flagsCount, suspendedUsersCount] = await Promise.all([
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
        prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
        Promise.resolve(0),
        // Flag model not implemented
        prisma.user.count({ where: { status: "BLOCKED" } })
      ]);
      return {
        reviews: {
          pending: pendingReviewsCount,
          approved: approvedReviewsCount,
          rejected: rejectedReviewsCount
        },
        flaggedContent: flagsCount,
        blockedUsers: suspendedUsersCount
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch moderation stats");
    }
  }
  /**
   * Private method to log moderation actions
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logModerationAction(_adminId, _action, _contentType, _contentId, _notes) {
  }
};
var moderationService = new ModerationService();

// src/app/module/moderation/moderation.validation.ts
import { z as z9 } from "zod";
var approveReviewSchema = z9.object({
  id: z9.string().uuid()
});
var rejectReviewSchema = z9.object({
  id: z9.string().uuid(),
  reason: z9.string().min(1, "Rejection reason is required")
});
var deleteCommentSchema2 = z9.object({
  id: z9.string().uuid(),
  reason: z9.string().optional()
});
var suspendUserSchema = z9.object({
  userId: z9.string().uuid(),
  duration: z9.number().int().positive().optional(),
  reason: z9.string().min(1, "Suspension reason is required")
});
var unsuspendUserSchema = z9.object({
  userId: z9.string().uuid()
});
var getModerationQueueQuerySchema = z9.object({
  limit: z9.coerce.number().int().min(1).max(100).default(20),
  page: z9.coerce.number().int().min(1).default(1),
  status: z9.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  type: z9.enum(["REVIEW", "COMMENT"]).optional(),
  sortBy: z9.enum(["createdAt", "reportCount"]).default("createdAt"),
  order: z9.enum(["asc", "desc"]).default("desc")
});
var flagContentSchema = z9.object({
  contentId: z9.string().uuid(),
  contentType: z9.enum(["REVIEW", "COMMENT", "USER"]),
  reason: z9.string().min(1, "Flag reason is required"),
  description: z9.string().optional()
});
var getFlaggedContentQuerySchema = z9.object({
  limit: z9.coerce.number().int().min(1).max(100).default(20),
  page: z9.coerce.number().int().min(1).default(1),
  contentType: z9.enum(["REVIEW", "COMMENT", "USER"]).optional(),
  status: z9.enum(["PENDING", "RESOLVED"]).default("PENDING"),
  sortBy: z9.enum(["createdAt", "flagCount"]).default("flagCount"),
  order: z9.enum(["asc", "desc"]).default("desc")
});
var resolveFlagSchema = z9.object({
  flagId: z9.string().uuid(),
  action: z9.enum(["APPROVED", "DELETED", "WARNED"]),
  notes: z9.string().optional()
});
var getModerationHistoryQuerySchema = z9.object({
  limit: z9.coerce.number().int().min(1).max(100).default(20),
  page: z9.coerce.number().int().min(1).default(1),
  userId: z9.string().uuid().optional(),
  action: z9.enum(["APPROVED", "REJECTED", "DELETED", "SUSPENDED"]).optional(),
  sortBy: z9.enum(["createdAt"]).default("createdAt"),
  order: z9.enum(["asc", "desc"]).default("desc")
});

// src/app/module/moderation/moderation.controller.ts
var ModerationController = class {
  /**
   * Approve a review
   */
  approveReview = catchAsync(async (req, res) => {
    const body = approveReviewSchema.parse(req.params);
    const adminId = req.user?.id || "";
    const result = await moderationService.approveReview(body.id, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review approved successfully",
      data: result
    });
  });
  /**
   * Reject a review
   */
  rejectReview = catchAsync(async (req, res) => {
    const params = approveReviewSchema.parse(req.params);
    const body = rejectReviewSchema.parse({ ...req.body, id: params.id });
    const adminId = req.user?.id || "";
    const result = await moderationService.rejectReview(body.id, adminId, body);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Review rejected successfully",
      data: result
    });
  });
  /**
   * Delete a comment
   */
  deleteComment = catchAsync(async (req, res) => {
    const params = approveReviewSchema.parse(req.params);
    const body = deleteCommentSchema2.parse({ ...req.body, id: params.id });
    const adminId = req.user?.id || "";
    const result = await moderationService.deleteComment(body.id, adminId, body);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Comment deleted successfully",
      data: result
    });
  });
  /**
   * Suspend a user
   */
  suspendUser = catchAsync(async (req, res) => {
    const body = suspendUserSchema.parse(req.body);
    const adminId = req.user?.id || "";
    const result = await moderationService.suspendUser(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User suspended successfully",
      data: result
    });
  });
  /**
   * Unsuspend a user
   */
  unsuspendUser = catchAsync(async (req, res) => {
    const body = unsuspendUserSchema.parse(req.params);
    const adminId = req.user?.id || "";
    const result = await moderationService.unsuspendUser(body.userId, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User unsuspended successfully",
      data: result
    });
  });
  /**
   * Get moderation queue
   */
  getModerationQueue = catchAsync(async (req, res) => {
    const query = getModerationQueueQuerySchema.parse(req.query);
    const result = await moderationService.getModerationQueue(
      query.limit,
      query.page,
      query.status,
      query.type,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Moderation queue fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Flag content for review
   */
  flagContent = catchAsync(async (req, res) => {
    const body = flagContentSchema.parse(req.body);
    const userId = req.user?.id || "";
    const result = await moderationService.flagContent(userId, body);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Content flagged successfully",
      data: result
    });
  });
  /**
   * Get flagged content
   */
  getFlaggedContent = catchAsync(async (req, res) => {
    const query = getFlaggedContentQuerySchema.parse(req.query);
    const result = await moderationService.getFlaggedContent(
      query.limit,
      query.page,
      query.contentType,
      query.status,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Flagged content fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Resolve a flag
   */
  resolveFlag = catchAsync(async (req, res) => {
    const flagId = Array.isArray(req.params.flagId) ? req.params.flagId[0] : req.params.flagId;
    const body = resolveFlagSchema.parse(req.body);
    const adminId = req.user?.id;
    if (!flagId) {
      throw new AppError_default(400, "Flag ID is required");
    }
    if (!adminId) {
      throw new AppError_default(401, "Authentication required");
    }
    const result = await moderationService.resolveFlag(flagId, adminId, { ...body, flagId });
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Flag resolved successfully",
      data: result
    });
  });
  /**
   * Get moderation history
   */
  getModerationHistory = catchAsync(async (req, res) => {
    const query = getModerationHistoryQuerySchema.parse(req.query);
    const result = await moderationService.getModerationHistory(
      query.limit,
      query.page,
      query.userId,
      query.action,
      query.sortBy,
      query.order
    );
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Moderation history fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get moderation stats
   */
  getStats = catchAsync(async (req, res) => {
    const result = await moderationService.getContentModerationStats();
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Moderation stats fetched successfully",
      data: result
    });
  });
};
var moderationController = new ModerationController();

// src/app/module/moderation/moderation.route.ts
var router9 = Router9();
router9.post("/flags", requireAuth, moderationController.flagContent);
router9.post("/reviews/:id/approve", checkRole("ADMIN"), moderationController.approveReview);
router9.post("/reviews/:id/reject", checkRole("ADMIN"), moderationController.rejectReview);
router9.delete("/comments/:id", checkRole("ADMIN"), moderationController.deleteComment);
router9.post("/users/suspend", checkRole("ADMIN"), moderationController.suspendUser);
router9.post("/users/:userId/unsuspend", checkRole("ADMIN"), moderationController.unsuspendUser);
router9.get("/queue", checkRole("ADMIN"), moderationController.getModerationQueue);
router9.get("/flags", checkRole("ADMIN"), moderationController.getFlaggedContent);
router9.post("/flags/:flagId/resolve", checkRole("ADMIN"), moderationController.resolveFlag);
router9.get("/history", checkRole("ADMIN"), moderationController.getModerationHistory);
router9.get("/stats", checkRole("ADMIN"), moderationController.getStats);
var moderation_route_default = router9;

// src/app/module/analytics/analytics.route.ts
import { Router as Router10 } from "express";

// src/app/module/analytics/analytics.service.ts
var AnalyticsService = class {
  /**
   * Get dashboard overview stats
   */
  async getDashboardStats(query) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : this.getDateRange(query.period).startDate;
      const endDate = query.endDate ? new Date(query.endDate) : this.getDateRange(query.period).endDate;
      const [totalUsers, activeUsers, totalMovies, totalReviews, totalPayments, totalRevenue, activeSubscriptions] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.movie.count({ where: { isDeleted: false } }),
        prisma.review.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.payment.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.payment.aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _sum: { amount: true }
        }),
        prisma.subscription.count({
          where: { status: "ACTIVE" }
        })
      ]);
      return {
        overview: {
          totalUsers,
          activeUsers,
          totalMovies,
          totalReviews,
          totalPayments,
          totalRevenue: totalRevenue._sum.amount || 0,
          activeSubscriptions
        },
        period: { startDate, endDate }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch dashboard stats");
    }
  }
  /**
   * Get user statistics
   */
  async getUserStats(limit = 10, page = 1, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const [total, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: order },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            _count: {
              select: {
                reviews: true,
                comments: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: users,
        pagination: { total, page, limit, pages }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch user stats");
    }
  }
  /**
   * Get movie statistics
   */
  async getMovieStats(limit = 10, page = 1, sortBy = "rating", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const [total, movies] = await Promise.all([
        prisma.movie.count({ where: { isDeleted: false } }),
        prisma.movie.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
          orderBy: { [sortBy]: order },
          select: {
            id: true,
            title: true,
            slug: true,
            averageRating: true,
            releaseYear: true,
            _count: {
              select: {
                reviews: true,
                watchlists: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: movies,
        pagination: { total, page, limit, pages }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch movie stats");
    }
  }
  /**
   * Get payment statistics
   */
  async getPaymentStats(query) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
      const endDate = query.endDate ? new Date(query.endDate) : /* @__PURE__ */ new Date();
      const whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      };
      if (query.paymentMethod) {
        whereClause.paymentMethod = query.paymentMethod;
      }
      const [totalAmountResult, totalCount, successfulPayments, failedPayments, refundedPayments, paymentsByMethod] = await Promise.all([
        prisma.payment.aggregate({
          where: whereClause,
          _sum: { amount: true }
        }),
        prisma.payment.count({ where: whereClause }),
        prisma.payment.count({
          where: { ...whereClause, status: "COMPLETED" }
        }),
        prisma.payment.count({
          where: { ...whereClause, status: "FAILED" }
        }),
        prisma.payment.count({
          where: { ...whereClause, status: "REFUNDED" }
        }),
        prisma.payment.groupBy({
          by: ["paymentMethod"],
          where: whereClause,
          _count: true,
          _sum: { amount: true }
        })
      ]);
      return {
        summary: {
          totalAmount: totalAmountResult._sum.amount || 0,
          totalCount,
          successfulPayments,
          failedPayments,
          refundedPayments
        },
        byMethod: paymentsByMethod,
        period: { startDate, endDate }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch payment stats");
    }
  }
  /**
   * Get subscription statistics
   */
  async getSubscriptionStats() {
    try {
      const [totalSubscriptions, activeSubscriptions, cancelledSubscriptions, subscriptionsByTier] = await Promise.all([
        prisma.subscription.count(),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
        prisma.subscription.count({ where: { status: "CANCELLED" } }),
        prisma.subscription.groupBy({
          by: ["tierId"],
          _count: true,
          where: { status: "ACTIVE" }
        })
      ]);
      return {
        total: totalSubscriptions,
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        byTier: subscriptionsByTier
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch subscription stats");
    }
  }
  /**
   * Get engagement statistics
   */
  async getEngagementStats(query) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : this.getDateRange(query.period).startDate;
      const endDate = query.endDate ? new Date(query.endDate) : this.getDateRange(query.period).endDate;
      const [totalReviews, totalLikes, totalComments, totalWatchlistAdds] = await Promise.all([
        prisma.review.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.like.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.comment.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.watchlist.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })
      ]);
      return {
        reviews: totalReviews,
        likes: totalLikes,
        comments: totalComments,
        watchlistAdds: totalWatchlistAdds,
        period: { startDate, endDate }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch engagement stats");
    }
  }
  /**
   * Get content performance (top movies)
   */
  async getContentPerformance() {
    try {
      const topMovies = await prisma.movie.findMany({
        where: { isDeleted: false },
        take: 10,
        orderBy: { averageRating: "desc" },
        select: {
          id: true,
          title: true,
          averageRating: true,
          _count: {
            select: {
              reviews: true,
              watchlists: true
            }
          }
        }
      });
      return {
        topMovies
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch content performance");
    }
  }
  /**
   * Get user growth over time
   */
  async getUserGrowth(period) {
    try {
      const { startDate, endDate } = this.getDateRange(period);
      const userGrowth = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          createdAt: true
        }
      });
      const groupedByDate = {};
      userGrowth.forEach((user) => {
        const dateKey = user.createdAt.toISOString().split("T")[0];
        groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + 1;
      });
      return {
        period,
        data: groupedByDate
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch user growth");
    }
  }
  /**
   * Get revenue statistics
   */
  async getRevenueStats(query) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1e3);
      const endDate = query.endDate ? new Date(query.endDate) : /* @__PURE__ */ new Date();
      const [totalRevenue, completedPayments, subscriptionRevenue, averageTransactionValue] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _sum: { amount: true }
        }),
        prisma.payment.count({
          where: {
            status: "COMPLETED",
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }),
        prisma.subscription.aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: { _all: true }
        }),
        prisma.payment.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _avg: { amount: true }
        })
      ]);
      return {
        totalRevenue: totalRevenue._sum.amount || 0,
        completedPayments,
        averageTransactionValue: averageTransactionValue._avg.amount || 0,
        period: { startDate, endDate }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch revenue stats");
    }
  }
  /**
   * Helper method to calculate date range
   */
  getDateRange(period) {
    const endDate = /* @__PURE__ */ new Date();
    const startDate = /* @__PURE__ */ new Date();
    switch (period) {
      case "DAY":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "WEEK":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "MONTH":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "YEAR":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    return { startDate, endDate };
  }
};
var analyticsService = new AnalyticsService();

// src/app/module/analytics/analytics.validation.ts
import { z as z10 } from "zod";
var getAnalyticsQuerySchema = z10.object({
  startDate: z10.string().datetime().optional(),
  endDate: z10.string().datetime().optional(),
  period: z10.enum(["DAY", "WEEK", "MONTH", "YEAR"]).default("MONTH")
});
var getUserStatsQuerySchema = z10.object({
  limit: z10.coerce.number().int().min(1).max(100).default(10),
  page: z10.coerce.number().int().min(1).default(1),
  sortBy: z10.enum(["createdAt", "reviewCount", "subscriptionStatus"]).default("createdAt"),
  order: z10.enum(["asc", "desc"]).default("desc")
});
var getMovieStatsQuerySchema = z10.object({
  limit: z10.coerce.number().int().min(1).max(100).default(10),
  page: z10.coerce.number().int().min(1).default(1),
  sortBy: z10.enum(["rating", "reviewCount", "watchlistCount"]).default("rating"),
  order: z10.enum(["asc", "desc"]).default("desc")
});
var getPaymentStatsQuerySchema = z10.object({
  startDate: z10.string().datetime().optional(),
  endDate: z10.string().datetime().optional(),
  paymentMethod: z10.string().optional()
});

// src/app/module/analytics/analytics.controller.ts
var AnalyticsController = class {
  /**
   * Get dashboard overview
   */
  getDashboard = catchAsync(async (req, res) => {
    const query = getAnalyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getDashboardStats(query);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Dashboard stats fetched successfully",
      data: result
    });
  });
  /**
   * Get user statistics
   */
  getUserStats = catchAsync(async (req, res) => {
    const query = getUserStatsQuerySchema.parse(req.query);
    const result = await analyticsService.getUserStats(query.limit, query.page, query.sortBy, query.order);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User stats fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get movie statistics
   */
  getMovieStats = catchAsync(async (req, res) => {
    const query = getMovieStatsQuerySchema.parse(req.query);
    const result = await analyticsService.getMovieStats(query.limit, query.page, query.sortBy, query.order);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie stats fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get payment statistics
   */
  getPaymentStats = catchAsync(async (req, res) => {
    const query = getPaymentStatsQuerySchema.parse(req.query);
    const result = await analyticsService.getPaymentStats(query);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Payment stats fetched successfully",
      data: result
    });
  });
  /**
   * Get subscription statistics
   */
  getSubscriptionStats = catchAsync(async (req, res) => {
    const result = await analyticsService.getSubscriptionStats();
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Subscription stats fetched successfully",
      data: result
    });
  });
  /**
   * Get engagement statistics
   */
  getEngagementStats = catchAsync(async (req, res) => {
    const query = getAnalyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getEngagementStats(query);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Engagement stats fetched successfully",
      data: result
    });
  });
  /**
   * Get content performance
   */
  getContentPerformance = catchAsync(async (req, res) => {
    const result = await analyticsService.getContentPerformance();
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Content performance fetched successfully",
      data: result
    });
  });
  /**
   * Get user growth
   */
  getUserGrowth = catchAsync(async (req, res) => {
    const { period = "MONTH" } = req.query;
    const result = await analyticsService.getUserGrowth(period);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User growth fetched successfully",
      data: result
    });
  });
  /**
   * Get revenue statistics
   */
  getRevenueStats = catchAsync(async (req, res) => {
    const query = getPaymentStatsQuerySchema.parse(req.query);
    const result = await analyticsService.getRevenueStats(query);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Revenue stats fetched successfully",
      data: result
    });
  });
};
var analyticsController = new AnalyticsController();

// src/app/module/analytics/analytics.route.ts
var router10 = Router10();
router10.get("/analytics", checkRole("ADMIN"), analyticsController.getDashboard);
router10.get("/analytics/users", checkRole("ADMIN"), analyticsController.getUserStats);
router10.get("/analytics/movies", checkRole("ADMIN"), analyticsController.getMovieStats);
router10.get("/analytics/payments", checkRole("ADMIN"), analyticsController.getPaymentStats);
router10.get("/analytics/subscriptions", checkRole("ADMIN"), analyticsController.getSubscriptionStats);
router10.get("/analytics/engagement", checkRole("ADMIN"), analyticsController.getEngagementStats);
router10.get("/analytics/content-performance", checkRole("ADMIN"), analyticsController.getContentPerformance);
router10.get("/analytics/user-growth", checkRole("ADMIN"), analyticsController.getUserGrowth);
router10.get("/analytics/revenue", checkRole("ADMIN"), analyticsController.getRevenueStats);
var analytics_route_default = router10;

// src/app/module/admin/admin.route.ts
import { Router as Router11 } from "express";

// src/app/module/admin/admin.service.ts
var AdminService = class {
  /**
   * Get all users (admin view)
   */
  async getAllUsers(limit = 20, page = 1, role, status8, sortBy = "createdAt", order = "desc") {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {};
      if (role) whereClause.role = role;
      if (status8) whereClause.status = status8;
      const [total, users] = await Promise.all([
        prisma.user.count({ where: whereClause }),
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { [sortBy]: order },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            _count: {
              select: {
                reviews: true
              }
            }
          }
        })
      ]);
      const pages = Math.ceil(total / limit);
      return {
        data: users,
        pagination: { total, page, limit, pages }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch users");
    }
  }
  /**
   * Get a single user
   */
  async getUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          sessions: {
            select: {
              id: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              reviews: true,
              comments: true,
              likes: true,
              watchlists: true
            }
          }
        }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to fetch user");
    }
  }
  /**
   * Update user role
   */
  async updateUserRole(input, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role }
      });
      await this.logAdminAction(adminId, `Changed role to ${input.role}`, input.userId);
      return updated;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update user role");
    }
  }
  /**
   * Update user status
   */
  async updateUserStatus(input, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { status: input.status }
      });
      await this.logAdminAction(adminId, `Changed status to ${input.status}`, input.userId);
      return updated;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update user status");
    }
  }
  /**
   * Promote user to admin
   */
  async promoteToAdmin(input, adminId) {
    try {
      let user = await prisma.user.findUnique({
        where: { email: input.email }
      });
      if (!user) {
        const { v4: uuidv4 } = __require("uuid");
        user = await prisma.user.create({
          data: {
            id: uuidv4(),
            email: input.email,
            name: input.name || input.email.split("@")[0],
            role: "ADMIN",
            status: "ACTIVE",
            emailVerified: true
          }
        });
      } else if (user.role === "ADMIN") {
        throw new AppError_default(400, "User is already an admin");
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" }
        });
      }
      await this.logAdminAction(adminId, `Promoted user to ADMIN`, user.id);
      return user;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to promote user");
    }
  }
  /**
   * Update user info (admin can update any user)
   */
  async updateUser(input, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: {
          name: input.name
        }
      });
      await this.logAdminAction(adminId, "Updated user info", input.userId);
      return updated;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to update user");
    }
  }
  /**
   * Delete a user (soft delete)
   */
  async deleteUser(input, adminId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      });
      if (!user) {
        throw new AppError_default(404, "User not found");
      }
      const deleted = await prisma.user.update({
        where: { id: input.userId },
        data: {
          isDeleted: true,
          status: "DELETED"
        }
      });
      await this.logAdminAction(adminId, `Deleted user - Reason: ${input.reason || "No reason provided"}`, input.userId);
      return deleted;
    } catch (error) {
      if (error instanceof AppError_default) throw error;
      throw new AppError_default(500, "Failed to delete user");
    }
  }
  /**
   * Get admin action log
   */
  async getAdminLog(limit = 50, page = 1) {
    try {
      return {
        data: [],
        pagination: { total: 0, page, limit, pages: 0 }
      };
    } catch (error) {
      throw new AppError_default(500, "Failed to fetch admin log");
    }
  }
  /**
   * Get system health/status
   */
  async getSystemHealth() {
    try {
      const [userCount, movieCount, reviewCount, paymentCount] = await Promise.all([
        prisma.user.count(),
        prisma.movie.count(),
        prisma.review.count(),
        prisma.payment.count()
      ]);
      return {
        status: "healthy",
        timestamp: /* @__PURE__ */ new Date(),
        database: {
          users: userCount,
          movies: movieCount,
          reviews: reviewCount,
          payments: paymentCount
        }
      };
    } catch (error) {
      throw new AppError_default(500, "System health check failed");
    }
  }
  /**
   * Private method to log admin actions
   */
  async logAdminAction(adminId, action, targetUserId) {
    try {
      console.log(`[ADMIN_ACTION] ${adminId}: ${action}${targetUserId ? ` (target: ${targetUserId})` : ""}`);
    } catch (error) {
      console.error("Failed to log admin action:", error);
    }
  }
};
var adminService = new AdminService();

// src/app/module/admin/admin.validation.ts
import { z as z11 } from "zod";
var updateUserRoleSchema = z11.object({
  userId: z11.string().uuid(),
  role: z11.enum(["USER", "ADMIN"])
});
var updateUserStatusSchema = z11.object({
  userId: z11.string().uuid(),
  status: z11.enum(["ACTIVE", "BLOCKED", "DELETED"])
});
var getUsersQuerySchema = z11.object({
  limit: z11.coerce.number().int().min(1).max(100).default(20),
  page: z11.coerce.number().int().min(1).default(1),
  role: z11.enum(["USER", "ADMIN"]).optional(),
  status: z11.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
  sortBy: z11.enum(["createdAt", "name"]).default("createdAt"),
  order: z11.enum(["asc", "desc"]).default("desc")
});
var getUserSchema = z11.object({
  userId: z11.string().uuid()
});
var createAdminSchema = z11.object({
  email: z11.string().email(),
  name: z11.string().optional()
});
var updateUserSchema = z11.object({
  userId: z11.string().uuid(),
  name: z11.string().optional()
});
var deleteUserSchema = z11.object({
  userId: z11.string().uuid(),
  reason: z11.string().optional()
});

// src/app/module/admin/admin.controller.ts
var AdminController = class {
  /**
   * Get all users
   */
  getAllUsers = catchAsync(async (req, res) => {
    const query = getUsersQuerySchema.parse(req.query);
    const result = await adminService.getAllUsers(query.limit, query.page, query.role, query.status, query.sortBy, query.order);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get user details
   */
  getUser = catchAsync(async (req, res) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const result = await adminService.getUser(userId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: result
    });
  });
  /**
   * Update user role
   */
  updateUserRole = catchAsync(async (req, res) => {
    const body = updateUserRoleSchema.parse(req.body);
    const adminId = req.user?.id || "";
    const result = await adminService.updateUserRole(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User role updated successfully",
      data: result
    });
  });
  /**
   * Update user status
   */
  updateUserStatus = catchAsync(async (req, res) => {
    const body = updateUserStatusSchema.parse(req.body);
    const adminId = req.user?.id || "";
    const result = await adminService.updateUserStatus(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User status updated successfully",
      data: result
    });
  });
  /**
   * Promote user to admin
   */
  promoteToAdmin = catchAsync(async (req, res) => {
    const body = createAdminSchema.parse(req.body);
    const adminId = req.user?.id || "";
    const result = await adminService.promoteToAdmin(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "User promoted to admin successfully",
      data: result
    });
  });
  /**
   * Update user
   */
  updateUser = catchAsync(async (req, res) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const params = { userId };
    const body = updateUserSchema.parse({ ...req.body, ...params });
    const adminId = req.user?.id || "";
    const result = await adminService.updateUser(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result
    });
  });
  /**
   * Delete user
   */
  deleteUser = catchAsync(async (req, res) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const params = { userId };
    const body = deleteUserSchema.parse({ ...req.body, ...params });
    const adminId = req.user?.id || "";
    const result = await adminService.deleteUser(body, adminId);
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: result
    });
  });
  /**
   * Get admin action log
   */
  getAdminLog = catchAsync(async (req, res) => {
    const { limit = 50, page = 1 } = req.query;
    const result = await adminService.getAdminLog(Number(limit), Number(page));
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Admin log fetched successfully",
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages
      }
    });
  });
  /**
   * Get system health
   */
  getSystemHealth = catchAsync(async (req, res) => {
    const result = await adminService.getSystemHealth();
    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "System health fetched successfully",
      data: result
    });
  });
};
var adminController = new AdminController();

// src/app/module/admin/admin.route.ts
var router11 = Router11();
router11.get("/admin/users", checkRole("ADMIN"), adminController.getAllUsers);
router11.get("/admin/users/:userId", checkRole("ADMIN"), adminController.getUser);
router11.patch("/admin/users/:userId/role", checkRole("ADMIN"), adminController.updateUserRole);
router11.patch("/admin/users/:userId/status", checkRole("ADMIN"), adminController.updateUserStatus);
router11.post("/admin/users/promote", checkRole("ADMIN"), adminController.promoteToAdmin);
router11.patch("/admin/users/:userId", checkRole("ADMIN"), adminController.updateUser);
router11.delete("/admin/users/:userId", checkRole("ADMIN"), adminController.deleteUser);
router11.get("/admin/logs", checkRole("ADMIN"), adminController.getAdminLog);
router11.get("/admin/health", checkRole("ADMIN"), adminController.getSystemHealth);
var admin_route_default = router11;

// src/app/module/user-profile/user-profile.route.ts
import { Router as Router12 } from "express";

// src/app/module/user-profile/user-profile.service.ts
var UserProfileService = class {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        gender: true,
        dateOfBirth: true
      }
    });
    if (!user) {
      throw new AppError_default(404, "User not found");
    }
    return user;
  }
  async updateProfile(userId, payload) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    if (!user) {
      throw new AppError_default(404, "User not found");
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name,
        image: payload.image === "" ? null : payload.image,
        phone: payload.phone === "" ? null : payload.phone,
        gender: payload.gender === "" ? null : payload.gender,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        gender: true,
        dateOfBirth: true
      }
    });
    return updated;
  }
};
var userProfileService = new UserProfileService();

// src/app/module/user-profile/user-profile.validation.ts
import { z as z12 } from "zod";
var updateProfileSchema = z12.object({
  body: z12.object({
    name: z12.string().min(1).max(120).optional(),
    image: z12.string().refine(
      (value) => value === "" || value.startsWith("data:image/") || /^https?:\/\//.test(value),
      "Invalid image format"
    ).optional(),
    phone: z12.string().min(5).max(30).optional().or(z12.literal("")),
    gender: z12.enum(["Male", "Female", "Other"]).optional().or(z12.literal("")),
    dateOfBirth: z12.string().optional().or(z12.literal(""))
  })
});

// src/app/module/user-profile/user-profile.controller.ts
var UserProfileController = class {
  static getProfile = catchAsync(async (req, res) => {
    const profile = await userProfileService.getProfile(req.user.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Profile retrieved successfully",
      data: profile
    });
  });
  static updateProfile = catchAsync(async (req, res) => {
    const validated = updateProfileSchema.parse({ body: req.body });
    const updated = await userProfileService.updateProfile(req.user.id, validated.body);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Profile updated successfully",
      data: updated
    });
  });
};

// src/app/module/user-profile/user-profile.route.ts
var router12 = Router12();
router12.get("/user/profile", requireAuth, UserProfileController.getProfile);
router12.patch("/user/profile", requireAuth, UserProfileController.updateProfile);
var user_profile_route_default = router12;

// src/app/routes/index.ts
var router13 = Router13();
router13.use("/auth", AuthRoutes);
router13.use("/", movies_route_default);
router13.use("/", reviews_route_default);
router13.use("/", comments_route_default);
router13.use("/", likes_route_default);
router13.use("/watchlist", watchlist_route_default);
router13.use("/", payments_route_default);
router13.use("/", subscriptions_route_default);
router13.use("/moderation", moderation_route_default);
router13.use("/", analytics_route_default);
router13.use("/", admin_route_default);
router13.use("/", user_profile_route_default);
var IndexRoutes = router13;

// src/app/middleware/globalErrorHandler.ts
import status6 from "http-status";
import z13 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status5 from "http-status";
var handleZodError = (err) => {
  const statusCode = status5.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (env.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z13.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status6.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: env.NODE_ENV === "development" ? err : void 0,
    stack: env.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status7 from "http-status";
var notFound = (req, res) => {
  res.status(status7.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express();
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);
var allowedOrigins = [
  env.FRONTEND_URL || "http://localhost:3000"
  // env.PROD_APP_URL, // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.use(cookieParser());
app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "CineTube API is working......"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
