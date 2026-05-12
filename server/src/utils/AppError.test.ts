import { describe, it, expect } from "vitest"
import { AppError } from "./AppError"

describe("AppError", () => {
  it("crea error con mensaje, statusCode custom, y 400 por defecto", () => {
    const e1 = new AppError("No encontrado", 404)
    expect(e1).toBeInstanceOf(Error)
    expect(e1.statusCode).toBe(404)
    expect(e1.message).toBe("No encontrado")

    const e2 = new AppError("Inválido")
    expect(e2.statusCode).toBe(400)
  })
})
