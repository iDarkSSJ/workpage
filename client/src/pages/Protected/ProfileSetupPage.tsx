import { useState } from "react"
import { useNavigate } from "react-router"
import { z } from "zod"
import {
  createFreelancerProfile,
  createContractorProfile,
} from "../../lib/profilesApi"
import {
  freelancerProfileSchema,
  contractorProfileSchema,
} from "../../validations/profileSchema"
import Card from "../../components/Card"
import { showToast } from "../../components/showToast"
import { useLoading } from "../../context/LoadingContext"
import { cn } from "../../utils/cn"
import { Briefcase, Building2 } from "lucide-react"
import Button from "../../components/Button"

import FreelancerProfileForm, {
  type FreelancerBaseForm,
} from "../../components/pieces/FreelancerProfileForm"
import ContractorProfileForm, {
  type ContractorFormT,
} from "../../components/pieces/ContractorProfileForm"
import {
  type FreelancerFormErrors,
  FL_INITIAL_ERRORS,
  type ContractorFormErrors,
  CT_INITIAL_ERRORS,
} from "../../types/formErrors"

type ProfileType = "freelancer" | "contractor" | null

const FL_DEFAULTS: FreelancerBaseForm = {
  category: "",
  hourlyRate: "",
  country: "",
  bio: "",
  linkedinUrl: "",
  githubUrl: "",
  websiteUrl: "",
  skills: [],
}

const CT_DEFAULTS: ContractorFormT = {
  companyName: "",
  country: "",
  bio: "",
  websiteUrl: "",
}

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [profileType, setProfileType] = useState<ProfileType>(null)
  const [flForm, setFlForm] = useState(FL_DEFAULTS)
  const [ctForm, setCtForm] = useState(CT_DEFAULTS)
  const [flErrors, setFlErrors] = useState(FL_INITIAL_ERRORS)
  const [ctErrors, setCtErrors] = useState(CT_INITIAL_ERRORS)

  const onChangeCtField =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCtForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (ctErrors[field as keyof ContractorFormErrors]) {
        setCtErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }

  const handleFlChange = (field: keyof FreelancerBaseForm, value: string) => {
    setFlForm((prev) => ({ ...prev, [field]: value }))
    if (flErrors[field as keyof FreelancerFormErrors]) {
      setFlErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (profileType === "freelancer") {
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
    } else {
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
    }

    setLoading(true)

    try {
      if (profileType === "freelancer") {
        const result = await createFreelancerProfile(flForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
      } else {
        const result = await createContractorProfile(ctForm)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
      }

      showToast("success", "¡Perfil creado correctamente!")
      navigate("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-primary-bg flex flex-col items-center justify-center gap-8 px-4 py-14">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-zinc-100">
          Crea tu <span className="text-primary">perfil</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Puedes tener ambos perfiles. Empieza por el que más te interese.
        </p>
      </div>

      {/* selector de perfiles */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Button
          type="button"
          onClick={() => setProfileType("freelancer")}
          className={cn(
            "flex-1 group p-0 rounded-3xl border-2 transition-all",
            profileType === "freelancer"
              ? "border-primary shadow-xl shadow-primary/30"
              : "border-transparent hover:border-primary/40",
          )}>
          <Card className="w-full">
            <Briefcase
              size={28}
              className={cn(
                "mb-3 transition-colors",
                profileType === "freelancer"
                  ? "text-primary"
                  : "text-zinc-500 group-hover:text-primary",
              )}
            />
            <span className="block font-semibold text-zinc-100">
              Freelancer
            </span>
            <span className="text-sm text-zinc-400">Ofrece tus servicios</span>
          </Card>
        </Button>

        <Button
          type="button"
          onClick={() => setProfileType("contractor")}
          className={cn(
            "flex-1 group p-0 rounded-3xl border-2 transition-all",
            profileType === "contractor"
              ? "border-primary shadow-xl shadow-primary/30"
              : "border-transparent hover:border-primary/40",
          )}>
          <Card className="w-full">
            <Building2
              size={28}
              className={cn(
                "mb-3 transition-colors",
                profileType === "contractor"
                  ? "text-primary"
                  : "text-zinc-500 group-hover:text-primary",
              )}
            />
            <span className="block font-semibold text-zinc-100">
              Contratante
            </span>
            <span className="text-sm text-zinc-400">Publica proyectos</span>
          </Card>
        </Button>
      </div>

      {profileType && (
        <Card className="w-full max-w-lg">
          <div className="flex flex-col gap-4">

            {profileType === "freelancer" ? (
              <FreelancerProfileForm
                form={flForm}
                onChange={handleFlChange}
                onSubmit={handleSubmit}
                errors={flErrors}
              />
            ) : (
              <ContractorProfileForm
                form={ctForm}
                onChangeField={onChangeCtField}
                onSubmit={handleSubmit}
                errors={ctErrors}
              />
            )}
          </div>
        </Card>
      )}
    </main>
  )
}
