import { Resend } from "resend"
import ResetPasswordEmail from "./emailComponents/ResetPasswordEmail"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendEmail = async ({ userEmail, resetUrl }) => {
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
