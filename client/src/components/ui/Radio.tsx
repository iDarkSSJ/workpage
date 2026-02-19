import { cn } from "../../utils/cn"

interface RadioProps {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  name: string
  value: string
  label?: string
}

export default function Radio({
  checked = false,
  onChange,
  disabled = false,
  name,
  value,
  label,
}: RadioProps) {
  return (
    <label
      className={cn("flex items-center", {
        "cursor-pointer": !disabled,
        "opacity-50": disabled,
      })}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-600 bg-neutral-900 transition-all checked:border-primary"
      />

      <div className="relative -ml-5 h-5 w-5 pointer-events-none after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-2.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:opacity-0 after:transition-all peer-checked:after:opacity-100">
        {label && (
          <span className="absolute left-7 whitespace-nowrap text-sm select-none">
            {label}
          </span>
        )}
      </div>
    </label>
  )
}
