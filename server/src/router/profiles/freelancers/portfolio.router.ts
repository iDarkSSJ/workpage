import { Router } from "express"
import { validate } from "../../../middleware/validate"
import { portfolioSchema } from "../../../schemas/profile.schema"
import {
  createFreelancerPortfolio,
  deletePortfolioItem,
  updatePortfolioItem,
} from "../../../controllers/portfolio.controller"
import z from "zod"

// Flujo de router: profiles -> freelancers -> me -> portfolio
// Endpoint base: /api/profiles/freelancers/me/portfolio

const router = Router()

router.post("/", validate(z.array(portfolioSchema)), createFreelancerPortfolio)
router.put("/:id", validate(portfolioSchema), updatePortfolioItem)
router.delete("/:id", deletePortfolioItem)

export default router
