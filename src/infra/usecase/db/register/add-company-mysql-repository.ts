import { AddCompanyRepository } from '../../../../data/protocols/company-repository'
import { LoadCompanyByCnpj } from '../../../../data/protocols/load-company-by-cnpj'
import { AddCompanyModel, CompanyModel } from '../../../../domain/usecases/add-company'
import { Empresa } from '../models/Company'

export class AddCompanyMysqlRepository implements AddCompanyRepository, LoadCompanyByCnpj {
  async load (cnpj: string): Promise<any> {
    const company = await Empresa.findOne({
      where: {
        cnpj
      }
    })
    return company
  }

  async add (company: AddCompanyModel): Promise<CompanyModel> {
    const { nome, cnpj, data_fundacao, valor_hora } = company
    const newCompany = Object.assign({}, { nome, cnpj }, {
      data_fundacao: data_fundacao.substring(0, 10),
      valor_hora: valor_hora.toFixed(2)
    })
    await Empresa.create(newCompany)
    return null
  }
}
