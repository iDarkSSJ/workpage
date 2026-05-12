import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { validate } from "../middleware/validate"
import {
  createProjectSchema,
  updateProjectStatusSchema,
} from "../schemas/projects.schema"
import {
  getProjects,
  getProjectById,
  createProject,
  updateProjectStatus,
} from "../controllers/projects.controller"

const projectsRouter = Router()

projectsRouter.get("/", getProjects)
projectsRouter.get("/:id", getProjectById)

projectsRouter.post(
  "/",
  requireAuth,
  validate(createProjectSchema),
  createProject,
)
projectsRouter.patch(
  "/:id/status",
  requireAuth,
  validate(updateProjectStatusSchema),
  updateProjectStatus,
)

export default projectsRouter
