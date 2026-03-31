import { db } from "../database/database"
import * as schema from "../database/schema"
import { ilike, ne } from "drizzle-orm"
import crypto from "crypto"

const CUSTOM_CATEGORY = "Others"

export const getDefaultSkills = async () => {
  return db.query.skill.findMany({
    where: ne(schema.skill.category, CUSTOM_CATEGORY),
    orderBy: (skill, { asc }) => [asc(skill.category), asc(skill.name)],
  })
}

export const searchSkills = async (query: string) => {
  return db.query.skill.findMany({
    where: ilike(schema.skill.name, `%${query}%`),
    orderBy: (skill, { asc }) => [asc(skill.name)],
    limit: 20,
  })
}

export const findOrCreateSkill = async (name: string) => {
  const existing = await db.query.skill.findFirst({
    where: ilike(schema.skill.name, name),
  })

  if (existing) {
    return existing
  }

  const [created] = await db
    .insert(schema.skill)
    .values({
      id: crypto.randomUUID(),
      name,
      category: CUSTOM_CATEGORY,
    })
    .returning()

  return created
}
