import { useNavigate, useSearchParams } from "react-router"
import { Briefcase, Building2, ExternalLink } from "lucide-react"

import Button from "../../components/Button"
import TabSelector from "../../components/ui/TabSelector"
import { cn } from "../../utils/cn"

import { useMyProfile } from "../../features/profiles/api/useProfiles.api"

import FreelancerProfileForm from "../../features/profiles/components/FreelancerProfileForm"
import ContractorProfileForm from "../../features/profiles/components/ContractorProfileForm"

import ExperiencesSection from "../../features/profiles/components/ExperiencesSection"
import CertificationsSection from "../../features/profiles/components/CertificationsSection"
import PortfolioSection from "../../features/profiles/components/PortfolioSection"

type Tab = "freelancer" | "contractor"

export default function EditProfilePage() {
  const navigate = useNavigate()

  const { data: profiles, isLoading } = useMyProfile()

  const hasFreelancer = Boolean(profiles?.freelancerProfile)
  const hasContractor = Boolean(profiles?.contractorProfile)

  const fl = profiles?.freelancerProfile || undefined
  const ct = profiles?.contractorProfile || undefined

  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get("role") as Tab) || "freelancer"

  const setTab = (newTab: Tab) => {
    setSearchParams({ role: newTab })
  }

  if (isLoading) return null

  return (
    <div className="flex-1 w-full bg-primary-bg py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100">Editar perfil</h1>
          <Button
            btnType="default"
            onClick={() => {
              if (tab === "freelancer" && fl) {
                navigate(`/freelancers/${fl.id}`)
              } else if (tab === "contractor" && ct) {
                navigate(`/contractors/${ct.id}`)
              }
            }}
            disabled={
              (tab === "freelancer" && !fl) || (tab === "contractor" && !ct)
            }
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              tab === "contractor" && !hasContractor && "hidden",
              tab === "freelancer" && !hasFreelancer && "hidden",
            )}>
            <ExternalLink size={16} />
            Ver perfil público
          </Button>
        </div>

        <TabSelector
          activeTab={tab}
          onChange={(id) => setTab(id as Tab)}
          tabs={[
            {
              id: "freelancer",
              label: "Freelancer",
              icon: <Briefcase size={16} />,
              badge: !hasFreelancer ? "Crear" : undefined,
            },
            {
              id: "contractor",
              label: "Contratante",
              icon: <Building2 size={16} />,
              badge: !hasContractor ? "Crear" : undefined,
            },
          ]}
        />

        {tab === "freelancer" && (
          <div className="space-y-4">
            <FreelancerProfileForm
              isEditMode={hasFreelancer}
              initialData={fl}
            />

            {hasFreelancer && (
              <>
                <ExperiencesSection existing={fl?.experiences ?? []} />
                <CertificationsSection existing={fl?.certifications ?? []} />
                <PortfolioSection existing={fl?.portfolioItems ?? []} />
              </>
            )}
          </div>
        )}

        {tab === "contractor" && (
            <ContractorProfileForm
              isEditMode={hasContractor}
              initialData={ct}
            />
        )}
      </div>
    </div>
  )
}
