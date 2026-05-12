import { type ReactNode } from "react"
import { cn } from "../../utils/cn"

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | string
}

interface Props {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  disabled?: boolean
  className?: string
}

export default function TabSelector({
  tabs,
  activeTab,
  onChange,
  disabled = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/50 w-fit flex-wrap",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-base font-bold transition-all w-full sm:w-fit",
              isActive
                ? "bg-primary text-zinc-900 shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
            )}>
            {tab.icon && tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge !== null && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-zinc-800 text-sm text-zinc-400">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
