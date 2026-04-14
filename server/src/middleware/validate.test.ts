import { describe, it, expect, vi } from "vitest"
import { validate } from "./validate"
import { z } from "zod"
import type { Request, Response, NextFunction } from "express"

const schema = z.object({ name: z.string().min(1) })

describe("validate middleware", () => {
  it("llama next() con datos válidos y pasa error con datos inválidos", async () => {
    const next1 = vi.fn()
    await validate(schema)({ body: { name: "Carlos" } } as Request, {} as Response, next1)
    expect(next1).toHaveBeenCalledWith()

    const next2 = vi.fn()
    await validate(schema)({ body: {} } as Request, {} as Response, next2)
    expect(next2).toHaveBeenCalledWith(expect.any(Error))
  })
})
