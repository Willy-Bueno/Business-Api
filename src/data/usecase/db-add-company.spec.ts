import { AddCompanyModel } from '../../domain/usecases/add-company'
import { HttpRequest } from '../../presentation/protocols/http'
import { CompanyRepository } from '../protocols/company-repository'
import { DbAddCompany } from './db-add-company'

const makeAddCompanyRepository = (): CompanyRepository => {
  class CompanyRepositoryStub implements CompanyRepository {
    async add (company: AddCompanyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new CompanyRepositoryStub()
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
  companyRepositoryStub: CompanyRepository
}

const makeSut = (): SutTypes => {
  const companyRepositoryStub = makeAddCompanyRepository()
  const sut = new DbAddCompany(companyRepositoryStub)
  return {
    sut,
    companyRepositoryStub
  }
}

describe('Db Add Company', () => {
  test('Should call CompanyRepository with correct values', async () => {
    const { sut, companyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(companyRepositoryStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.add(httpRequest.body)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should trhow if CompanyRepository throws', async () => {
    const { sut, companyRepositoryStub } = makeSut()
    jest.spyOn(companyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeRequest()
    const promise = sut.add(httpRequest.body)
    await expect(promise).rejects.toThrow()
  })
})
