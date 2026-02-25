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

interface ResetPasswordEmailProps {
  resetUrl: string
}

export default function ResetPasswordEmail({
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Restablece tu contraseña</Preview>

      <Tailwind>
        <Body className="m-0 bg-[#0F0F0F] py-10 px-4 font-sans">
          <Container className="mx-auto max-w-[520px] rounded-2xl bg-[#212121] p-8">
            <Section>
              <Heading className="m-0 text-[22px] font-semibold text-[#F2F2F2]">
                Restablecer contraseña
              </Heading>
            </Section>

            <Section>
              <Text className="mt-4 mb-6 text-sm leading-6 text-[#cfcfcf]">
                Recibimos una solicitud para restablecer tu contraseña.
                <br />
                Si fuiste tú, haz clic en el botón de abajo para continuar.
              </Text>
            </Section>

            <Section className="mb-6 text-center">
              <Button
                href={resetUrl}
                className="inline-block rounded-2xl bg-[#8774E1] px-5 py-3 font-semibold text-white no-underline">
                Restablecer contraseña
              </Button>
            </Section>

            <Section>
              <Text className="mb-4 break-all text-xs text-[#9e9e9e]">
                Si el botón no funciona, copia y pega este enlace en tu
                navegador:
                <br />
                <br />
                <Link href={resetUrl} className="text-[#8774E1] no-underline">
                  {resetUrl}
                </Link>
              </Text>
            </Section>

            <Section>
              <Text className="mt-6 text-xs text-[#6e6e6e]">
                Si no solicitaste este cambio, puedes ignorar este mensaje.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
