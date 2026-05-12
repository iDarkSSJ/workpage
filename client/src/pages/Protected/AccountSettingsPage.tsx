import { useState } from "react"
import { Shield, User, Trash2, AlertCircle, Mail, Key } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import {
  useUpdateUser,
  useDeleteAccount,
  useForgotPassword,
} from "../../features/auth/api/useAuth"
import { nameSchema } from "../../features/auth/schemas/auth.schema"
import Input from "../../components/ui/Input"
import Button from "../../components/Button"
import Card from "../../components/Card"

export default function AccountSettingsPage() {
  const { data: session } = useAuth()
  const updateUserMut = useUpdateUser()
  const deleteAccountMut = useDeleteAccount()
  const forgotPasswordMut = useForgotPassword()

  const [nameError, setNameError] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdateName = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string

    const validation = nameSchema.safeParse(name)
    if (!validation.success) {
      setNameError(validation.error.issues[0].message)
      return
    }

    setNameError("")
    updateUserMut.mutate(name)
  }

  const handleRequestPasswordReset = () => {
    if (!session?.user?.email) return
    forgotPasswordMut.mutate({ email: session.user.email })
  }

  return (
    <div className="flex-1 w-full bg-primary-bg py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            Ajustes de cuenta
          </h1>
          <p className="text-zinc-400 mt-2">
            Gestiona tu información personal y seguridad.
          </p>
        </div>

        {/* PERFIL BÁSICO */}
        <Card className="w-full">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Perfil</h2>
          </div>
          <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
            <Input
              name="name"
              label="Nombre completo"
              defaultValue={session?.user?.name ?? ""}
              errorMessage={nameError}
              className="w-full"
            />
            <Button
              type="submit"
              btnType="secondary"
              disabled={updateUserMut.isPending}
              className="px-6 py-2">
              {updateUserMut.isPending ? "Actualizando..." : "Guardar cambios"}
            </Button>
          </form>
        </Card>

        {/* SEGURIDAD */}
        <Card className="w-full">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <Shield size={20} className="text-emerald-400" />
            <h2 className="text-lg font-semibold">Seguridad</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-bg/50 p-4 rounded-2xl flex gap-3 border border-zinc-700/50">
              <Key className="text-primary shrink-0" size={20} />
              <p className="text-sm text-zinc-300">
                Por motivos de seguridad y simplicidad, el cambio de contraseña
                se gestiona a través de tu correo electrónico.
              </p>
            </div>

            <Button
              onClick={handleRequestPasswordReset}
              btnType="secondary"
              disabled={forgotPasswordMut.isPending}
              className="flex items-center gap-2 px-6 py-2">
              <Mail size={18} />
              {forgotPasswordMut.isPending
                ? "Enviando enlace..."
                : "Cambiar contraseña vía Email"}
            </Button>

            {forgotPasswordMut.isSuccess && (
              <p className="text-emerald-400 text-sm font-medium">
                Te hemos enviado un enlace a tu correo para que gestiones tu
                contraseña.
              </p>
            )}
          </div>
        </Card>

        {/* ZONA DE PELIGRO */}
        <Card className="w-full border border-danger/20">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <Trash2 size={20} className="text-danger" />
            <h2 className="text-lg font-semibold">Zona de peligro</h2>
          </div>

          {deleteAccountMut.isSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
              <Mail className="text-emerald-400 mx-auto" size={32} />
              <h3 className="text-emerald-400 font-bold text-lg">
                Verifica tu correo
              </h3>
              <p className="text-zinc-300 text-sm">
                Hemos enviado un correo de confirmación a{" "}
                <strong>{session?.user?.email}</strong>. Debes hacer clic en el
                enlace para eliminar tu cuenta permanentemente.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-danger/10 p-4 rounded-2xl flex gap-3 mb-6">
                <AlertCircle className="text-danger shrink-0" size={20} />
                <p className="text-sm text-zinc-300">
                  Una vez que solicites la eliminación, te enviaremos un correo
                  de confirmación. La cuenta no se borrará hasta que verifiques
                  tu identidad.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <Button
                  btnType="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2">
                  Cerrar cuenta permanentemente
                </Button>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-zinc-100 font-semibold italic">
                    ¿Estás completamente seguro de iniciar el proceso?
                  </p>
                  <div className="flex gap-4">
                    <Button
                      btnType="danger"
                      disabled={deleteAccountMut.isPending}
                      onClick={() => deleteAccountMut.mutate()}
                      className="px-6 py-2">
                      {deleteAccountMut.isPending
                        ? "Solicitando..."
                        : "Sí, enviar correo de confirmación"}
                    </Button>
                    <Button
                      btnType="default"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-2 border border-zinc-700">
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
