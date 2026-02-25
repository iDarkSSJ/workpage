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

interface VerifyAccountEmailProps {
  verifyUrl: string
  userName: string
}

export default function VerifyAccountEmail({
  verifyUrl,
  userName,
}: VerifyAccountEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Verifica tu correo electrónico</Preview>

      <Tailwind>
        <Body className="m-0 bg-[#0F0F0F] py-10 px-4 font-sans">
          <Container className="mx-auto max-w-[520px] rounded-2xl bg-[#212121] p-8">
            <Section>
              <Heading className="m-0 text-[22px] font-semibold text-[#F2F2F2]">
                Verificar correo electrónico
              </Heading>
            </Section>

            <Section>
              <Text className="mt-4 mb-6 text-sm leading-6 text-[#cfcfcf]">
                Hola {userName},
                <br />
                <br />
                Gracias por crear tu cuenta.
                <br />
                Para completar el registro, debes verificar tu dirección de
                correo electrónico.
              </Text>
            </Section>

            <Section className="mb-6 text-center">
              <Button
                href={verifyUrl}
                className="inline-block rounded-2xl bg-[#8774E1] px-5 py-3 font-semibold text-white no-underline">
                Verificar correo
              </Button>
            </Section>

            <Section>
              <Text className="mb-4 break-all text-xs text-[#9e9e9e]">
                Si el botón no funciona, copia y pega este enlace en tu
                navegador:
                <br />
                <br />
                <Link href={verifyUrl} className="text-[#8774E1] no-underline">
                  {verifyUrl}
                </Link>
              </Text>
            </Section>

            <Section>
              <Text className="mt-6 text-xs text-[#6e6e6e]">
                Si no creaste esta cuenta, puedes ignorar este mensaje.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
