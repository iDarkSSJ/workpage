import { cn } from "../../utils/cn"

// Heredamos todas las propiedades nativas de un input tipo radio
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Radio({
  label,
  disabled,
  className,
  ...props
}: RadioProps) {
  return (
    <label
      className={cn(
        "flex items-center",
        {
          "cursor-pointer": !disabled,
          "opacity-50": disabled,
        },
        className,
      )}>
      <input
        type="radio"
        disabled={disabled}
        {...props}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-600 bg-neutral-900 transition-all checked:border-primary"
      />

      <div className="relative -ml-5 h-5 w-5 pointer-events-none after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-2.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:opacity-0 after:transition-all peer-checked:after:opacity-100">
        {label && (
          <span className="absolute left-7 whitespace-nowrap text-sm select-none text-zinc-200">
            {label}
          </span>
        )}
      </div>
    </label>
  )
}
