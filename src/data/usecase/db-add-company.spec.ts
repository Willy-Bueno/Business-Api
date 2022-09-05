import { AddCompanyModel, CompanyModel } from '../../domain/usecases/add-company'
import { AddCompanyRepository } from '../protocols/company-repository'
import { LoadCompanyByCnpj } from '../protocols/load-company-by-cnpj'
import { DbAddCompany } from './db-add-company'

const makeAddCompanyRepository = (): AddCompanyRepository => {
  class AddCompanyRepositoryStub implements AddCompanyRepository {
    async add (company: AddCompanyModel): Promise<CompanyModel> {
      return await Promise.resolve(null)
    }
  }
  return new AddCompanyRepositoryStub()
}

const makeLoadCompanyByCnpjStub = (): LoadCompanyByCnpj => {
  class LoadCompanyByCnpjStub implements LoadCompanyByCnpj {
    async load (cnpj: string): Promise<CompanyModel> {
      return await Promise.resolve(null)
    }
  }
  return new LoadCompanyByCnpjStub()
}

interface SutTypes {
  sut: DbAddCompany
  companyRepositoryStub: AddCompanyRepository
  loadCompanyByCnpjStub: LoadCompanyByCnpj
}

const makeSut = (): SutTypes => {
  const companyRepositoryStub = makeAddCompanyRepository()
  const loadCompanyByCnpjStub = makeLoadCompanyByCnpjStub()
  const sut = new DbAddCompany(companyRepositoryStub, loadCompanyByCnpjStub)
  return {
    sut,
    companyRepositoryStub,
    loadCompanyByCnpjStub
  }
}

const makeFakeRequest = (): AddCompanyModel => ({
  name: 'any_name',
  cnpj: 'any_cnpj',
  data_fundacao: 'any_date_foundation',
  valor_hora: 1
})

describe('Db Add Company', () => {
  test('Should call CompanyRepository.add with correct values', async () => {
    const { sut, companyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(companyRepositoryStub, 'add')
    await sut.add(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should trhow if CompanyRepository.add throws', async () => {
    const { sut, companyRepositoryStub } = makeSut()
    jest.spyOn(companyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should call loadCompanyByCnpj.load with correct values', async () => {
    const { loadCompanyByCnpjStub } = makeSut()
    const loadSpy = jest.spyOn(loadCompanyByCnpjStub, 'load')
    await loadCompanyByCnpjStub.load(makeFakeRequest().cnpj)
    expect(loadSpy).toHaveBeenCalledWith(makeFakeRequest().cnpj)
  })

  test('Should trhow if loadCompanyByCnpj.load throws', async () => {
    const { loadCompanyByCnpjStub } = makeSut()
    jest.spyOn(loadCompanyByCnpjStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = loadCompanyByCnpjStub.load(makeFakeRequest().cnpj)
    await expect(promise).rejects.toThrow()
  })
})
