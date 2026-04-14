import { useState } from "react"
import { cn } from "../../utils/cn"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  min?: number
  max?: number
  errorMessage?: string
}

export default function TextArea({
  className,
  label,
  min = 0,
  max,
  errorMessage = "",
  onChange,
  id,
  name,
  ...rest
}: TextAreaProps) {
  const [remaining, setRemaining] = useState(max)

  const inputId = id || name || "textarea-gen"

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valueLength = e.target.value.length

    if (max !== undefined) {
      setRemaining(max - valueLength)
    }

    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"

    if (onChange) onChange(e)
  }

  return (
    <div className="flex flex-col mt-4 font-semibold">
      <div className="relative">
        <textarea
          name={name}
          id={inputId}
          onChange={handleChange}
          minLength={min}
          maxLength={max}
          placeholder=" "
          rows={1}
          {...rest}
          className={cn(
            "peer bg-secondary-bg rounded-xl min-h-12 w-full resize-none overflow-hidden outline-none border border-zinc-500 hover:border-primary focus:ring focus:ring-primary/50 py-3 px-4 transition-colors",
            errorMessage &&
              "border-danger hover:border-danger focus:ring-danger/50",
            className,
          )}
        />

        <label
          htmlFor={inputId}
          className={cn(
            `pointer-events-none absolute left-4 top-6 -translate-y-1/2 origin-left bg-secondary-bg px-2 text-zinc-400 transition-all duration-200
             peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary peer-hover:text-primary
             peer-not-placeholder-shown:-translate-y-9 peer-not-placeholder-shown:scale-75`,
            errorMessage &&
              "peer-focus:text-danger peer-hover:text-danger text-danger",
          )}>
          {label}
        </label>

        {max !== undefined && (
          <span className="absolute right-4 -bottom-px text-sm text-zinc-400 bg-secondary-bg px-1">
            {remaining}
          </span>
        )}
      </div>

      <span className="text-danger text-sm min-h-5 mt-1 block">
        {errorMessage}
      </span>
    </div>
  )
}
