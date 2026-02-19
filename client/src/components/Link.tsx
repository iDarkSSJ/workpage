// DANGER BUTTON -> BOTON ROJO
// PRIMARY BUTTON -> BOTON PRIMARIO CON COLOR
// DEFAULT BUTTON -> BOTON POR DEFECTO GRIS
import { Link as RRLINK } from "react-router"
import { cn } from "../utils/cn"

interface Props {
  btnStyle?: boolean
  children: React.ReactNode
  path: string
  className?: string
  btnType?: "primary" | "danger" | "secondary" | "default"
}

export default function Link({
  children,
  btnStyle = false,
  path,
  className,
  btnType = "default",
}: Props) {
  const btnClassName =
    "px-2.5 py-2 rounded-2xl font-semibold cursor-pointer transition-colors"

  return (
    <RRLINK
      to={path}
      className={cn(
        "text-zinc-400",
        btnStyle && btnClassName,
        !btnStyle && "hover:underline text-primary",
        btnType === "primary" && btnStyle && "hover:bg-primary/10 text-primary",
        btnType === "danger" && btnStyle && "hover:bg-red-400/10 text-danger",
        btnType === "secondary" && "bg-primary text-white hover:bg-primary/90",
        className,
      )}>
      {children}
    </RRLINK>
  )
}
