import { useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import Card from "../../components/Card"
import Button from "../../components/Button"
import { useState } from "react"
import { cn } from "../../utils/cn"
import { completeRoleReq } from "../../lib/authRequest"
import { showToast } from "../../components/showToast"

type roleType = "contractor" | "freelance"

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<roleType | null>(null)

  const { refetch } = useAuth()

  const handleSelectRole = async () => {
    if (!selectedRole) {
      showToast("error", "Elije un rol antes de enviar.")
      return
    }

    const { success, error } = await completeRoleReq(selectedRole)

    if (!success) {
      showToast("error", error ?? "Ocurrió un error inesperado.")
      return
    }

    await refetch()
    navigate("/dashboard", { replace: true })
  }

  return (
    <main className="w-full min-h-dvh flex flex-col justify-center items-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-10 md:py-16">
      <h2 className="text-xl font-semibold uppercase">Completa tu perfil</h2>
      <h1 className="text-7xl font-bold mb-12 text-center uppercase">
        Elije tu <span className="text-primary">rol</span>
      </h1>

      <div className="flex flex-col md:flex-row max-w-2xl gap-4 font-semibold">
        <Button
          onClick={() => setSelectedRole("freelance")}
          className={cn(
            "group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30",
            selectedRole === "freelance" &&
              "border-primary shadow-xl shadow-primary/30",
          )}>
          <Card>
            <span className="text-white text-center text-xl block group-hover:text-primary">
              ¡Busco trabajo!
            </span>
            <span>
              Ideal si estas Buscando propuestas de proyectos que se ajusten a
              tu perfil
            </span>
          </Card>
        </Button>
        <Button
          onClick={() => setSelectedRole("contractor")}
          className={cn(
            "group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30",
            selectedRole === "contractor" &&
              "border-primary shadow-xl shadow-primary/30",
          )}>
          <Card>
            <span className="text-white text-center text-xl block group-hover:text-primary">
              ¡Busco talento!
            </span>
            <span>
              Ideal si estas buscando contratar a alguien que te ayude con tu
              futuro proyecto
            </span>
          </Card>
        </Button>
      </div>
      {selectedRole && (
        <Button
          type="button"
          className="px-6"
          onClick={handleSelectRole}
          btnType="secondary">
          ELEGIR ROL
        </Button>
      )}
    </main>
  )
}
