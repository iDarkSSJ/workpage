import { Router } from "express"
import { validate } from "../../../middleware/validate"
import { certificationSchema } from "../../../schemas/profile.schema"
import {
  createCertifications,
  deleteCertification,
  updateCertification,
} from "../../../controllers/certifications.controller"
import z from "zod"

// flujo de router
// profiles -> freelancers -> certifications
// -----------------------------------------
// endpoint completo
// /api/profiles/freelancers/certifications

const router = Router()

router.post("/", validate(z.array(certificationSchema)), createCertifications)
router.put("/:id", validate(certificationSchema), updateCertification)
router.delete("/:id", deleteCertification)

export default router
