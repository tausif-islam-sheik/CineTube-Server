import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { oAuthProxy } from "better-auth/plugins";
import { Role, UserStatus } from "../../generated/enums";

export const auth = betterAuth({
  baseURL: process.env.FRONTEND_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
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
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },


  account: { skipStateCookieCheck: true }, // solved redirect issue
  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  plugins: [oAuthProxy()],
});
