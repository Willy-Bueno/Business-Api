import { AddCompany, AddCompanyModel, CompanyModel } from '../../domain/usecases/add-company'
import { AddCompanyRepository } from '../protocols/company-repository'
import { LoadCompanyByCnpj } from '../protocols/load-company-by-cnpj'

export class DbAddCompany implements AddCompany {
  constructor (
    private readonly companyRepository: AddCompanyRepository,
    private readonly loadCompanyByCnpj: LoadCompanyByCnpj
  ) {}

  async add (company: AddCompanyModel): Promise<CompanyModel> {
    const isRegisteredCompany = await this.loadCompanyByCnpj.load(company.cnpj)
    if (isRegisteredCompany) {
      return await Promise.resolve(isRegisteredCompany)
    }
    await this.companyRepository.add(company)
    return null
  }
}
