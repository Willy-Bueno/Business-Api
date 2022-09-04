import { AddCompany, AddCompanyModel } from '../../domain/usecases/add-company'
import { CompanyRepository } from '../protocols/company-repository'

export class DbAddCompany implements AddCompany {
  constructor (private readonly CompanyRepository: CompanyRepository) {}
  async add (company: AddCompanyModel): Promise<void> {
    await this.CompanyRepository.add(company)
    return await new Promise(resolve => resolve())
  }
}
