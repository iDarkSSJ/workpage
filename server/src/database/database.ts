import { drizzle } from "drizzle-orm/node-postgres"
import * as authSchema from "./auth-schema"
import * as businessSchema from "./schema"
import "dotenv/config"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...businessSchema },
})
