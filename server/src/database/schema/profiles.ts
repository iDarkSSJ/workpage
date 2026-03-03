import {
  pgTable,
  text,
  timestamp,
  numeric,
  date,
  index,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core"
import { user } from "../auth-schema"

export const skill = pgTable("skill", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
})

export const freelancerProfile = pgTable("freelancer_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio"),
  category: text("category"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  country: text("country"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const contractorProfile = pgTable("contractor_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  companyName: text("company_name"),
  bio: text("bio"),
  country: text("country"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})


export const freelancerSkill = pgTable(
  "freelancer_skill",
  {
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skill.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.freelancerId, t.skillId] })],
)

export const freelancerExperience = pgTable(
  "freelancer_experience",
  {
    id: text("id").primaryKey(),
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    company: text("company").notNull(),
    description: text("description"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"), // NULL = empleo actual
  },
  (t) => [index("experience_freelancer_idx").on(t.freelancerId)],
)

export const freelancerCertification = pgTable(
  "freelancer_certification",
  {
    id: text("id").primaryKey(),
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    institution: text("institution").notNull(),
    issuedDate: date("issued_date"),
    url: text("url"),
  },
  (t) => [index("certification_freelancer_idx").on(t.freelancerId)],
)

export const featuredProject = pgTable(
  "featured_project",
  {
    id: text("id").primaryKey(),
    freelancerId: text("freelancer_id")
      .notNull()
      .references(() => freelancerProfile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    projectUrl: text("project_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("featured_project_freelancer_idx").on(t.freelancerId)],
)
