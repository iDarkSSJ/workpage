import { Resend } from "resend"
import ResetPasswordEmail from "./emailComponents/ResetPasswordEmail"
import DeleteAccountEmail from "./emailComponents/DeleteAccountEmail"
import VerifyAccountEmail from "./emailComponents/VerifyAccountEmail"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface VerificationParams {
  user: { name: string; email: string };
  verifyUrl: string;
}

export const sendVerificationEmail = async ({ user, verifyUrl }: VerificationParams) => {
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

interface ResetParams {
  userEmail: string;
  resetUrl: string;
}

export const sendResetPasswordEmail = async ({ userEmail, resetUrl }: ResetParams) => {
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

interface DeleteParams {
  userEmail: string;
  userName: string;
  confirmUrl: string;
}

// Send Delete Account Verification Email
export const sendDeleteAccVerEmail = async ({
  userEmail,
  userName,
  confirmUrl,
}: DeleteParams) => {
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
