import { AddCompany } from '../../../domain/usecases/add-company'
import { CnpjInUseError } from '../../errors/cnpj-in-use-error'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, forbidden, noContent, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class RegistrationCompanyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addCompany: AddCompany
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'cnpj', 'data_fundacao', 'valor_hora']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, cnpj, data_fundacao, valor_hora } = httpRequest.body
      // if name is less than 5 or more than 50 characters long return 400
      if (name.length < 5 || name.length > 50) {
        return badRequest(new InvalidParamError('name'))
      }

      const isValidCNPJ = this.validation.validateCNPJ(cnpj)
      if (!isValidCNPJ) {
        return badRequest(new InvalidParamError('cnpj'))
      }

      const isISODate = this.validation.validateISO(data_fundacao)
      if (!isISODate) {
        return badRequest(new InvalidParamError('data_fundacao'))
      }

      // verify if valor_hora is a number
      if (typeof valor_hora !== 'number') {
        return badRequest(new InvalidParamError('valor_hora'))
      }

      valor_hora.toFixed(2)

      const company = await this.addCompany.add({
        name,
        cnpj,
        data_fundacao,
        valor_hora
      })

      if (company) {
        return forbidden(new CnpjInUseError())
      }

      return noContent()
    } catch (error) {
      return serverError()
    }
  }
}
