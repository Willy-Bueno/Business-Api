import { AddCompanyModel } from '../../domain/usecases/add-company'
import { HttpRequest } from '../../presentation/protocols/http'
import { AddCompanyRepository } from '../protocols/add-company-repository'
import { DbAddCompany } from './db-add-company'

const makeAddCompanyRepository = (): AddCompanyRepository => {
  class AddCompanyRepositoryStub implements AddCompanyRepository {
    async addOnRepository (company: AddCompanyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddCompanyRepositoryStub()
}

const makeFakeRequest = (): HttpRequest<AddCompanyModel> => ({
  body: {
    name: 'valid_name_company',
    cnpj: '12345678912345', // 14 digits
    date_foundation: 'any_date_foundation',
    hour_value: 1
  }
})

interface SutTypes {
  sut: DbAddCompany
  addCompanyRepositoryStub: AddCompanyRepository
}

const makeSut = (): SutTypes => {
  const addCompanyRepositoryStub = makeAddCompanyRepository()
  const sut = new DbAddCompany(addCompanyRepositoryStub)
  return {
    sut,
    addCompanyRepositoryStub
  }
}

describe('Db Add Company', () => {
  test('Should call AddCompanyRepository with correct values', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addCompanyRepositoryStub, 'addOnRepository')
    const httpRequest = makeFakeRequest()
    await sut.add(httpRequest.body)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should trhow if AddCompanyRepository throws', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()
    jest.spyOn(addCompanyRepositoryStub, 'addOnRepository').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeRequest()
    const promise = sut.add(httpRequest.body)
    await expect(promise).rejects.toThrow()
  })
})
