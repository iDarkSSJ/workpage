import { User } from "lucide-react"
import Card from "../components/Card"
import LoginForm from "../components/pieces/LoginForm"
import Link from "../components/Link"

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center mt-24 space-y-8 mx-4">
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
      <div>
        ¿No has creado una cuenta? <Link path="/register">Crear cuenta</Link>
      </div>
    </main>
  )
}
