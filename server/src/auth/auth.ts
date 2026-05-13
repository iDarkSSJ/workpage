import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../database/database"
import * as authSchema from "../database/auth-schema"
import { sendResetPasswordEmail, sendVerificationEmail } from "../email/email"
import { eq } from "drizzle-orm"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailVerification: {
    afterEmailVerification: async ({ id }) => {
      const identifier = `verify-email-${id}`

      await db
        .delete(authSchema.verification)
        .where(eq(authSchema.verification.identifier, identifier))
    },
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        user,
        verifyUrl: url,
      })
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // Default
    maxPasswordLength: 32, // Custom Limit - Jose Luis
    sendResetPassword: async ({ user, url }) =>
      sendResetPasswordEmail({ resetUrl: url, userEmail: user.email }),
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        input: true,
      },
    },
  },
  trustedOrigins: [process.env.CLIENT_URL || ""],
})
