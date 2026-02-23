import loader from "../assets/loader.svg"

export default function Loader() {
  return (
    <div className="fixed z-100 bg-black/50 w-full h-dvh  top-0 left-0 flex items-center justify-center">
      <img className="w-15 h-15s animate-spin" src={loader} alt="Loader Icon" />
    </div>
  )
}
