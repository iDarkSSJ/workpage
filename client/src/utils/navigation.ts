import type { NavigateFunction } from "react-router"

export const handleSafeBack = (navigate: NavigateFunction, fallback = "/dashboard") => {
  const hasHistory = window.history.state && window.history.state.idx > 0

  if (hasHistory) {
    navigate(-1)
  } else {
    navigate(fallback)
  }
}
