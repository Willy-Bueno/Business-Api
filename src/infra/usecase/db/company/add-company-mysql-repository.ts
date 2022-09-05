import { AddCompanyRepository } from '../../../../data/protocols/company-repository'
import { LoadCompanyByCnpj } from '../../../../data/protocols/load-company-by-cnpj'
import { AddCompanyModel, CompanyModel } from '../../../../domain/usecases/add-company'
import { Company } from '../models/Company'

export class AddCompanyMysqlRepository implements AddCompanyRepository, LoadCompanyByCnpj {
  async load (cnpj: string): Promise<any> {
    const company = await Company.findOne({
      where: {
        cnpj
      }
    })
    return company
  }

  async add (company: AddCompanyModel): Promise<CompanyModel> {
    const { name, cnpj, date_foundation, hour_value } = company
    const newCompany = Object.assign({}, { name, cnpj }, {
      data_fundacao: date_foundation.substring(0, 10),
      valor_hora: hour_value.toFixed(2)
    })
    await Company.create(newCompany)
    return null
  }
}
