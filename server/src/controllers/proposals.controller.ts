import { Request, Response } from "express"
import * as proposalService from "../services/proposals.service"

export const createProposal = async (req: Request, res: Response) => {
    const newProposal = await proposalService.createProposal(
        req.session!.user.id,
        req.params.projectId as string,
        req.body
    )

    res.status(201).json(newProposal)
}

export const getProposalsByProjectId = async (req: Request, res: Response) => {
    const proposals = await proposalService.getProposalsByProjectId(
        req.session!.user.id,
        req.params.projectId as string
    )

    res.json(proposals)
}

export const updateProposalStatus = async (req: Request, res: Response) => {
    const result = await proposalService.updateProposalStatus(
        req.session!.user.id,
        req.params.id as string,
        req.body.status
    )

    res.json(result)
}