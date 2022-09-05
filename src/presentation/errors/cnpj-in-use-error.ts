export class CnpjInUseError extends Error {
  constructor () {
    super('The received CNPJ is already in use')
    this.name = 'CnpjInUseError'
  }
}
