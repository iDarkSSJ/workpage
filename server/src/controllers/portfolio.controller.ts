import { Request, Response } from "express"
import * as portfolioService from "../services/portfolio.service"
// LOS DATOS DEL BODY YA ESTAN VALIDADO POR EL MIDDLEWARE DE ZOD EN LA RUTA
// POR LO TANTO NO ES NECESARIO VALIDARLOS EN EL CONTROLLER

// CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// -----------------------------------

export const createFreelancerPortfolio = async (
  req: Request,
  res: Response,
) => {
  const inserted = await portfolioService.createPortfolioItems(
    req.session!.user.id,
    req.body,
  )
  res.status(201).json(inserted)
}

export const deletePortfolioItem = async (req: Request, res: Response) => {
  const result = await portfolioService.deletePortfolioItem(
    req.session!.user.id,
    req.params.id as string,
  )
  res.json(result)
}

export const updatePortfolioItem = async (req: Request, res: Response) => {
  const updated = await portfolioService.updatePortfolioItem(
    req.session!.user.id,
    req.params.id as string,
    req.body,
  )
  res.json(updated)
}
