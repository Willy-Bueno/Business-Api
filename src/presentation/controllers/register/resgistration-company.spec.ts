import { AddCompany, AddCompanyModel, CompanyModel } from '../../../domain/usecases/add-company'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError } from '../../helpers/http'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { RegistrationCompanyController } from './registration-company'

const makeFakeCompanyModel = (): CompanyModel => ({
  id: 1,
  name: 'any_name',
  cnpj: 'any_cnpj',
  data_fundacao: 'any_data_fundacao',
  valor_hora: 1
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name_company',
    cnpj: '12345678912345', // 14 digits
    data_fundacao: 'any_data_fundacao',
    valor_hora: 1
  }
})

const makeAddCompany = (): AddCompany => {
  class AddCompanyStub implements AddCompany {
    async add (company: AddCompanyModel): Promise<CompanyModel> {
      return await new Promise(resolve => resolve(
        makeFakeCompanyModel()
      ))
    }
  }
  return new AddCompanyStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validateCNPJ (input: any): boolean {
      return true
    }

    validateISO (input: any): boolean {
      return true
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: RegistrationCompanyController
  validationStub: Validation
  addCompanyStub: AddCompany
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addCompanyStub = makeAddCompany()
  const sut = new RegistrationCompanyController(validationStub, addCompanyStub)
  return {
    sut,
    validationStub,
    addCompanyStub
  }
}

// HttpRequest is typed generically by default,
// but specified in the controller construct.
// For the tests to pass we declare it as any type.

describe('Resgistration Company Controller', () => {
  test('Should return 400 if name no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        cnpj: 'any_cnpj',
        data_fundacao: 'any_data_fundacao',
        valor_hora: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if cnpj no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        data_fundacao: 'any_data_fundacao',
        valor_hora: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual(badRequest(new MissingParamError('cnpj')))
  })

  test('Should return 400 if data_fundacao no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        cnpj: 'any_cnpj',
        valor_hora: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual(badRequest(new MissingParamError('data_fundacao')))
  })

  test('Should return 400 if valor_hora no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        cnpj: 'any_cnpj',
        data_fundacao: 'any_data_fundacao'
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual(badRequest(new MissingParamError('valor_hora')))
  })

  test('Should return 400 name is less than 5 or more than 50 characters long', async () => {
    const { sut } = makeSut()
    const httpResquest = { ...makeFakeRequest(), body: { ...makeFakeRequest().body, name: '-' } }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new InvalidParamError('name')))
  })

  test('Should return 400 if invalid cnpj is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateCNPJ').mockReturnValueOnce(false)
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('cnpj')))
  })

  test('Should return 400 if invalid data_fundacao is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateISO').mockReturnValueOnce(false)
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('data_fundacao')))
  })

  test('Should call AddCompany with correct values', async () => {
    const { sut, addCompanyStub } = makeSut()
    const addSpy = jest.spyOn(addCompanyStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 500 if AddCompany throws', async () => {
    const { sut, addCompanyStub } = makeSut()
    jest.spyOn(addCompanyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
})
