import { FileQuestion } from "lucide-react"
import Link from "../components/Link"

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-dvh flex flex-col justify-center items-center gap-6 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 text-center">
      <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-primary/10">
        <FileQuestion size={48} className="text-primary" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-bold text-zinc-100">404</h1>
        <h2 className="text-xl font-semibold text-zinc-300">Página no encontrada</h2>
        <p className="text-zinc-400">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
      </div>

      <div className="pt-4">
        <Link path="/dashboard" btnStyle btnType="primary" className="px-8 py-3 text-base font-bold">
          Ir al Dashboard
        </Link>
      </div>
    </div>
  )
}
