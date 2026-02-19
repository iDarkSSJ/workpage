// DANGER BUTTON -> BOTON ROJO
// PRIMARY BUTTON -> BOTON PRIMARIO CON COLOR
// SECONDARY BUTTON -> BOTON CON FULL PRIMARY COLOR DE FONDO
// DEFAULT BUTTON -> BOTON POR DEFECTO GRIS

import { cn } from "../utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  btnType?: "primary" | "danger" | "secondary" | "default"
}

export default function Button({
  children,
  className,
  btnType = "default",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "px-2.5 py-2 rounded-2xl font-semibold cursor-pointer transition-colors",
        btnType === "default" && "text-zinc-400 hover:bg-gray-500/10",
        btnType === "primary" && "text-primary hover:bg-primary/10",
        btnType === "danger" && "text-red-500 hover:bg-red-500/10",
        btnType === "secondary" && "bg-primary text-white hover:bg-primary/90",
        className,
      )}>
      {children}
    </button>
  )
}
