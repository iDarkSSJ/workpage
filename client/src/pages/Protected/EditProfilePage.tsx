import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router"
import { z } from "zod"
import {
  getMyProfiles,
  updateFreelancerProfile,
  updateContractorProfile,
  createFreelancerProfile,
  createContractorProfile,
} from "../../lib/profilesApi"
import {
  freelancerProfileSchema,
  contractorProfileSchema,
} from "../../validations/profileSchema"
import type { MyProfiles } from "../../types/profiles"
import Card from "../../components/Card"
import Button from "../../components/Button"
import { showToast } from "../../components/showToast"
import { useLoading } from "../../context/LoadingContext"
import { cn } from "../../utils/cn"
import { Briefcase, Building2 } from "lucide-react"
import FreelancerProfileForm, {
  type FreelancerBaseForm,
} from "../../components/pieces/FreelancerProfileForm"
import ContractorProfileForm, {
  type ContractorFormT,
} from "../../components/pieces/ContractorProfileForm"
import ExperiencesSection from "../../components/pieces/EditProfilePage/ExperiencesSection"
import CertificationsSection from "../../components/pieces/EditProfilePage/CertificationsSection"
import PortfolioSection from "../../components/pieces/EditProfilePage/PortfolioSection"
import {
  type FreelancerFormErrors,
  FL_INITIAL_ERRORS,
  type ContractorFormErrors,
  CT_INITIAL_ERRORS,
} from "../../types/formErrors"

type Tab = "freelancer" | "contractor"

const FL_DEFAULTS: FreelancerBaseForm = {
  bio: "",
  category: "",
  hourlyRate: "",
  country: "",
  linkedinUrl: "",
  githubUrl: "",
  websiteUrl: "",
  skills: [],
}

const CT_DEFAULTS: ContractorFormT = {
  companyName: "",
  bio: "",
  country: "",
  websiteUrl: "",
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [profiles, setProfiles] = useState<MyProfiles | null>(null)
  const [tab, setTab] = useState<Tab>("freelancer")
  const [flForm, setFlForm] = useState<FreelancerBaseForm>(FL_DEFAULTS)
  const [ctForm, setCtForm] = useState<ContractorFormT>(CT_DEFAULTS)
  const [flErrors, setFlErrors] =
    useState<FreelancerFormErrors>(FL_INITIAL_ERRORS)
  const [ctErrors, setCtErrors] =
    useState<ContractorFormErrors>(CT_INITIAL_ERRORS)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getMyProfiles()

      if (!result.success) {
        showToast("error", result.error)
        return
      }

      const p = result.data
      setProfiles(p)

      if (p.freelancerProfile) {
        const f = p.freelancerProfile
        setFlForm({
          bio: f.bio ?? "",
          category: f.category ?? "",
          hourlyRate: f.hourlyRate ?? "",
          country: f.country ?? "",
          linkedinUrl: f.linkedinUrl ?? "",
          githubUrl: f.githubUrl ?? "",
          websiteUrl: f.websiteUrl ?? "",
          skills: f.skills?.map((s) => s.skillId) ?? [],
        })
      } else if (p.contractorProfile && !p.freelancerProfile) {
        setTab("contractor")
      }

      if (p.contractorProfile) {
        const c = p.contractorProfile
        setCtForm({
          companyName: c.companyName ?? "",
          bio: c.bio ?? "",
          country: c.country ?? "",
          websiteUrl: c.websiteUrl ?? "",
        })
      }
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const hasFreelancer = Boolean(profiles?.freelancerProfile)
  const hasContractor = Boolean(profiles?.contractorProfile)

  // --- Freelancer base profile ---
  const handleFlChange = (field: keyof FreelancerBaseForm, value: string) => {
    setFlForm((prev) => ({ ...prev, [field]: value }))
    if (flErrors[field as keyof FreelancerFormErrors]) {
      setFlErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = freelancerProfileSchema.safeParse(flForm)
    if (!result.success) {
      const cause = z.treeifyError(result.error)
      setFlErrors({
        ...FL_INITIAL_ERRORS,
        category: cause.properties?.category?.errors[0] ?? "",
        hourlyRate: cause.properties?.hourlyRate?.errors[0] ?? "",
        country: cause.properties?.country?.errors[0] ?? "",
        bio: cause.properties?.bio?.errors[0] ?? "",
        linkedinUrl: cause.properties?.linkedinUrl?.errors[0] ?? "",
        githubUrl: cause.properties?.githubUrl?.errors[0] ?? "",
        websiteUrl: cause.properties?.websiteUrl?.errors[0] ?? "",
      })
      return
    }
    setLoading(true)
    try {
      if (hasFreelancer) {
        const result = await updateFreelancerProfile(flForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Perfil actualizado")
      } else {
        const result = await createFreelancerProfile(flForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Perfil creado")
        window.location.reload()
      }
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }

  // --- Contractor profile ---
  const handleCtChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCtForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (ctErrors[field as keyof ContractorFormErrors]) {
        setCtErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }

  const handleCtSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = contractorProfileSchema.safeParse(ctForm)
    if (!result.success) {
      const cause = z.treeifyError(result.error)
      setCtErrors({
        ...CT_INITIAL_ERRORS,
        companyName: cause.properties?.companyName?.errors[0] ?? "",
        bio: cause.properties?.bio?.errors[0] ?? "",
        country: cause.properties?.country?.errors[0] ?? "",
        websiteUrl: cause.properties?.websiteUrl?.errors[0] ?? "",
      })
      return
    }
    setLoading(true)
    try {
      if (hasContractor) {
        const result = await updateContractorProfile(ctForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Perfil actualizado")
      } else {
        const result = await createContractorProfile(ctForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Perfil creado")
        window.location.reload()
      }
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }

  const fl = profiles?.freelancerProfile

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100">Editar perfil</h1>
          <Button btnType="default" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setTab("freelancer")}
            className={cn(
              "flex items-center gap-2 text-sm",
              tab === "freelancer"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
            )}>
            <Briefcase size={14} /> Freelancer {!hasFreelancer && "(Crear)"}
          </Button>
          <Button
            onClick={() => setTab("contractor")}
            className={cn(
              "flex items-center gap-2 text-sm",
              tab === "contractor"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
            )}>
            <Building2 size={14} /> Contratante {!hasContractor && "(Crear)"}
          </Button>
        </div>

        {tab === "freelancer" && (
          <div className="space-y-4">
            <Card className="w-full">
              <FreelancerProfileForm
                form={flForm}
                onChange={handleFlChange}
                onSubmit={handleFlSubmit}
                isEditMode={hasFreelancer}
                errors={flErrors}
              />
            </Card>

            {/* Secciones relacionadas solo si ya existe el perfil freelancer */}
            {hasFreelancer && (
              <>
                <ExperiencesSection existing={fl?.experiences ?? []} />
                <CertificationsSection existing={fl?.certifications ?? []} />
                <PortfolioSection existing={fl?.featuredProjects ?? []} />
              </>
            )}
          </div>
        )}

        {tab === "contractor" && (
          <Card className="w-full">
            <ContractorProfileForm
              form={ctForm}
              onChangeField={handleCtChange}
              onSubmit={handleCtSubmit}
              isEditMode={hasContractor}
              errors={ctErrors}
            />
          </Card>
        )}
      </div>
    </main>
  )
}
