import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { getMyProfiles } from "../controllers/profile.controller"

import skillsRouter from "./profiles/skills.router"
import freelancersRouter from "./profiles/freelancers.router"
import contractorsRouter from "./profiles/contractors.router"

const profilesRouter = Router()

// GET /profiles/me
profilesRouter.get("/me", requireAuth, getMyProfiles)

// Sub-router para separar responsabilidades :)
profilesRouter.use("/skills", skillsRouter)
profilesRouter.use("/freelancers", freelancersRouter)
profilesRouter.use("/contractors", contractorsRouter)

export default profilesRouter
