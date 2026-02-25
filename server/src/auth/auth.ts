import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../database/database"
import * as authSchema from "../database/auth-schema"
import {
  sendDeleteAccVerEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../email/email"
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
        verifyUrl: url,
        user,
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
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true, //  This property defaults to true, meaning the field will be part of the user input during operations like registration. ↓↓↓
        // https://www.better-auth.com/docs/concepts/typescript#the-input-property
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        sendDeleteAccVerEmail({
          userEmail: user.email,
          userName: user.name,
          confirmUrl: url,
        })
      },
    },
  },
  trustedOrigins: [process.env.CLIENT_URL], 
})
