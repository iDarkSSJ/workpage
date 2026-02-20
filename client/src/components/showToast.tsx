import toast from "react-hot-toast"
import Toast, { type ToastType } from "./Toast"

export function showToast(toastType: ToastType, description: string) {
  toast.custom(t => <Toast t={t} toastType={toastType} description={description} />)
}
