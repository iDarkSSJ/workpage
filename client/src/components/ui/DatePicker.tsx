import { useState } from "react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { Calendar } from "lucide-react"
import { cn } from "../../utils/cn"
import Button from "../Button"
import Input from "./Input"

interface DatePickerProps {
  label: string
  value: string
  onChange: (date: string) => void
  errorMessage?: string
  className?: string
}

export default function DatePicker({
  label,
  value,
  onChange,
  errorMessage = "",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined
  const displayValue = selectedDate
    ? format(selectedDate, "dd MMM yyyy", { locale: es })
    : ""

  return (
    <div className={cn("relative mt-4", className)}>
      <div className="relative">
        <Input
          type="text"
          readOnly
          value={displayValue}
          onClick={() => setOpen(true)}
          label={label}
          errorMessage={errorMessage}
          className="pr-10 cursor-pointer w-full text-zinc-100"
        />

        <Calendar
          size={16}
          className="absolute right-3 top-6 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 bg-secondary-bg border border-zinc-700 p-4 rounded-xl shadow-xl w-auto min-w-76">
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="relative z-50 flex flex-col items-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onChange(date ? format(date, "yyyy-MM-dd") : "")
                setOpen(false)
              }}
              locale={es}
              // ESTO ES PARA QUE SE VEA EL CALENDARIO CON EL COLOR VIOLETA
              // COMPLICADO PERO FUNCIONA :D - jose luis
              style={
                {
                  "--rdp-accent-color": "#8b5cf6",
                  "--rdp-background-color": "rgba(139, 92, 246, 0.2)",
                  "--rdp-accent-color-dark": "#8b5cf6",
                  "--rdp-background-color-dark": "rgba(139, 92, 246, 0.2)",
                  "--rdp-outline": "2px solid #8b5cf6",
                  "--rdp-outline-selected": "2px solid #a855f7",
                  color: "#e4e4e7",
                } as React.CSSProperties
              }
            />

            {value && (
              <Button
                type="button"
                btnType="danger"
                className="mt-3 w-full text-xs py-2"
                onClick={() => {
                  onChange("")
                  setOpen(false)
                }}>
                Limpiar fecha
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
