import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as authSchema from "./auth-schema"
import * as businessSchema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...businessSchema },
})
