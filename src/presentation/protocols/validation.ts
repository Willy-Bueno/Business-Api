export interface Validation {
  validateCNPJ: (cnpj: string) => boolean
  validateISO: (date: string) => boolean
  isBefore: (startDate: string, endDate: string) => boolean
}
