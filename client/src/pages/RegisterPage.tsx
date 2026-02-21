import { useSearchParams, useNavigate } from "react-router"
import Card from "../components/Card"
import Link from "../components/Link"
import { useEffect } from "react"
import RegisterForm from "../components/pieces/RegisterForm"
import { User } from "lucide-react"

export default function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const rol = searchParams.get("rol")

  useEffect(() => {
    if (rol && rol !== "freelance" && rol !== "contractor") {
      setSearchParams({})
      navigate("/register", { replace: true })
    }
  }, [rol, setSearchParams, navigate])

  return (
    <main className="w-full min-h-dvh flex flex-col justify-center items-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-10 md:py-16">
      {rol === "freelance" || rol === "contractor" ? (
        <>
          <Card className="w-full max-w-md p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-primary/10">
                <User size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">Crear cuenta</h1>
              <p className="text-sm text-zinc-400">
                Completa tus datos para comenzar
              </p>
            </div>

            <RegisterForm rol={rol} setSearchParams={setSearchParams} />
          </Card>
          <div>
            ¿Ya tienes una cuenta? <Link path="/login">Inicia Sesión</Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-7xl font-bold">
            Elije tu <span className="text-primary">Rol</span>
          </h1>
          <div className="flex max-w-2xl gap-4 font-semibold">
            <Link
              btnStyle
              path="/register?rol=freelance"
              className="group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30">
              <Card>
                <span className="text-white text-center text-xl block group-hover:text-primary">
                  ¡Busco trabajo!
                </span>
                <span>
                  Ideal si estas Buscando propuestas de proyectos que se ajusten
                  a tu perfil
                </span>
              </Card>
            </Link>
            <Link
              btnStyle
              path="/register?rol=contractor"
              className="group p-0 rounded-3xl border-2 border-transparent hover:border-primary hover:shadow-xl hover:shadow-primary/30">
              <Card>
                <span className="text-white text-center text-xl block group-hover:text-primary">
                  ¡Busco talento!
                </span>
                <span>
                  Ideal si estas buscando contratar a alguien que te ayude con
                  tu futuro proyecto
                </span>
              </Card>
            </Link>
          </div>
          <div>
            ¿Ya tienes una cuenta? <Link path="/login">Inicia Sesión</Link>
          </div>
        </>
      )}
    </main>
  )
}
