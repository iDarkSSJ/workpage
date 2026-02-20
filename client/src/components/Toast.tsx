import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react"
import { cn } from "../utils/cn"
import toast, { type Toast } from "react-hot-toast"

export type ToastType = "error" | "success" | "warning" | "info"

interface ToastProps {
  t: Toast
  toastType: ToastType
  description: string
}

const PROPERTIES = {
  success: {
    text: "text-emerald-400",
    ring: "ring-emerald-400",
    message: "Operación Exitosa",
    icon: <CircleCheck className="w-5 h-5" />,
  },
  error: {
    text: "text-rose-400",
    ring: "ring-rose-400",
    message: "Error!",
    icon: <CircleX className="w-5 h-5" />,
  },
  warning: {
    text: "text-amber-400",
    ring: "ring-amber-400",
    message: "Advertencia",
    icon: <TriangleAlert className="w-5 h-5" />,
  },
  info: {
    text: "text-indigo-400",
    ring: "ring-indigo-400",
    message: "Información",
    icon: <Info className="w-5 h-5" />,
  },
}

export default function Toast({ t, toastType, description }: ToastProps) {
  const { text, ring, message, icon } = PROPERTIES[toastType]

  return (
    <div
      onClick={() => toast.dismiss(t.id)}
      className={cn(
        "bg-primary-bg ring-1 rounded-xl px-4 py-3 shadow-md flex gap-3 items-start animate-slideInRight",
        ring,
      )}>
      <div className={cn("mt-0.5", text)}>{icon}</div>

      <div className="flex flex-col">
        <span className={cn("font-semibold", text)}>{message}</span>

        <span className="text-zinc-300 text-sm font-normal">{description}</span>
      </div>
    </div>
  )
}
