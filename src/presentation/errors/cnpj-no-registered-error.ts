export class CnpjNoRegisteredError extends Error {
  constructor () {
    super()
    this.name = 'CnpjNoRegisteredError'
    this.message = 'The received CNPJ is not registered'
  }
}
