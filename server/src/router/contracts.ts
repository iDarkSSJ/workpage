import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import {
  completeContract,
  getMyContracts,
  cancelContract,
} from "../controllers/contracts.controller"

const contractsRouter = Router()

contractsRouter.get("/", requireAuth, getMyContracts)
contractsRouter.patch("/:id/complete", requireAuth, completeContract)
contractsRouter.patch("/:id/cancel", requireAuth, cancelContract)

export default contractsRouter
