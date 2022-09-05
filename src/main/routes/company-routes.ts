import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeRegistrationCompanyController } from '../factories/registration-company-factory'

export default (router: Router): void => {
  router.post('/empresas', adaptRouter(makeRegistrationCompanyController()))
}
