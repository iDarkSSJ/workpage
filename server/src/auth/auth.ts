import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../database/database"
import * as authSchema from "../database/auth-schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // Default
    maxPasswordLength: 32, // Custom Limit - Jose Luis
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  trustedOrigins: ["http://localhost:5173"], // TODO: USE .ENV INSTEAD
})
