import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { user } from "../database/auth-schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

import { findOrCreateSkill } from "../services/skills.service"
import {
  createFreelancerProfile,
  updateFreelancerProfile,
} from "../services/freelancer.service"
import { createExperiences } from "../services/experiences.service"
import {
  experienceSchema,
  freelancerSchema,
} from "../schemas/profile.schema"

describe("Pruebas de Integración: Flujo de Perfil Freelancer (RAP 14)", () => {
  // algunos estados para simular el seguimiento de un flujo de integracion
  const testUserId = crypto.randomUUID()
  let testProfileId = ""
  let testSkillId = ""

  // preparamos la base de datos con un usuario falso, como si de un usuario real se tratara
  beforeAll(async () => {
    await db.insert(user).values({
      id: testUserId,
      email: "testuser001@gmail.com",
      name: "Usuario Integracion",
      // password no existe en la tabla user, se guardan en la tabla account
    })
  })

  // despues de realizar las pruebas, limpiamos la base de datos
  afterAll(async () => {
    await db.delete(user).where(eq(user.id, testUserId))
  })

  // desde aqui empezamos a testear si los services y los schemas funcionan correctamente
  it("Caso 001: Debería crear un perfil en la BD vinculado al usuario", async () => {
    const createdProfile = await createFreelancerProfile(testUserId, {
      country: "CO",
    })

    expect(createdProfile).toBeDefined()
    expect(createdProfile.userId).toBe(testUserId)

    testProfileId = createdProfile.id
  })

  it("Caso 002: El servicio debería insertar una nueva habilidad en la BD", async () => {
    const skillName = "Vitest Integration Testing"
    const skill = await findOrCreateSkill(skillName)

    expect(skill).toHaveProperty("id")
    expect(skill.name).toBe(skillName)
    expect(skill.category).toBe("Others")

    testSkillId = skill.id
  })

  it("Caso 003: Debería actualizar el perfil y registrar la relación en freelancer_skill", async () => {
    const payload = {
      bio: "Especialista en pruebas de integración con Node y PostgreSQL.",
      category: "QA Automation",
      hourlyRate: 40,
      country: "CO",
      skills: [testSkillId],
    }

    const validData = freelancerSchema.parse(payload)

    const updatedProfile = await updateFreelancerProfile(testUserId, validData)

    expect(updatedProfile).toBeDefined()
    expect(updatedProfile.bio).toBe(payload.bio)

    // Verificamos la tabla de relacion freelancer_skill
    const savedSkills = await db.query.freelancerSkill.findMany({
      where: eq(schema.freelancerSkill.freelancerId, testProfileId),
    })

    expect(savedSkills.length).toBe(1)
    expect(savedSkills[0].skillId).toBe(testSkillId)
  })

  it("Caso 004: Debería bloquear el flujo si se intenta procesar una experiencia erronea", async () => {
    // Payload erroneo (Falta el título, que es obligatorio)
    const badPayload = {
      title: "",
      company: "SENA",
      startDate: "2024-01-01",
    }

    // el schema lanza un error antes de llegar al servicio, protegiendo la BD
    await expect(async () => {
      const validData = experienceSchema.parse(badPayload) // lanza ZodError aquí
      await createExperiences(testUserId, [validData])
    }).rejects.toThrow()
  })

  it("Caso 005: Debería insertar exitosamente una experiencia laboral validada", async () => {
    const goodPayload = {
      title: "QA Automation Engineer",
      company: "SENA Empresa",
      startDate: "2024-01-01",
      description: "Automatización de pruebas de integración",
    }

    const validData = experienceSchema.parse(goodPayload)

    const [insertedExp] = await createExperiences(testUserId, [validData])

    expect(insertedExp).toBeDefined()
    expect(insertedExp.freelancerId).toBe(testProfileId)
    expect(insertedExp.title).toBe(goodPayload.title)
  })
})
