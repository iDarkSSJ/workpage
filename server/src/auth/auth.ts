import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../database/database"
import * as authSchema from "../database/auth-schema"
import { sendEmail } from "../email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // Default
    maxPasswordLength: 32, // Custom Limit - Jose Luis
    sendResetPassword: async ({ user, url }) =>
      sendEmail({ resetUrl: url, userEmail: user.email }),
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  trustedOrigins: ["http://localhost:5173"], // TODO: USE .ENV INSTEAD
})
