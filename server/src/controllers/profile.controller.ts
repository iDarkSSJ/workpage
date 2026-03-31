import { Request, Response } from "express"
import * as freelancerService from "../services/freelancer.service"
import * as contractorService from "../services/contractor.service"
import { AppError } from "../utils/AppError" // Asegúrate de importar tu clase

// LOS DATOS DEL BODY YA ESTAN VALIDADO POR EL MIDDLEWARE DE ZOD EN LA RUTA
// POR LO TANTO NO ES NECESARIO VALIDARLOS EN EL CONTROLLER

// CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// -----------------------------------

// devolvemos ambos perfiles. freelancer y contractor
export const getMyProfiles = async (req: Request, res: Response) => {
  const userId = req.session!.user.id

  const [freelancerProfile, contractorProfile] = await Promise.all([
    freelancerService.getMyFreelancerProfile(userId),
    contractorService.getMyContractorProfile(userId),
  ])

  res.json({
    freelancerProfile: freelancerProfile ?? null,
    contractorProfile: contractorProfile ?? null,
  })
}

//  ------------------- FREELANCER CONTROLLERS -------------------

// obtener perfil de freelancer por id (ruta publica)
export const getFreelancerById = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const profile = await freelancerService.getFreelancerProfileById(id)

  if (!profile) throw new AppError("Freelancer no encontrado", 404)

  res.json(profile)
}

export const createFreelancerProfile = async (req: Request, res: Response) => {
  const newProfile = await freelancerService.createFreelancerProfile(
    req.session!.user.id,
    req.body,
  )

  res.status(201).json(newProfile)
}

export const updateFreelancerProfile = async (req: Request, res: Response) => {
  const updated = await freelancerService.updateFreelancerProfile(
    req.session!.user.id,
    req.body,
  )

  res.json(updated)
}

//  ------------------- CONTRACTOR CONTROLLERS -------------------

export const getContractorById = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const profile = await contractorService.getContractorProfileById(id)

  if (!profile) throw new AppError("Contratista no encontrado", 404)

  res.json(profile)
}

export const createContractorProfile = async (req: Request, res: Response) => {
  const newProfile = await contractorService.createContractorProfile(
    req.session!.user.id,
    req.body,
  )

  res.status(201).json(newProfile)
}

export const updateContractorProfile = async (req: Request, res: Response) => {
  const updated = await contractorService.updateContractorProfile(
    req.session!.user.id,
    req.body,
  )

  res.json(updated)
}

export const getPublicContractorProjects = async (
  req: Request,
  res: Response,
) => {
  const projects = await contractorService.getContractorProjects(
    req.params.id as string,
    "open",
  )

  res.json(projects)
}

export const getMyContractorProjects = async (req: Request, res: Response) => {
  const profile = await contractorService.getMyContractorProfile(
    req.session!.user.id,
  )

  if (!profile) {
    throw new AppError("Perfil de contratante no encontrado", 404)
  }

  const statusFilter =
    typeof req.query.status === "string" ? req.query.status : undefined

  const projects = await contractorService.getContractorProjects(
    profile.id,
    statusFilter,
  )

  res.json(projects)
}

// me tocó refactorizar todo el monolito que tenía en routes por pendejo :D
// pero bueno. al menos ahora puedo trabajar en paz :)
