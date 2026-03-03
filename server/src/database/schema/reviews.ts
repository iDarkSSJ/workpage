import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
  unique,
} from "drizzle-orm/pg-core"
import { user } from "../auth-schema"
import { contract } from "./projects"

export const review = pgTable(
  "review",
  {
    id: text("id").primaryKey(),
    contractId: text("contract_id")
      .notNull()
      .references(() => contract.id, { onDelete: "cascade" }),
    reviewerId: text("reviewer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    revieweeId: text("reviewee_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull(), // 1.00 – 5.00
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("review_unique").on(t.contractId, t.reviewerId), // 1 review por persona por contrato
    index("review_reviewee_idx").on(t.revieweeId),
  ],
)
