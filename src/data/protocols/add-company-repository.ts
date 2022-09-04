import { AddCompanyModel } from '../../domain/usecases/add-company'

export interface AddCompanyRepository {
  addOnRepository: (company: AddCompanyModel) => Promise<void>
}
