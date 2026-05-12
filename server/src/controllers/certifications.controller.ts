import { Request, Response } from "express"
import * as certificationService from "../services/certifications.service"

// LOS DATOS DEL BODY YA ESTAN VALIDADO POR EL MIDDLEWARE DE ZOD EN LA RUTA
// POR LO TANTO NO ES NECESARIO VALIDARLOS EN EL CONTROLLER

// CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

export const createCertifications = async (req: Request, res: Response) => {
  const inserted = await certificationService.createCertifications(
    req.session!.user.id,
    req.body
  )
  res.status(201).json(inserted)
}

export const deleteCertification = async (req: Request, res: Response) => {
  const result = await certificationService.deleteCertification(
    req.session!.user.id,
    req.params.id as string
  )
  res.json(result)
}

export const updateCertification = async (req: Request, res: Response) => {
  const updated = await certificationService.updateCertification(
    req.session!.user.id,
    req.params.id as string,
    req.body
  )
  res.json(updated)
}