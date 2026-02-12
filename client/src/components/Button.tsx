// DANGER BUTTON -> BOTON ROJO
// PRIMARY BUTTON -> BOTON PRIMARIO CON COLOR
// DEFAULT BUTTON -> BOTON POR DEFECTO GRIS

import { cn } from "../utils/cn"

interface Props {
  children: React.ReactNode
  className: string
  btnType?: "primary" | "danger" | "default"
}

export default function Button({
  children,
  className,
  btnType = "default",
}: Props) {
  return (
    <button
      className={cn(
        "px-2.5 py-2 rounded-2xl font-semibold cursor-pointer  transition-colors hover:bg-gray-500/10 text-zinc-400",
        btnType === "primary" && "hover:bg-primary/10 text-primary",
        btnType === "danger" && "hover:bg-red-400/10 text-danger",
        className,
      )}>
      {children}
    </button>
  )
}
