import { AddCompany, AddCompanyModel } from '../../domain/usecases/add-company'
import { HttpRequest } from '../protocols/http'
import { Validation } from '../protocols/validation'
import { RegistrationCompanyController } from './registration-company'

const makeFakeRequest = (): HttpRequest<AddCompanyModel> => ({
  body: {
    name: 'valid_name_company',
    cnpj: '12345678912345', // 14 digits
    date_foundation: 'any_date_foundation',
    hour_value: 1
  }
})

const makeAddCompany = (): AddCompany => {
  class AddCompanyStub implements AddCompany {
    async add (company: AddCompanyModel): Promise<void> {
      return await new Promise(resolve => resolve())
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
        data_foundation: 'any_data_foundation',
        hour_value: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Missing param: name')
    })
  })

  test('Should return 400 if cnpj no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        data_foundation: 'any_data_foundation',
        hour_value: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Missing param: cnpj')
    })
  })

  test('Should return 400 if date_foundation no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        cnpj: 'any_cnpj',
        hour_value: 9.2
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Missing param: date_foundation')
    })
  })

  test('Should return 400 if hour_value no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        cnpj: 'any_cnpj',
        date_foundation: 'any_date_foundation'
      }
    }
    const response = await sut.handle(httpResquest as any)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Missing param: hour_value')
    })
  })

  test('Should return 400 name is less than 10 or more than 50 characters long', async () => {
    const { sut } = makeSut()
    const httpResquest = { ...makeFakeRequest(), body: { ...makeFakeRequest().body, name: 'invalid' } }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Invalid param: name')
    })
  })

  test('Should return 400 if cnpj contains characters other than numbers', async () => {
    const { sut } = makeSut()
    const httpResquest = { ...makeFakeRequest(), body: { ...makeFakeRequest().body, cnpj: 'any_cnpj' } }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Invalid param: cnpj')
    })
  })

  test('Should return 400 if invalid cnpj is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateCNPJ').mockReturnValueOnce(false)
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Invalid param: cnpj')
    })
  })

  test('Should return 400 if invalid date_fundation is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateISO').mockReturnValueOnce(false)
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual({
      statusCode: 400,
      body: new Error('Invalid param: date_foundation')
    })
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
    expect(response).toEqual({
      statusCode: 500,
      body: new Error()
    })
  })
})
