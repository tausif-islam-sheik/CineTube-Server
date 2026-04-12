import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import { paymentController } from "./app/module/payments/payments.controller";

const app: Application = express();

// Stripe Webhook needs the raw body to verify signature
// Must be registered BEFORE express.json()
app.post(
  "/webhook", 
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

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
