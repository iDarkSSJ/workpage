import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import {
  completeContract,
  getMyContracts,
} from "../controllers/contracts.controller"

const contractsRouter = Router()

contractsRouter.get("/", requireAuth, getMyContracts)
contractsRouter.patch("/:id/complete", requireAuth, completeContract)

export default contractsRouter
