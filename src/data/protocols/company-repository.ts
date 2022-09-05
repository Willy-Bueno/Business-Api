import { AddCompanyModel, CompanyModel } from '../../domain/usecases/add-company'

export interface AddCompanyRepository {
  add: (company: AddCompanyModel) => Promise<CompanyModel>
}
