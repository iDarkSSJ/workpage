import countries from "../data/countries.json"

export function getCountryName(code: string | null | undefined): string {
  if (!code) return ""
  const country = countries.find((c) => c.code === code)
  return country ? country.name : code
}
