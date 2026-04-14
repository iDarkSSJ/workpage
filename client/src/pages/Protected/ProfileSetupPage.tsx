import { useState } from "react"
import { Briefcase, Building2 } from "lucide-react"
import { cn } from "../../utils/cn"
import Card from "../../components/Card"
import Button from "../../components/Button"
import FreelancerProfileForm from "../../features/profiles/components/FreelancerProfileForm"
import ContractorProfileForm from "../../features/profiles/components/ContractorProfileForm"

type ProfileType = "freelancer" | "contractor" | null

export default function ProfileSetupPage() {
  const [profileType, setProfileType] = useState<ProfileType>(null)

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-14 min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-zinc-100">
          Crea tu <span className="text-primary">perfil</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Puedes tener ambos perfiles. Empieza por el que más te interese.
        </p>
      </div>

      {/* Selector de perfiles */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Button
          type="button"
          onClick={() => setProfileType("freelancer")}
          className={cn(
            "flex-1 group p-0 rounded-3xl border-2 transition-all",
            profileType === "freelancer"
              ? "border-primary shadow-xl shadow-primary/30"
              : "border-transparent hover:border-primary/40"
          )}
        >
          <Card className="w-full">
            <Briefcase
              size={28}
              className={cn(
                "mb-3 transition-colors",
                profileType === "freelancer" ? "text-primary" : "text-zinc-500 group-hover:text-primary"
              )}
            />
            <span className="block font-semibold text-zinc-100">Freelancer</span>
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
              : "border-transparent hover:border-primary/40"
          )}
        >
          <Card className="w-full">
            <Building2
              size={28}
              className={cn(
                "mb-3 transition-colors",
                profileType === "contractor" ? "text-primary" : "text-zinc-500 group-hover:text-primary"
              )}
            />
            <span className="block font-semibold text-zinc-100">Contratante</span>
            <span className="text-sm text-zinc-400">Publica proyectos</span>
          </Card>
        </Button>
      </div>

      {/* Renderizado condicional del formulario */}
      {profileType && (
        <Card className="w-full max-w-lg">
          <div className="flex flex-col gap-4">
            {profileType === "freelancer" ? (
              <FreelancerProfileForm />
            ) : (
              <ContractorProfileForm />
            )}
          </div>
        </Card>
      )}
    </div>
  )
}