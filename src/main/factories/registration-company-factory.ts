import { DbAddCompany } from '../../data/usecase/db-add-company'
import { AddCompanyMysqlRepository } from '../../infra/usecase/db/company/add-company-mysql-repository'
import { ValidatorAdapter } from '../../infra/validators/validator-adapter'
import { RegistrationCompanyController } from '../../presentation/controllers/registration-company'
import { Controller } from '../../presentation/protocols/http'

export const makeRegistrationCompanyController = (): Controller<any, any> => {
  const loadCompanyByCnpj = new AddCompanyMysqlRepository()
  const addCompanyRepository = new AddCompanyMysqlRepository()
  const addCompany = new DbAddCompany(addCompanyRepository, loadCompanyByCnpj)
  const validation = new ValidatorAdapter()
  return new RegistrationCompanyController(validation, addCompany)
}
