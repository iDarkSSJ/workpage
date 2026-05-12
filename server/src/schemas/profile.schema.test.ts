import { describe, it, expect } from "vitest"
import {
  freelancerSchema,
  contractorSchema,
  experienceSchema,
  portfolioSchema,
} from "./profile.schema"

describe("freelancerSchema", () => {
  it("acepta perfil completo y transforma hourlyRate a string", () => {
    const result = freelancerSchema.safeParse({
      bio: "Desarrollador fullstack",
      category: "Web",
      hourlyRate: 50,
      country: "CO",
      skills: [],
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.hourlyRate).toBe("50")
  })

  it("rechaza country inválido y bio excesivamente largo", () => {
    expect(freelancerSchema.safeParse({ country: "ZZZ" }).success).toBe(false)
    expect(freelancerSchema.safeParse({ country: "CO", bio: "A".repeat(1001) }).success).toBe(false)
  })
})

describe("contractorSchema", () => {
  it("acepta todos los campos opcionales vacíos y transforma '' a null", () => {
    expect(contractorSchema.safeParse({}).success).toBe(true)
    const result = contractorSchema.safeParse({ companyName: "" })
    if (result.success) expect(result.data.companyName).toBeNull()
  })
})

describe("experienceSchema", () => {
  it("acepta experiencia válida y rechaza sin campos obligatorios", () => {
    expect(experienceSchema.safeParse({
      title: "Dev Senior", company: "Google", startDate: "2020-01-15"
    }).success).toBe(true)

    expect(experienceSchema.safeParse({ title: "Dev" }).success).toBe(false)
  })
})

describe("portfolioSchema", () => {
  it("acepta portfolio válido y rechaza URL inválida", () => {
    expect(portfolioSchema.safeParse({ title: "Proyecto" }).success).toBe(true)
    expect(portfolioSchema.safeParse({ title: "P", imageUrl: "nope" }).success).toBe(false)
  })
})
