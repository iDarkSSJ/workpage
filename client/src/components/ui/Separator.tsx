interface SeparatorProps {
  label?: string
}

export default function Separator({ label }: SeparatorProps) {
  if (!label) {
    return <div className="w-full h-px bg-primary-bg my-4" />
  }

  return (
    <div className="flex items-center w-full">
      <div className="flex-1 h-px bg-primary-bg" />

      <span className="px-3 text-xs text-gray-400 bg-secondary-bg">
        {label}
      </span>

      <div className="flex-1 h-px bg-primary-bg" />
    </div>
  )
}
