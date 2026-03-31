import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { getProject } from "../lib/projectsApi"
import { createProposal, updateProposalStatus } from "../lib/proposalsApi"
import type { Project, Proposal, ProjectSkillEntry } from "../types/projects"
import { useAuth } from "../context/AuthContext"
import { useLoading } from "../context/LoadingContext"
import { showToast } from "../components/showToast"

import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/ui/Input"
import TextArea from "../components/ui/TextArea"
import Link from "../components/Link"
import { cn } from "../utils/cn"
import {
  BriefcaseBusiness,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data } = useAuth()
  const user = data?.user
  const { setLoading } = useLoading()

  const [project, setProject] = useState<Project | null>(null)

  // Proposal Form State
  const [coverLetter, setCoverLetter] = useState("")
  const [bidAmount, setBidAmount] = useState("")

  const loadProject = async () => {
    if (!id) return
    setLoading(true)
    try {
      const result = await getProject(id)
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      setProject(result.data)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      showToast("error", message)
      navigate("/projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!project) return null

  const isOwner = user && project.contractor?.user?.id === user.id

  const myProposal = project.proposals?.find(
    (p: Proposal) => p.freelancer?.user?.id === user?.id,
  )

  const handleApply = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) return
    if (!coverLetter || !bidAmount) {
      showToast("error", "Llena todos los campos")
      return
    }

    setLoading(true)
    try {
      await createProposal(id, {
        coverLetter,
        bidAmount: Number(bidAmount),
        bidType: project.budgetType,
      })
      showToast("success", "Propuesta enviada")
      loadProject() // recargar para ver el estado
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  const handleActionOnProposal = async (
    proposalId: string,
    status: "accepted" | "rejected",
  ) => {
    setLoading(true)
    try {
      const result = await updateProposalStatus(proposalId, { status })
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      showToast(
        "success",
        `Propuesta ${status === "accepted" ? "aceptada" : "rechazada"}`,
      )
      loadProject()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Col - Info */}
        <div className="flex-1 space-y-6">
          <Button
            btnType="default"
            onClick={() => navigate(-1)}
            className="px-0 hover:bg-transparent">
            Volver
          </Button>

          <Card className="w-full">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl font-bold text-zinc-100">
                {project.title}
              </h1>
              <span
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-xs font-semibold",
                  project.status === "open"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-zinc-800 text-zinc-400",
                )}>
                {project.status.toUpperCase()}
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-zinc-700/50">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500">Presupuesto</span>
                <p className="flex items-center gap-1 font-semibold text-emerald-400">
                  <DollarSign size={16} />
                  {project.budgetType === "fixed" ? "Fijo" : "Por Hora"}(
                  {project.budgetMin} - {project.budgetMax})
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-zinc-500">Publicado</span>
                <p className="flex items-center gap-1 font-medium text-zinc-300">
                  <Clock size={16} className="text-primary" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {project.skills && project.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 block">
                  Habilidades requeridas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((s: ProjectSkillEntry) => (
                    <span
                      key={s.skillId}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {s.skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Si es dueño, ver las Proposals.  */}
          {isOwner && project.proposals && (
            <Card className="w-full">
              <h3 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <BriefcaseBusiness size={20} className="text-primary" />
                Propuestas Recibidas ({project.proposals.length})
              </h3>

              <div className="space-y-4">
                {project.proposals.length === 0 ? (
                  <p className="text-zinc-500 text-sm">
                    Aún no hay propuestas para este proyecto.
                  </p>
                ) : (
                  project.proposals.map((prop: Proposal) => (
                    <div
                      key={prop.id}
                      className="border border-zinc-700/50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {prop.freelancer?.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <Link
                              path={`/freelancers/${prop.freelancerId}`}
                              className="font-semibold text-zinc-100 hover:text-primary transition-colors">
                              {prop.freelancer?.user?.name}
                            </Link>
                            <p className="text-xs text-emerald-400 font-medium">
                              Ofrece: ${prop.bidAmount} {prop.bidType}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase",
                            prop.status === "accepted"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : prop.status === "rejected"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-zinc-800 text-zinc-400",
                          )}>
                          {prop.status}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-300 mt-3 whitespace-pre-wrap">
                        {prop.coverLetter}
                      </p>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
                        {prop.status === "pending" &&
                          project.status === "open" && (
                            <>
                              <Button
                                onClick={() =>
                                  handleActionOnProposal(prop.id, "accepted")
                                }
                                btnType="success"
                                className="flex-1 flex justify-center items-center gap-1 py-2 rounded-lg text-sm font-semibold">
                                <CheckCircle size={16} /> Aceptar
                              </Button>
                              <Button
                                onClick={() =>
                                  handleActionOnProposal(prop.id, "rejected")
                                }
                                btnType="danger"
                                className="flex-1 flex justify-center items-center gap-1 py-2 rounded-lg text-sm font-semibold">
                                <XCircle size={16} /> Rechazar
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Col - Contractor Info & Apply Box */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="w-full">
            <h4 className="font-bold text-zinc-100 mb-4 border-b border-zinc-700/50 pb-2">
              Acerca del Cliente
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link
                  path={`/contractors/${project.contractorId}`}
                  className="font-semibold text-primary hover:underline">
                  {project.contractor?.user?.name || "Empresa Confidencial"}
                </Link>
              </div>

              {project.contractor?.country && (
                <p className="flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin size={16} /> {project.contractor.country}
                </p>
              )}

              <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-4">
                {project.contractor?.bio || "Sin biografía disponible."}
              </p>
            </div>
          </Card>

          {/* Formulario para enviar propuesta (Si no es el dueño y está abierto y no has enviado propuesta) */}
          {!isOwner && project.status === "open" && !myProposal && (
            <Card className="w-full sticky top-6">
              <h4 className="font-bold text-zinc-100 mb-4 text-center">
                Enviar Propuesta
              </h4>
              <form onSubmit={handleApply} className="space-y-4">
                <Input
                  label="Tu oferta ($)"
                  value={bidAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBidAmount(e.target.value)
                  }
                  required
                />

                <TextArea
                  label="Carta de presentación"
                  value={coverLetter}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCoverLetter(e.target.value)
                  }
                  required
                  className="w-full"
                />

                <Button
                  type="submit"
                  btnType="secondary"
                  className="w-full py-2">
                  Aplicar al proyecto
                </Button>
              </form>
            </Card>
          )}

          {myProposal && (
            <Card className="w-full bg-emerald-500/5 border-emerald-500/20">
              <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                <CheckCircle size={32} className="text-emerald-500" />
                <h4 className="font-bold text-zinc-100">Propuesta Enviada</h4>
                <p className="text-sm text-zinc-400">
                  Has ofertado ${myProposal.bidAmount}
                </p>
                <span
                  className={cn(
                    "mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase",
                    myProposal.status === "accepted"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : myProposal.status === "rejected"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-zinc-800 text-zinc-400",
                  )}>
                  {myProposal.status}
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
