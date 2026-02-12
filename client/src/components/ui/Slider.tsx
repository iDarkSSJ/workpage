import { cn } from "../../utils/cn"

interface SliderProps {
  disabled?: boolean
  value: number
  min: number
  max: number
  label?: string
  onChange: (value: number) => void
}

export default function Slider({
  disabled = false,
  value,
  onChange,
  min,
  max,
  label = "Message Font Size",
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="label text-sm text-gray-300">{label}</span>
        <span className="value text-sm font-semibold">{value}</span>
      </div>

      <div className="relative h-3.5 flex items-center">
        <div
          className={cn(
            "absolute left-0 h-1 rounded-full pointer-events-none transition-colors bg-primary",
            { "bg-gray-400": disabled },
          )}
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full appearance-none bg-transparent
                     [&::-webkit-slider-runnable-track]:h-1 
                     [&::-webkit-slider-runnable-track]:rounded-full 
                     [&::-webkit-slider-runnable-track]:bg-transparent
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:h-3.5 
                     [&::-webkit-slider-thumb]:w-3.5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:-mt-1.25
                     [&::-webkit-slider-thumb]:transition-transform
                     [&:not(:disabled):hover::-webkit-slider-thumb]:scale-110
                     [&::-moz-range-track]:h-1 
                     [&::-moz-range-track]:rounded-full 
                     [&::-moz-range-track]:bg-transparent
                     [&::-moz-range-thumb]:h-3.5 
                     [&::-moz-range-thumb]:w-3.5 
                     [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:border-0
                     [&:not(:disabled):hover::-moz-range-thumb]:scale-110
                     disabled:[&::-webkit-slider-thumb]:bg-gray-400
                     not-disabled:cursor-pointer
                     disabled:[&::-moz-range-thumb]:bg-gray-400"
        />
      </div>
    </div>
  )
}
