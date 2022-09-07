import { CalculateCost } from '../../../domain/usecases/calculate-cost'
import { CnpjNoRegisteredError } from '../../errors/cnpj-no-registered-error'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class ServiceCalculationByPeriodController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly CalculateCost: CalculateCost
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['cnpj', 'data_inicio', 'data_fim']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { cnpj, data_inicio, data_fim } = httpRequest.body
      const isValidCNPJ = this.validation.validateCNPJ(cnpj)
      if (!isValidCNPJ) {
        return badRequest(new InvalidParamError('cnpj'))
      }

      const requiredDataField = ['data_inicio', 'data_fim']
      for (const field of requiredDataField) {
        const isValidISO = this.validation.validateISO(httpRequest.body[field])
        if (!isValidISO) {
          return badRequest(new InvalidParamError(field))
        }
      }

      const isValid = this.validation.isBefore(data_inicio, data_fim)
      if (!isValid) {
        return badRequest(new InvalidParamError('data_fim'))
      }

      const result = await this.CalculateCost.calculate({
        cnpj,
        data_inicio,
        data_fim
      })

      if (!result) {
        return badRequest(new CnpjNoRegisteredError())
      }

      return ok(result)
    } catch (error) {
      return serverError()
    }
  }
}
