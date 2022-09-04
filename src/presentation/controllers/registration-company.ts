import { AddCompany, AddCompanyModel } from '../../domain/usecases/add-company'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'
import { Validation } from '../protocols/validation'

export class RegistrationCompanyController implements Controller<AddCompanyModel, Error | null> {
  constructor (
    private readonly validation: Validation,
    private readonly addCompany: AddCompany
  ) {}

  async handle (httpRequest: HttpRequest<AddCompanyModel>): Promise<HttpResponse<Error | null>> {
    try {
      const requiredFields = ['name', 'cnpj', 'date_foundation', 'hour_value']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: new Error(`Missing param: ${field}`)
          }
        }
      }

      const { name, cnpj, date_foundation, hour_value } = httpRequest.body
      // if name is less than 10 or more than 50 characters long return 400
      if (name.length < 10 || name.length >= 50) {
        return {
          statusCode: 400,
          body: new Error('Invalid param: name')
        }
      }

      // return 400 if cnpj contains characters other than numbers
      if (cnpj.length !== 14) {
        return {
          statusCode: 400,
          body: new Error('Invalid param: cnpj')
        }
      } else {
        const isValidCNPJ = this.validation.validateCNPJ(cnpj)
        if (!isValidCNPJ) {
          return {
            statusCode: 400,
            body: new Error('Invalid param: cnpj')
          }
        }
      }

      const isISODate = this.validation.validateISO(date_foundation)
      if (!isISODate) {
        return {
          statusCode: 400,
          body: new Error('Invalid param: date_foundation')
        }
      }

      // verify if hour_value is a number
      if (typeof hour_value !== 'number') {
        return {
          statusCode: 400,
          body: new Error('Invalid param: hour_value')
        }
      }

      hour_value.toFixed(2)

      await this.addCompany.add({
        name,
        cnpj,
        date_foundation,
        hour_value
      })

      return {
        statusCode: 200,
        body: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: error
      }
    }
  }
}
