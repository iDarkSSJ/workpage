import { cn } from "../utils/cn"

interface Props {
  className?: string
  children: React.ReactNode
}

export default function Card({ className, children }: Props) {
  return (
    <div
      className={cn(
        "bg-secondary-bg shadow-sm shadow-black/40 w-fit p-4 rounded-3xl px-6 pt-4 pb-4.5",
        className,
      )}>
      <div>{children}</div>
    </div>
  )
}
