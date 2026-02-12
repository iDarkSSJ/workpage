import { cn } from "../utils/cn"

interface ToastProps {
  toastType: "error" | "success" | "warning" | "info"
  description: string
}

export default function Toast({ toastType, description }: ToastProps) {
  return (
    <div
      className={cn(
        "bg-primary-bg font-semibold rounded-xl px-4 py-3 ring-1",
        {
          "ring-emerald-400": toastType === "success",
          "ring-rose-400": toastType === "error",
          "ring-amber-400": toastType === "warning",
          "ring-indigo-400": toastType === "info",
        },
      )}>
      <div
        className={cn("mb-1", {
          "text-emerald-400": toastType === "success",
          "text-rose-400": toastType === "error",
          "text-amber-400": toastType === "warning",
          "text-indigo-400": toastType === "info",
        })}>
        {toastType === "success"
          ? "Operación Exitosa"
          : toastType === "error"
            ? "Error!"
            : toastType === "warning"
              ? "Advertencia"
              : "Información"}
      </div>

      <div className="text-zinc-300 font-normal">{description}</div>
    </div>
  )
}
