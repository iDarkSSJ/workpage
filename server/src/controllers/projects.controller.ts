import { Request, Response } from "express"
import * as projectService from "../services/projects.service"
import { queryProjectsSchema } from "../schemas/projects.schema"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../auth/auth"

export const getProjects = async (req: Request, res: Response) => {
  const filters = queryProjectsSchema.parse(req.query)
  const result = await projectService.getProjects(filters)

  res.json(result)
}

export const getProjectById = async (req: Request, res: Response) => {
  // como esta ruta no tiene el middleware requireAuth al ser publica, obtenemos la sesion de esta forma si es que existe
  const sessionContext = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  const project = await projectService.getProjectById(
    req.params.id as string,
    sessionContext?.user.id as string,
  )

  res.json(project)
}

export const createProject = async (req: Request, res: Response) => {
  const newProject = await projectService.createProject(
    req.session!.user.id,
    req.body,
  )

  res.status(201).json(newProject)
}

export const updateProjectStatus = async (req: Request, res: Response) => {
  const updated = await projectService.updateProjectStatus(
    req.session!.user.id,
    req.params.id as string,
    req.body.status,
  )

  res.json(updated)
}
