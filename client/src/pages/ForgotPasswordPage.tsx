import { KeyRound } from "lucide-react"
import Card from "../components/Card"
import ForgotPasswordForm from "../components/pieces/ForgotPasswordForm"
import Link from "../components/Link"

export default function ForgotPasswordPage() {
  return (
    <main className="w-full min-h-dvh flex flex-col justify-center items-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-10 md:py-16">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-primary/10">
            <KeyRound size={36} className="text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-100">
            Restablecer Contraseña
          </h1>
          <p className="text-sm text-zinc-400">
            Ingresa tu correo para reinicia tu contraseña
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mx-auto w-fit pt-4">
          ¿No has creado una cuenta? <Link path="/register">Crear cuenta</Link>
        </div>
      </Card>
    </main>
  )
}
