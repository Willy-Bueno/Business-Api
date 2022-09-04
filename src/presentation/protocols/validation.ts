export interface Validation {
  validateCNPJ: (field: string) => boolean
  validateISO: (field: string) => boolean
}
