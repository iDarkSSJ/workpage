import { useState } from "react"
import { cn } from "../../utils/cn"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: "text" | "password" | "email"
  label: string
  maxLength?: number
  errorMessage?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  className,
  type = "text",
  label,
  maxLength,
  errorMessage = "",
  onChange,
  ...rest
}: InputProps) {
  const [remaining, setRemaining] = useState(maxLength)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueLength = e.target.value.length
    if (maxLength !== undefined) {
      setRemaining(maxLength - valueLength)
    }
    if (onChange) onChange(e)
  }

  return (
    <label className="transition-colors font-semibold mt-4">
      <div className="relative">
        <input
          onChange={handleChange}
          maxLength={maxLength}
          type={type}
          placeholder=""
          {...rest}
          className={cn(
            "peer bg-secondary-bg rounded-xl h-12 outline-none border border-zinc-500 hover:border-primary focus:ring focus:ring-primary py-3 px-4.5",
            errorMessage &&
              "border-danger hover:border-danger focus:ring-danger",
            className,
          )}
        />

        <span
          className={cn(
            `
          pointer-events-none
          absolute left-4
          top-2/4
          -translate-y-1/2
          origin-left
        bg-secondary-bg px-2
        text-zinc-400
          transition-all duration-200

          peer-focus:-translate-y-10
          peer-focus:scale-75
        peer-focus:text-primary
        peer-hover:text-primary

          peer-not-placeholder-shown:-translate-y-10
          peer-not-placeholder-shown:scale-75`,
            errorMessage &&
              "peer-focus:text-danger peer-hover:text-danger text-danger",
          )}>
          {label}
        </span>

        {maxLength && (
          <span className="absolute right-4 -bottom-2 text-xs text-gray-400 bg-secondary-bg px-1">
            {remaining}
          </span>
        )}
      </div>

      <span className="text-danger text-sm min-h-5 block">{errorMessage}</span>
    </label>
  )
}
