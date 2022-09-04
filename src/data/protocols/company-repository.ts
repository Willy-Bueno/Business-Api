import { AddCompanyModel } from '../../domain/usecases/add-company'

export interface CompanyRepository {
  add: (company: AddCompanyModel) => Promise<void>
}
