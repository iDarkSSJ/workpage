import { Router } from "express"
import { validate } from "../../middleware/validate"
import { createSkillSchema } from "../../schemas/skills.schema"
import { getSkills, createSkill } from "../../controllers/skills.controller"
import { requireAuth } from "../../middleware/requireAuth"

const router = Router()

router.get("/", getSkills)
router.post("/", requireAuth, validate(createSkillSchema), createSkill)

export default router
