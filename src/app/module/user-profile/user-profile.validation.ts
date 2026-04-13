import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120).optional(),
    image: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          value.startsWith("data:image/") ||
          /^https?:\/\//.test(value),
        "Invalid image format"
      )
      .optional(),
    phone: z.string().min(5).max(30).optional().or(z.literal("")),
    gender: z.enum(["Male", "Female", "Other"]).optional().or(z.literal("")),
    dateOfBirth: z.string().optional().or(z.literal("")),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
