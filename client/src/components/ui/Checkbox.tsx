import { cn } from "../../utils/cn"

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  label,
}: CheckboxProps) {
  return (
    <div>
      <label
        className={cn("relative flex items-center gap-2", {
          "cursor-pointer": !disabled,
          "opacity-50": disabled,
        })}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer h-5 w-5 appearance-none rounded border-2 border-gray-600
               checked:bg-primary checked:border-primary"
        />

        <svg
          className="pointer-events-none absolute left-0 h-5 w-5
               text-white opacity-0 peer-checked:opacity-100"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.2">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          />
        </svg>

        {label && <span className="text-sm select-none">{label}</span>}
      </label>
    </div>
  )
}
