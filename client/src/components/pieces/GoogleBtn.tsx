import { authClient } from "../../lib/authClient"
import { getErrorMessage } from "../../lib/errorCodes"
import Button from "../Button"
import { showToast } from "../showToast"

export default function GoogleBtn() {
  const googleSignIn = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:5173/", // TODO: use .env instead
      })

      if (error) {
        console.log(error) // DEBUG
        showToast("error", getErrorMessage(error.code))
        return
      }
    } catch (err) {
      showToast("error", "Hubo un error iniciando Sesión con Google.")
      console.log(err)
    }
  }

  return (
    <Button
      type="button"
      onClick={googleSignIn}
      className="
        w-full
        flex items-center justify-center gap-3
        border 
        border-transparent
        bg-primary-bg/45
        text-white
        hover:border-primary
      ">
      <GoogleIcon />
      Google
    </Button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.01 1.53 7.39 2.81l5.48-5.48C33.64 3.54 29.3 1.5 24 1.5 14.6 1.5 6.6 7.66 3.64 16.09l6.66 5.18C12.07 14.4 17.49 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24c0-1.64-.15-3.22-.43-4.73H24v9h12.7c-.55 2.96-2.2 5.47-4.7 7.14l7.2 5.6C43.98 36.98 46.5 30.98 46.5 24z"
      />
      <path
        fill="#FBBC05"
        d="M10.3 28.27A14.5 14.5 0 019.5 24c0-1.49.26-2.93.8-4.27l-6.66-5.18A23.94 23.94 0 001.5 24c0 3.84.92 7.47 2.64 10.45l6.66-5.18z"
      />
      <path
        fill="#34A853"
        d="M24 46.5c6.48 0 11.92-2.14 15.89-5.8l-7.2-5.6c-2 1.35-4.56 2.15-8.69 2.15-6.51 0-11.93-4.9-13.7-11.77l-6.66 5.18C6.6 40.34 14.6 46.5 24 46.5z"
      />
    </svg>
  )
}
