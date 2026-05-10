import { useState } from "react"
import { z } from "zod"
import { useCreateProposal, useUpdateProposal } from "../api/useProposals"
import {
  createProposalSchema,
} from "../schemas/proposals.schema"
import Input from "../../../components/ui/Input"
import TextArea from "../../../components/ui/TextArea"
import Button from "../../../components/Button"
import type { Proposal } from "../types/proposals.types"
import { CheckCircle, XCircle, Send } from "lucide-react"
import { formatAmount } from "../../../utils/currency"

interface Props {
  mode: "create" | "edit"
  projectId: string
  proposal?: Proposal
  budgetType?: "fixed" | "hourly"
  onCancel: () => void
  onSuccess: () => void
}

const INITIAL_ERRORS = {
  coverLetter: "",
  bidAmount: "",
}

export default function ProposalForm({
  mode,
  projectId,
  proposal,
  budgetType,
  onCancel,
  onSuccess,
}: Props) {
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  const createMut = useCreateProposal(projectId)
  const updateMut = useUpdateProposal(projectId)

  const isPending = createMut.isPending || updateMut.isPending
  const currentBudgetType = mode === "edit" ? proposal?.bidType : budgetType

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const schema = createProposalSchema

    const validation = schema.safeParse({
      ...rawData,
      bidType: currentBudgetType,
    })

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      setErrors({
        coverLetter: cause.properties?.coverLetter?.errors[0] ?? "",
        bidAmount: cause.properties?.bidAmount?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)

    if (mode === "create") {
      createMut.mutate(validation.data, {
        onSuccess: () => onSuccess(),
      })
    } else {
      updateMut.mutate(
        { id: proposal!.id, data: validation.data },
        {
          onSuccess: () => onSuccess(),
        },
      )
    }
  }

  const handleInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if (target.name && errors[target.name as keyof typeof INITIAL_ERRORS]) {
      setErrors((prev) => ({ ...prev, [target.name]: "" }))
    }
  }

  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
      <h4 className="font-bold text-zinc-100 mb-6 flex items-center gap-2 text-lg">
        {mode === "create" ? (
          <>
            <Send size={20} className="text-primary" />
            Enviar Propuesta
          </>
        ) : (
          <>
            <CheckCircle size={20} className="text-emerald-500" />
            Editar Propuesta
          </>
        )}
      </h4>

      <form onSubmit={onSubmit} onInput={handleInput} className="space-y-6">
        <Input
          name="bidAmount"
          label={`Tu oferta (${currentBudgetType === "fixed" ? "USD" : "USD/hr"})`}
          defaultValue={
            mode === "edit" ? formatAmount(proposal?.bidAmount || "0") : ""
          }
          errorMessage={errors.bidAmount}
          className="w-full"
        />

        <TextArea
          name="coverLetter"
          label="Carta de presentación"
          defaultValue={mode === "edit" ? proposal?.coverLetter : ""}
          errorMessage={errors.coverLetter}
          className="w-full h-48"
          max={5000}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            btnType={mode === "create" ? "primary" : "success"}
            disabled={isPending}
            className="flex-1 flex justify-center items-center gap-2 py-2.5 font-bold">
            {mode === "create" ? (
              <>
                <Send size={18} />
                {isPending ? "Enviando..." : "Enviar propuesta"}
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            btnType="secondary"
            disabled={isPending}
            className="flex-1 flex justify-center items-center gap-2 py-2.5 font-bold">
            <XCircle size={18} />
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
