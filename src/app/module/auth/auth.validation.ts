import { z } from "zod";

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
