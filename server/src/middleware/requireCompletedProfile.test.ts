import { describe, it, expect, vi } from "vitest"
import { requireCompletedProfile } from "./requireCompletedProfile"
import type { Request, Response, NextFunction } from "express"

describe("requireCompletedProfile", () => {
  it("pasa con role y bloquea sin role", () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response

    const next1 = vi.fn()
    requireCompletedProfile({ session: { user: { role: "freelance" } } } as unknown as Request, res, next1)
    expect(next1).toHaveBeenCalled()

    const next2 = vi.fn()
    requireCompletedProfile({ session: undefined } as unknown as Request, res, next2)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next2).not.toHaveBeenCalled()
  })
})
