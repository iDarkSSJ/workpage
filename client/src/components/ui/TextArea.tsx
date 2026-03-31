import { useState } from "react"
import { cn } from "../../utils/cn"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  label: string
  min?: number
  max?: number
  errorMessage?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function TextArea({
  className,
  label,
  min = 0,
  max,
  errorMessage = "",
  onChange,
  ...rest
}: TextAreaProps) {
  const [remaining, setRemaining] = useState(max)

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
    <label className="relative transition-colors font-semibold inline-block">
      <textarea
        onChange={handleChange}
        minLength={min}
        maxLength={max}
        placeholder=""
        rows={1}
        {...rest}
        className={cn(
          "peer bg-secondary-bg rounded-xl min-h-12 resize-none overflow-hidden outline-none border border-zinc-500 hover:border-primary focus:ring focus:ring-primary py-3 px-4.5",
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
        top-6
        -translate-y-1/2
        origin-left
        bg-secondary-bg px-2
        text-zinc-400
        transition-all duration-200

        peer-focus:top-0
        peer-focus:scale-75
        peer-focus:text-primary
        peer-hover:text-primary

        peer-not-placeholder-shown:top-0
        peer-not-placeholder-shown:scale-75`,
          errorMessage &&
            "peer-focus:text-danger peer-hover:text-danger text-danger",
        )}>
        {label}
      </span>

      {max && (
        <span className="absolute right-4 -bottom-px text-xs text-gray-400 bg-secondary-bg px-1">
          {remaining}
        </span>
      )}

      <span className="text-danger text-sm min-h-5 block">{errorMessage}</span>
    </label>
  )
}
