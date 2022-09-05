import { CompanyModel } from '../../domain/usecases/add-company'

export interface LoadCompanyByCnpj {
  load: (cnpj: string) => Promise<CompanyModel>
}
