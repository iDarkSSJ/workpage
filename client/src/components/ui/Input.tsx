import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../utils/cn"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  errorMessage?: string
}

export default function Input({
  label,
  errorMessage,
  className,
  id,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type
  const inputId = id || props.name || "input-gen"

  return (
    <div className="flex flex-col mt-4 font-semibold">
      <div className="relative">
        <input
          id={inputId}
          placeholder=" "
          type={inputType}
          {...props}
          className={cn(
            "peer bg-secondary-bg rounded-xl h-12 w-full outline-none border border-zinc-500 hover:border-primary focus:ring focus:ring-primary/50 py-3 px-4 transition-colors",
            errorMessage &&
              "border-danger hover:border-danger focus:ring-danger/50",
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        <label
          htmlFor={inputId}
          className={cn(
            `pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 origin-left bg-secondary-bg px-2 text-zinc-400 transition-all duration-200 peer-focus:whitespace-nowrap
            text-xs md:text-base
             peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary peer-hover:text-primary
             peer-not-placeholder-shown:-translate-y-9 peer-not-placeholder-shown:scale-75 rounded-xl`,
            errorMessage &&
              "peer-focus:text-danger peer-hover:text-danger text-danger",
            isPassword && "pr-10",
          )}>
          {label}
        </label>
      </div>

      <span className="text-danger text-sm min-h-5 mt-1 block">
        {errorMessage}
      </span>
    </div>
  )
}
