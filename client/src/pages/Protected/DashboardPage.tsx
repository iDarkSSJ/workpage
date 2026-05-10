import { useMyProfile } from "../../features/profiles/api/useProfiles.api"
import Card from "../../components/Card"
import Link from "../../components/Link"
import MyProjectsSection from "../../features/projects/components/MyProjectsSection"
import MyProposalsSection from "../../features/proposals/components/MyProposalsSection"
import MyRecentContracts from "../../features/contracts/components/MyRecentContracts"

export default function DashboardPage() {
  const { data: profiles, isLoading: profilesLoading } = useMyProfile()

  if (profilesLoading)
    return <div className="p-10 text-center">Cargando panel de control...</div>

  const isContractor = Boolean(profiles?.contractorProfile)
  const isFreelancer = Boolean(profiles?.freelancerProfile)

  return (
    <div className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100">Panel de Control</h1>
          <p className="text-zinc-400 mt-2">
            Gestiona tu actividad y progreso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isContractor && <MyProjectsSection />}

          {isFreelancer && <MyProposalsSection />}
        </div>

        {(isContractor || isFreelancer) && <MyRecentContracts />}

        {!isContractor && !isFreelancer && (
          <Card className="text-center py-20">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              ¡Bienvenido!
            </h3>
            <p className="text-zinc-400 mb-6">
              Parece que aún no has configurado tu perfil.
            </p>
            <Link path="/profile/setup" btnStyle>
              Configurar mi perfil
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
