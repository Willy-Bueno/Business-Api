import { AddCompany, AddCompanyModel } from '../../domain/usecases/add-company'
import { AddCompanyRepository } from '../protocols/add-company-repository'

export class DbAddCompany implements AddCompany {
  constructor (private readonly AddCompanyRepository: AddCompanyRepository) {}
  async add (company: AddCompanyModel): Promise<void> {
    await this.AddCompanyRepository.addOnRepository(company)
    return await new Promise(resolve => resolve())
  }
}
