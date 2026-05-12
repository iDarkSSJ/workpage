import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { validate } from "../../middleware/validate"
import { freelancerSchema } from "../../schemas/profile.schema"
import {
  getFreelancerById,
  createFreelancerProfile,
  updateFreelancerProfile,
} from "../../controllers/profile.controller"
import experiencesRouter from "./freelancers/experiences.router"
import certificationsRouter from "./freelancers/certifications.router"
import portfolioRouter from "./freelancers/portfolio.router"

// flujo de router
// profiles -> freelancers
// -----------------------------------------
// endpoint completo
// /api/profiles/freelancers/

const router = Router()

// ruta publica
router.get("/:id", getFreelancerById)

// rutas privadas
router.use("/me", requireAuth)

router.post("/me", validate(freelancerSchema), createFreelancerProfile)
router.put("/me", validate(freelancerSchema), updateFreelancerProfile)

// relaciones de freelancer
router.use("/me/experiences", experiencesRouter)
router.use("/me/certifications", certificationsRouter)
router.use("/me/portfolio", portfolioRouter)

export default router
