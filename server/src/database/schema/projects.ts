import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core"
import { skill, freelancerProfile, contractorProfile } from "./profiles"

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    contractorId: text("contractor_id")
      .notNull()
      .references(() => contractorProfile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    budgetType: text("budget_type").notNull(), // "fixed" | "hourly"
    budgetMin: numeric("budget_min", { precision: 10, scale: 2 }),
    budgetMax: numeric("budget_max", { precision: 10, scale: 2 }),
    status: text("status").notNull().default("open"), // "open" | "in_progress" | "closed" | "completed"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("project_contractor_idx").on(t.contractorId),
    index("project_status_idx").on(t.status),
  ],
)

// N:M pivot: project ↔ skill
export const projectSkill = pgTable(
  "project_skill",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skill.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.skillId] })],
)

export const proposal = pgTable(
  "proposal",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter").notNull(),
    bidAmount: numeric("bid_amount", { precision: 10, scale: 2 }).notNull(),
    bidType: text("bid_type").notNull(), // "fixed" | "hourly"
    status: text("status").notNull().default("pending"), // "pending" | "accepted" | "rejected" | "withdrawn"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("proposal_unique").on(t.projectId, t.freelancerId), // 1 propuesta por freelancer por proyecto
    index("proposal_project_idx").on(t.projectId),
    index("proposal_freelancer_idx").on(t.freelancerId),
  ],
)

export const contract = pgTable(
  "contract",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id")
      .notNull()
      .unique()
      .references(() => proposal.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    contractorId: text("contractor_id")
      .notNull()
      .references(() => contractorProfile.id, { onDelete: "cascade" }),
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    agreedAmount: numeric("agreed_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    status: text("status").notNull().default("active"), // "active" | "completed" | "cancelled"
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (t) => [
    index("contract_contractor_idx").on(t.contractorId),
    index("contract_freelancer_idx").on(t.freelancerId),
  ],
)
