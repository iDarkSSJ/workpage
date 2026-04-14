import { useSearchParams, useNavigate, Navigate } from "react-router"
import Card from "../components/Card"
import Link from "../components/Link"
import { useEffect } from "react"
import RegisterForm from "../features/auth/components/RegisterForm"
import { User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data: session } = useAuth()

  const role = searchParams.get("role")

  useEffect(() => {
    if (role && role !== "freelance" && role !== "contractor") {
      setSearchParams({})
      navigate("/register", { replace: true })
    }
  }, [role, setSearchParams, navigate])

  if (session) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <div className="flex flex-col justify-center items-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 min-h-[calc(100vh-4rem)]">
      {role === "freelance" || role === "contractor" ? (
        <>
          <Card className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-primary/10">
                <User size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">Crear cuenta</h1>
              <p className="text-sm text-zinc-400">
                Completa tus datos para comenzar
              </p>
            </div>

            <RegisterForm role={role} setSearchParams={setSearchParams} />
          </Card>
          <div className="text-zinc-300">
            ¿Ya tienes una cuenta?{" "}
            <Link path="/login" className="text-primary hover:underline">
              Inicia Sesión
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-5xl md:text-7xl font-bold uppercase text-center text-white">
            Elige tu <span className="text-primary">rol</span>
          </h1>
          <div className="flex flex-col max-w-2xl gap-4 font-semibold md:flex-row">
            <Link
              btnStyle
              path="/register?role=freelance"
              className="group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Card>
                <span className="text-white text-center text-xl block group-hover:text-primary transition-colors">
                  ¡Busco trabajo!
                </span>
                <span className="text-zinc-400 font-normal mt-2 block">
                  Ideal si estas Buscando propuestas de proyectos que se ajusten
                  a tu perfil
                </span>
              </Card>
            </Link>
            <Link
              btnStyle
              path="/register?role=contractor"
              className="group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Card>
                <span className="text-white text-center text-xl block group-hover:text-primary transition-colors">
                  ¡Busco talento!
                </span>
                <span className="text-zinc-400 font-normal mt-2 block">
                  Ideal si estas buscando contratar a alguien que te ayude con
                  tu futuro proyecto
                </span>
              </Card>
            </Link>
          </div>
          <div className="text-zinc-300">
            ¿Ya tienes una cuenta?{" "}
            <Link path="/login" className="text-primary hover:underline">
              Inicia Sesión
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
