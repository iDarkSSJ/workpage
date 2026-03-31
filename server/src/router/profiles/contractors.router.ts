import { Router } from "express"
import {
  getContractorById,
  createContractorProfile,
  updateContractorProfile,
  getPublicContractorProjects,
  getMyContractorProjects,
} from "../../controllers/profile.controller"
import { requireAuth } from "../../middleware/requireAuth"
import { validate } from "../../middleware/validate"
import { contractorSchema } from "../../schemas/profile.schema"

const router = Router()

// Mounted at /profiles/contractors
// IMPORTANT: static routes (/projects, /me) MUST come before dynamic /:id routes

router.get("/projects", requireAuth, getMyContractorProjects)
router.post("/me", requireAuth, validate(contractorSchema), createContractorProfile)
router.put("/me", requireAuth, validate(contractorSchema), updateContractorProfile)

router.get("/:id", getContractorById)
router.get("/:id/projects", getPublicContractorProjects)

export default router
