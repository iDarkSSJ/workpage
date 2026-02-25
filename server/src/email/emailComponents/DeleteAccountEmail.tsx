import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Heading,
  Preview,
  Tailwind,
} from "@react-email/components"

interface DeleteAccountEmailProps {
  confirmUrl: string
  userName: string
}

export default function DeleteAccountEmail({
  confirmUrl,
  userName,
}: DeleteAccountEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Confirma la eliminación de tu cuenta</Preview>

      <Tailwind>
        <Body className="m-0 bg-[#0F0F0F] py-10 px-4 font-sans">
          <Container className="mx-auto max-w-[520px] rounded-2xl bg-[#212121] p-8">
            <Section>
              <Heading className="m-0 text-[22px] font-semibold text-[#F2F2F2]">
                Confirmar eliminación de cuenta
              </Heading>
            </Section>

            <Section>
              <Text className="mt-4 mb-6 text-sm leading-6 text-[#cfcfcf]">
                Hola {userName},
                <br />
                <br />
                Recibimos una solicitud para eliminar tu cuenta de forma
                permanente.
                <br />
                Esta acción no se puede deshacer y perderás acceso a toda tu
                información.
              </Text>
            </Section>

            <Section className="mb-6 text-center">
              <Button
                href={confirmUrl}
                className="inline-block rounded-2xl bg-[#E14C4C] px-5 py-3 font-semibold text-white no-underline">
                Confirmar eliminación
              </Button>
            </Section>

            <Section>
              <Text className="mb-4 break-all text-xs text-[#9e9e9e]">
                Si el botón no funciona, copia y pega este enlace en tu
                navegador:
                <br />
                <br />
                <Link href={confirmUrl} className="text-[#E14C4C] no-underline">
                  {confirmUrl}
                </Link>
              </Text>
            </Section>

            <Section>
              <Text className="mt-6 text-xs text-[#6e6e6e]">
                Si no solicitaste la eliminación de tu cuenta, puedes ignorar
                este mensaje.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
