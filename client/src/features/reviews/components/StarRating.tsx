import { Star } from "lucide-react"
import { cn } from "../../../utils/cn"
import Input from "../../../components/ui/Input"

interface Props {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  showInput?: boolean
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  showInput = true,
}: Props) {
  const starsArray = [1, 2, 3, 4, 5]

  const handleStarClick = (star: number) => {
    if (!readonly && onChange) {
      onChange(star)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!readonly && onChange) {
      const val = parseInt(e.target.value)
      if (!isNaN(val)) {
        onChange(Math.min(5, Math.max(1, val)))
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        {starsArray.map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleStarClick(star)}
            className={cn(
              "transition-all duration-200",
              !readonly && "hover:scale-110 active:scale-95",
              star <= value
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-600 fill-transparent hover:text-amber-400/50",
            )}>
            <Star
              fill={star <= value ? "currentColor" : "transparent"}
              size={readonly ? 18 : 32}
            />
          </button>
        ))}
      </div>

      {!readonly && showInput && (
        <div className="max-w-[120px]">
          <Input
            label="Puntaje"
            type="number"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={handleInputChange}
            className="text-center font-bold"
          />
        </div>
      )}
    </div>
  )
}
