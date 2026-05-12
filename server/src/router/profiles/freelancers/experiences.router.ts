import { Router } from "express"
import { validate } from "../../../middleware/validate"
import { experienceSchema } from "../../../schemas/profile.schema"
import {
  createExperiences,
  deleteExperience,
  updateExperience,
} from "../../../controllers/experiences.controller"
import z from "zod"

// flujo de router
// profiles -> freelancers -> experiences
// -----------------------------------------
// endpoint completo
// /api/profiles/freelancers/experiences

const router = Router()

router.post("/", validate(z.array(experienceSchema)), createExperiences)
router.put("/:id", validate(experienceSchema), updateExperience)
router.delete("/:id", deleteExperience)

export default router
