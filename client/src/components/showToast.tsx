import toast from "react-hot-toast"
import Toast, { type ToastType } from "./Toast"

export function showToast(toastType: ToastType, description: string) {
  toast.custom(<Toast toastType={toastType} description={description} />)
}
