import { AddCompany } from '../../domain/usecases/add-company'
import { CnpjInUseError } from '../errors/cnpj-in-use-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, forbidden, noContent, serverError } from '../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'
import { Validation } from '../protocols/validation'

export class RegistrationCompanyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addCompany: AddCompany
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'cnpj', 'date_foundation', 'hour_value']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: badRequest(new MissingParamError(field))
          }
        }
      }

      const { name, cnpj, date_foundation, hour_value } = httpRequest.body
      // if name is less than 10 or more than 50 characters long return 400
      if (name.length < 10 || name.length >= 50) {
        return {
          statusCode: 400,
          body: badRequest(new InvalidParamError('name'))
        }
      }

      const isValidCNPJ = this.validation.validateCNPJ(cnpj)
      if (!isValidCNPJ) {
        return {
          statusCode: 400,
          body: badRequest(new InvalidParamError('cnpj'))
        }
      }

      const isISODate = this.validation.validateISO(date_foundation)
      if (!isISODate) {
        return {
          statusCode: 400,
          body: badRequest(new InvalidParamError('date_foundation'))
        }
      }

      // verify if hour_value is a number
      if (typeof hour_value !== 'number') {
        return {
          statusCode: 400,
          body: badRequest(new InvalidParamError('hour_value'))
        }
      }

      hour_value.toFixed(2)

      const company = await this.addCompany.add({
        name,
        cnpj,
        date_foundation,
        hour_value
      })

      if (company) {
        return {
          statusCode: 400,
          body: forbidden(new CnpjInUseError())
        }
      }

      return noContent()
    } catch (error) {
      return serverError()
    }
  }
}
