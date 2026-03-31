import { Request, Response } from "express"
import * as skillsService from "../services/skills.service"
import { skillQuerySchema } from "../schemas/skills.schema"
// LOS DATOS DEL BODY YA ESTAN VALIDADO POR EL MIDDLEWARE DE ZOD EN LA RUTA
// POR LO TANTO NO ES NECESARIO VALIDARLOS EN EL CONTROLLER

// CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// -----------------------------------

export const getSkills = async (req: Request, res: Response) => {
  const { q } = skillQuerySchema.parse(req.query)

  if (q) {
    const skills = await skillsService.searchSkills(q)
    res.json(skills)
  } else {
    const skills = await skillsService.getDefaultSkills()
    res.json(skills)
  }
}

export const createSkill = async (req: Request, res: Response) => {
  const skill = await skillsService.findOrCreateSkill(req.body.name)
  res.status(201).json(skill)
}
