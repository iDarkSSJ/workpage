import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useMyProfile } from "../../features/profiles/api/useProfiles.api"
import Card from "../../components/Card"
import Button from "../../components/Button"
import ProjectCreateForm from "../../features/projects/components/ProjectCreateForm"
import { BriefcaseBusiness } from "lucide-react"
import { showToast } from "../../components/showToast"

export default function NewProjectPage() {
  const navigate = useNavigate()
  const { data: profiles, isLoading: profilesLoading } = useMyProfile()

  const isContractor = Boolean(profiles?.contractorProfile)

  useEffect(() => {
    if (!profilesLoading && !isContractor) {
      showToast(
        "error",
        "Debes tener un perfil de contratista para publicar proyectos.",
      )
      navigate("/profile/setup")
    }
  }, [profilesLoading, isContractor, navigate])

  if (profilesLoading) return null
  if (!isContractor) return null

  return (
    <div className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-100">
              <BriefcaseBusiness size={28} className="text-primary" />
              Publicar Proyecto
            </h1>
            <p className="text-zinc-400 mt-1">
              Conecta con los mejores talentos para tu idea
            </p>
          </div>
          <Button onClick={() => navigate(-1)}>Cancelar</Button>
        </div>

        <Card className="w-full">
          <ProjectCreateForm />
        </Card>
      </div>
    </div>
  )
}
