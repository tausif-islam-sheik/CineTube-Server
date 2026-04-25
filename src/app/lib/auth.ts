import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { oAuthProxy } from "better-auth/plugins";
import { Role, UserStatus } from "../../generated/enums";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  baseURL: process.env.FRONTEND_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        // Better Auth expects $2a$ format, bcryptjs might produce $2b$
        return hashed.replace("$2b$", "$2a$");
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        // Normalize hash format for comparison
        const normalizedHash = hash.replace("$2b$", "$2a$");
        return bcrypt.compare(password, normalizedHash);
      },
    },
    // Note: Password reset is handled manually in auth.service.ts
    // to avoid Better Auth's API limitations
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },

      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },

      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
    },
  },


  account: { skipStateCookieCheck: true }, // solved redirect issue
  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          partitioned: process.env.NODE_ENV === "production",
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          partitioned: process.env.NODE_ENV === "production",
        },
      },
    },
  },

  plugins: [oAuthProxy()],
});