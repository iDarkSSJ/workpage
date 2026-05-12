import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { validate } from "../middleware/validate"
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/reviews.schema"
import { createReview, updateReview, deleteReview } from "../controllers/reviews.controller"

const reviewsRouter = Router()

reviewsRouter.post(
  "/contract/:contractId",
  requireAuth,
  validate(createReviewSchema),
  createReview,
)
reviewsRouter.put(
  "/:id",
  requireAuth,
  validate(updateReviewSchema),
  updateReview,
)
reviewsRouter.delete("/:id", requireAuth, deleteReview)

export default reviewsRouter
