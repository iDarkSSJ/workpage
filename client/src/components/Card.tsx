interface Props {
  children: React.ReactNode
}

export default function Card({ children }: Props) {
  return (
    <div className="bg-secondary-bg shadow-sm shadow-black/40 w-fit p-4 rounded-3xl select-none mx-auto px-6 pt-4 pb-4.5">
      <div>{children}</div>
    </div>
  )
}
