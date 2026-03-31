import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { validate } from "../middleware/validate"
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/reviews.schema"
import { createReview, updateReview } from "../controllers/reviews.controller"

const reviewsRouter = Router()

reviewsRouter.post(
  "/contract/:contractId",
  requireAuth,
  validate(createReviewSchema),
  createReview,
)
reviewsRouter.patch(
  "/:id",
  requireAuth,
  validate(updateReviewSchema),
  updateReview,
)

export default reviewsRouter
