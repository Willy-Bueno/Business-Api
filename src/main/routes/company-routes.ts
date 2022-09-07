import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeServiceCalculationByPeriodController } from '../factories/calculate-cost-factory'
import { makeRegistrationCompanyController } from '../factories/registration-company-factory'

export default (router: Router): void => {
  router.post('/empresas', adaptRouter(makeRegistrationCompanyController()))
  router.post('/calculo', adaptRouter(makeServiceCalculationByPeriodController()))
}
