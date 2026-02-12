import { cn } from "../../utils/cn"

interface SwitchProps {
  checked: boolean
  disabled?: boolean
  label: string
  onChange: (checked: boolean) => void
}

export default function Switch({
  checked,
  label,
  disabled = false,
  onChange,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 mb-2",
        disabled ? "opacity-50" : "cursor-pointer"
      )}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />

      <span className="leading-none">{label}</span>

      <span
        className="
        mt-1.75
          relative block h-4 w-10 rounded-full
          bg-neutral-500 transition-colors
          peer-checked:bg-primary

          before:content-['']
          before:absolute before:left-0 before:top-1/2
          before:h-5 before:w-5
          before:-translate-y-1/2
          before:rounded-full
          before:bg-neutral-500
          before:shadow
          before:transition-all
          peer-checked:before:translate-x-5
          peer-checked:before:bg-primary

          after:content-['']
          after:absolute after:left-[3.5px] after:top-1/2
          after:h-3.5 after:w-3.5
          after:-translate-y-1/2
          after:rounded-full
          after:bg-neutral-800
          after:transition-all
          peer-checked:after:translate-x-5
        "
      />
    </label>
  )
}
