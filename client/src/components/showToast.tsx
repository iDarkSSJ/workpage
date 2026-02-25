import toast, { type ToastOptions } from "react-hot-toast"
import Toast, { type ToastType } from "./Toast"

export function showToast(
  toastType: ToastType,
  description: string,
  options?: ToastOptions,
) {
  toast.custom(
    (t) => <Toast t={t} toastType={toastType} description={description} />,
    options,
  )
}
