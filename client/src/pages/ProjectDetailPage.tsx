import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useProject } from "../features/projects/api/useProjects"
import { useAuth } from "../context/AuthContext"
import Card from "../components/Card"
import Button from "../components/Button"
import Link from "../components/Link"
import ProposalForm from "../features/proposals/components/ProposalForm"
import ProjectProposalsList from "../features/proposals/components/ProjectProposalsList"
import { useMyProfile } from "../features/profiles/api/useProfiles.api"
import { cn } from "../utils/cn"
import {
  BriefcaseBusiness,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
} from "lucide-react"
import { handleSafeBack } from "../utils/navigation"
import { getCountryName } from "../utils/countryHelper"
import { formatAmount } from "../utils/currency"

const PROJECT_STATUS_LABELS: Record<string, string> = {
  open: "Abierto",
  in_progress: "En Progreso",
  completed: "Completado",
  closed: "Cerrado",
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: authData } = useAuth()
  const user = authData?.user
  const [showApplyForm, setShowApplyForm] = useState(false)

  const { data: project, isLoading } = useProject(id!)
  const { data: myProfiles } = useMyProfile()

  if (isLoading) return null
  if (!project) return null

  const isOwner = Boolean(user && project.contractor?.user?.id === user.id)

  const myProposal = project.proposals?.find(
    (p) => p.freelancer?.user?.id === user?.id,
  )

  return (
    <div className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Button
            btnType="default"
            onClick={() => handleSafeBack(navigate, "/projects")}
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
                  "shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                  project.status === "open"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-zinc-800 text-zinc-400",
                )}>
                {PROJECT_STATUS_LABELS[project.status] ||
                  project.status.toUpperCase()}
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-zinc-700/50">
              <div className="space-y-1">
                <span className="text-sm text-zinc-500">Presupuesto</span>
                <p className="flex items-center gap-1 font-semibold text-emerald-400">
                  <DollarSign size={16} />
                  {project.budgetType === "fixed" ? "Fijo" : "Por Hora"}(
                  {formatAmount(project.budgetMin)} -{" "}
                  {formatAmount(project.budgetMax)})
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-zinc-500">Publicado</span>
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
                  {project.skills.map((s) => (
                    <span
                      key={s.skillId}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      {s.skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Propuestas - Vista Condicional */}
          <Card className="w-full">
            <h3 className="text-xl font-bold text-zinc-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={20} className="text-primary" />
                Propuestas {isOwner ? "Recibidas" : ""}
              </span>
              <span className="text-sm font-normal text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                Total: {project.proposalCount || 0}
              </span>
            </h3>

            {isOwner || myProposal ? (
              <ProjectProposalsList
                proposals={project.proposals || []}
                projectId={project.id}
                projectStatus={project.status}
                isOwner={isOwner}
                currentUserId={user?.id}
              />
            ) : (
              <div className="space-y-6">
                {!user ? (
                  <div className="flex flex-col items-center py-8 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 text-center">
                    <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                      Debes iniciar sesión con tu cuenta de freelancer para
                      enviar una propuesta a este proyecto.
                    </p>
                    <Link
                      path="/login"
                      btnStyle
                      btnType="primary"
                      className="px-10 py-2.5 font-bold">
                      Iniciar Sesión
                    </Link>
                  </div>
                ) : !myProfiles?.freelancerProfile ? (
                  <div className="flex flex-col items-center py-8 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 text-center">
                    <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                      Tu cuenta está activa, pero necesitas configurar tu perfil
                      de freelancer para poder aplicar a proyectos.
                    </p>
                    <Link
                      path="/freelancer/setup"
                      btnStyle
                      btnType="secondary"
                      className="px-10 py-2.5 font-bold text-zinc-900 bg-primary">
                      Crear Perfil Freelancer
                    </Link>
                  </div>
                ) : project.status !== "open" ? (
                  <div className="flex flex-col items-center py-8 px-4 border border-zinc-800 rounded-2xl bg-zinc-900/10 text-center">
                    <p className="text-zinc-500 text-sm font-medium">
                      Este proyecto ya no acepta nuevas propuestas.
                    </p>
                  </div>
                ) : (
                  <>
                    {!showApplyForm ? (
                      <div className="flex flex-col items-center py-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                        <p className="text-zinc-400 text-sm mb-5">
                          Hay {project.proposalCount} propuestas enviadas.
                          ¡Envía la tuya ahora!
                        </p>
                        <Button
                          onClick={() => setShowApplyForm(true)}
                          btnType="primary"
                          className="px-10 py-2.5 font-bold">
                          Aplicar a este proyecto
                        </Button>
                      </div>
                    ) : (
                      <ProposalForm
                        mode="create"
                        projectId={project.id}
                        budgetType={project.budgetType}
                        onCancel={() => setShowApplyForm(false)}
                        onSuccess={() => setShowApplyForm(false)}
                      />
                    )}
                  </>
                )}

                {(project.proposalCount ?? 0) > 0 && (
                  <div className="pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-500 text-sm text-center">
                      Ya hay {project.proposalCount} interesados compitiendo por
                      este proyecto.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
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
                  <MapPin size={16} />{" "}
                  {getCountryName(project.contractor.country)}
                </p>
              )}

              <p className="text-sm text-zinc-500 mt-4 leading-relaxed line-clamp-4">
                {project.contractor?.bio || "Sin biografía disponible."}
              </p>
            </div>
          </Card>

          {/* El formulario de aplicar se movió a la columna principal */}

          {myProposal && (
            <Card className="w-full bg-emerald-500/5 border-emerald-500/20">
              <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                <CheckCircle size={32} className="text-emerald-500" />
                <h4 className="font-bold text-zinc-100">Propuesta Enviada</h4>
                <p className="text-sm text-zinc-400">
                  Has ofertado ${formatAmount(myProposal.bidAmount)}
                </p>
                <span
                  className={cn(
                    "mt-2 px-3 py-1 rounded-full text-sm font-bold uppercase",
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
    </div>
  )
}
