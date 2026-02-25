import { Resend } from "resend"
import ResetPasswordEmail from "./emailComponents/ResetPasswordEmail"
import DeleteAccountEmail from "./emailComponents/DeleteAccountEmail"
import VerifyAccountEmail from "./emailComponents/VerifyAccountEmail"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendVerificationEmail = async ({ user, verifyUrl }) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Verificación de Cuenta",
    react: VerifyAccountEmail({ verifyUrl, userName: user.name }),
  })

  if (error) {
    return console.error({ error })
  }
}

export const sendResetPasswordEmail = async ({ userEmail, resetUrl }) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: userEmail,
    subject: "Restablecer contraseña",
    react: ResetPasswordEmail({ resetUrl }),
  })

  if (error) {
    return console.error({ error })
  }
}

// Send Delete Account Verification Email
export const sendDeleteAccVerEmail = async ({
  userEmail,
  userName,
  confirmUrl,
}) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: userEmail,
    subject: "Verificación de eliminacion de cuenta",
    react: DeleteAccountEmail({ confirmUrl, userName }),
  })

  if (error) {
    return console.error({ error })
  }
}
