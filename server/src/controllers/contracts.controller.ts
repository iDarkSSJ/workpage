import { Request, Response } from "express"
import * as contractService from "../services/contracts.service"

export const getMyContracts = async (
  req: Request,
  res: Response,
) => {
  const result = await contractService.getMyContracts(req.session!.user.id)
  res.json(result)
}

export const completeContract = async (
  req: Request,
  res: Response,
) => {
  const updatedContract = await contractService.completeContract(
    req.session!.user.id,
    req.params.id as string,
  )
  res.json(updatedContract)
}

export const cancelContract = async (
  req: Request,
  res: Response,
) => {
  const updatedContract = await contractService.cancelContract(
    req.session!.user.id,
    req.params.id as string,
  )
  res.json(updatedContract)
}

