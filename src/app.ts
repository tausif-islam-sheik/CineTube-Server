import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IndexRoutes } from "./app/routes/index.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { notFound } from "./app/middleware/notFound.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth.js";
import { paymentController } from "./app/module/payments/payments.controller.js";
import { env } from "./app/config/env.js";

const app: Application = express();

// Stripe Webhook needs the raw body to verify signature
// Must be registered BEFORE express.json()
app.post(
  "/webhook", 
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);


// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  env.FRONTEND_URL || "http://localhost:3000",
  // env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);


app.use(express.json());
app.use(cookieParser());

// Better Auth handler — regex used to avoid path-to-regexp v8 wildcard issues in Express 5
app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "CineTube API is working......",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
