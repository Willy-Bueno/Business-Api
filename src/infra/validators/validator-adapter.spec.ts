import { ValidatorAdapter } from './validator-adapter'

const makeSut = (): ValidatorAdapter => {
  return new ValidatorAdapter()
}

describe('CNPJ "Validator Adapter"', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.validateCNPJ('invalid_cnpj')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.validateCNPJ('12345678912345')
    expect(isValid).toBe(true)
  })
})

describe('ISO Date "Validator Adapter"', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.validateISO('invalid_ISO')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.validateISO('2022-09-04')
    expect(isValid).toBe(true)
  })
})
