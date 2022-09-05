export class CnpjInUseError extends Error {
  constructor () {
    super()
    this.name = 'CnpjInUseError'
    this.message = 'The received CNPJ is already in use'
  }
}
