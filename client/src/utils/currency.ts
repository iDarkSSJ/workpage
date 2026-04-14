export const formatAmount = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "0"
  
  const num = typeof value === "string" ? parseFloat(value) : value
  
  if (isNaN(num)) return "0"
  
  return Math.floor(num).toString()
}
