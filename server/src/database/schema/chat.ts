import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core"
import { user } from "../auth-schema"
import { project } from "./projects"

export const conversation = pgTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "set null",
    }), // NULL = chat libre
    participantAId: text("participant_a_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    participantBId: text("participant_b_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("conversation_unique").on(
      t.projectId,
      t.participantAId,
      t.participantBId,
    ),
    index("conversation_participant_a_idx").on(t.participantAId),
    index("conversation_participant_b_idx").on(t.participantBId),
  ],
)

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("message_conversation_idx").on(t.conversationId),
    index("message_sender_idx").on(t.senderId),
  ],
)
