import { DbAddCompany } from '../../data/usecase/register/db-add-company'
import { AddCompanyMysqlRepository } from '../../infra/usecase/db/register/add-company-mysql-repository'
import { ValidatorAdapter } from '../../infra/validators/validator-adapter'
import { RegistrationCompanyController } from '../../presentation/controllers/register/registration-company'
import { Controller } from '../../presentation/protocols/http'

export const makeRegistrationCompanyController = (): Controller => {
  const loadCompanyByCnpj = new AddCompanyMysqlRepository()
  const addCompanyRepository = new AddCompanyMysqlRepository()
  const addCompany = new DbAddCompany(addCompanyRepository, loadCompanyByCnpj)
  const validation = new ValidatorAdapter()
  return new RegistrationCompanyController(validation, addCompany)
}
