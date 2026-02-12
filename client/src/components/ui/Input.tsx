import { useState } from "react"
import { cn } from "../../utils/cn"

interface InputProps {
  className?: string
  label: string
  min?: number
  max?: number
}

export default function Input({ className, label, min = 0, max }: InputProps) {
  const [remaining, setRemaining] = useState(max)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueLength = e.target.value.length

    if (max !== undefined) {
      setRemaining(max - valueLength)
    }
  }

  return (
    <label className="relative transition-colors font-semibold">
      <input
        onChange={onChange}
        minLength={min}
        maxLength={max}
        type="text"
        placeholder=""
        className={cn(
          "peer bg-secondary-bg rounded-xl h-12 outline-none border border-zinc-500 hover:border-primary focus:ring focus:ring-primary py-3 px-4.5",
          className,
        )}
      />

      <span
        className="
        pointer-events-none
        absolute left-4
        top-2/5
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
        peer-not-placeholder-shown:scale-75">
        {label}
      </span>

      {max && (
        <span className="absolute right-4 -bottom-5 text-xs text-gray-400 bg-secondary-bg px-1">
          {remaining}
        </span>
      )}
    </label>
  )
}
