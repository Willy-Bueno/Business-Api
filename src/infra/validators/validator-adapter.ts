import validador from 'validator'
import { Validation } from '../../presentation/protocols/validation'

export class ValidatorAdapter implements Validation {
  validateCNPJ (cnpj: string): boolean {
    if (!cnpj.match('^[0-9]{14}$')) {
      return false
    }
    return true
  }

  validateISO (date: string): boolean {
    const isValidISO = validador.isISO8601(date)

    if (!isValidISO) {
      return false
    }
    return true
  }
}
