import { cn } from "../../utils/cn"

type TagVariant = "success" | "danger" | "warning" | "neutral" | "primary" | "blue"

interface TagProps {
  children: React.ReactNode
  variant?: TagVariant
  className?: string
}

const variantStyles: Record<TagVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  danger:  "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  neutral: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
  primary: "bg-primary/10 text-primary border-primary/20",
  blue:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

export default function Tag({ children, variant = "neutral", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-sm font-bold uppercase border tracking-wide min-w-fit",
        variantStyles[variant],
        className,
      )}>
      {children}
    </span>
  )
}
