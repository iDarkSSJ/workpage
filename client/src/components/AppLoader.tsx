import Loader from "./Loader"
import { useLoading } from "../context/LoadingContext"

export default function AppLoader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return <Loader />
}
