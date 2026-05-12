import { describe, it, expect } from "vitest"
import {
  nameSchema,
  passwordSchema,
  signUpSchema,
  changePasswordSchema,
} from "./auth.schema"

describe("nameSchema", () => {
  it("acepta nombre válido con tildes y ñ", () => {
    expect(nameSchema.safeParse("María Fernández").success).toBe(true)
  })

  it("rechaza nombre con caracteres inválidos o espacios dobles", () => {
    expect(nameSchema.safeParse("Carlos@123").success).toBe(false)
    expect(nameSchema.safeParse("José  Luis").success).toBe(false)
  })
})

describe("passwordSchema", () => {
  it("acepta contraseña que cumple todos los requisitos", () => {
    expect(passwordSchema.safeParse("Abc12345!").success).toBe(true)
  })

  it("rechaza contraseña sin mayúscula, sin número, o con espacios", () => {
    expect(passwordSchema.safeParse("abc12345!").success).toBe(false)
    expect(passwordSchema.safeParse("Abcdefgh!").success).toBe(false)
    expect(passwordSchema.safeParse("Abc 1234!").success).toBe(false)
  })
})

describe("signUpSchema", () => {
  const valid = {
    name: "José Luis",
    email: "jose@example.com",
    password: "Abc12345!",
    role: "freelance",
  }

  it("acepta registro válido con ambos roles", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
    expect(signUpSchema.safeParse({ ...valid, role: "contractor" }).success).toBe(true)
  })

  it("rechaza email inválido, role inválido, o body vacío", () => {
    expect(signUpSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false)
    expect(signUpSchema.safeParse({ ...valid, role: "admin" }).success).toBe(false)
    expect(signUpSchema.safeParse({}).success).toBe(false)
  })
})

describe("changePasswordSchema", () => {
  it("acepta datos válidos y rechaza sin currentPassword", () => {
    expect(changePasswordSchema.safeParse({
      newPassword: "NuevaPass1!", currentPassword: "OldPass"
    }).success).toBe(true)

    expect(changePasswordSchema.safeParse({
      newPassword: "NuevaPass1!"
    }).success).toBe(false)
  })
})
