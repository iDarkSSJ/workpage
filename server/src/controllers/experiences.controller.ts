import { Request, Response } from "express"
import * as experienceService from "../services/experiences.service"
// LOS DATOS DEL BODY YA ESTAN VALIDADO POR EL MIDDLEWARE DE ZOD EN LA RUTA
// POR LO TANTO NO ES NECESARIO VALIDARLOS EN EL CONTROLLER

// CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// -----------------------------------
export const createExperiences = async (req: Request, res: Response) => {
  const inserted = await experienceService.createExperiences(
    req.session!.user.id,
    req.body
  )
  res.status(201).json(inserted)
}

export const deleteExperience = async (req: Request, res: Response) => {
  const result = await experienceService.deleteExperience(
    req.session!.user.id,
    req.params.id as string
  )
  res.json(result)
}

export const updateExperience = async (req: Request, res: Response) => {
  const updated = await experienceService.updateExperience(
    req.session!.user.id,
    req.params.id as string,
    req.body
  )
  res.json(updated)
}