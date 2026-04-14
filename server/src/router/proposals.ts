import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { validate } from "../middleware/validate"
import {
  createProposalSchema,
  updateProposalStatusSchema,
} from "../schemas/proposals.schema"
import {
  createProposal,
  getProposalsByProjectId,
  updateProposalStatus,
  getMyProposals,
  updateProposal,
} from "../controllers/proposals.controller"

const proposalsRouter = Router()

proposalsRouter.get("/me", requireAuth, getMyProposals)

proposalsRouter.post(
  "/project/:projectId",
  requireAuth,
  validate(createProposalSchema),
  createProposal,
)
proposalsRouter.get("/project/:projectId", requireAuth, getProposalsByProjectId)

proposalsRouter.patch(
  "/:id/status",
  requireAuth,
  validate(updateProposalStatusSchema),
  updateProposalStatus,
)

proposalsRouter.put(
  "/:id",
  requireAuth,
  validate(createProposalSchema),
  updateProposal,
)

export default proposalsRouter
