import { config } from "dotenv"
config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
})
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/auth-schema.ts", "./src/database/schema/index.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
