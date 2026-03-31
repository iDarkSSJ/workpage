import { Request, Response } from "express"
import * as reviewService from "../services/reviews.service"

export const createReview = async (req: Request, res: Response) => {
  const newReview = await reviewService.createReview(
    req.session!.user.id,
    req.params.contractId as string,
    req.body,
  )

  res.status(201).json(newReview)
}

export const updateReview = async (req: Request, res: Response) => {
  const updated = await reviewService.updateReview(
    req.session!.user.id,
    req.params.id as string,
    req.body,
  )

  res.json(updated)
}
