import { User } from "lucide-react"
import { Navigate } from "react-router"
import Card from "../components/Card"
import LoginForm from "../features/auth/components/LoginForm"
import Link from "../components/Link"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { data: session } = useAuth()

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-8 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-primary/10">
            <User size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Iniciar Sesión</h1>
          <p className="text-sm text-zinc-400">
            Completa tus datos para comenzar
          </p>
        </div>

        <LoginForm />
      </Card>

      <div className="text-zinc-300">
        ¿No has creado una cuenta?{" "}
        <Link path="/register" className="text-primary hover:underline">
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}
