import { CalculateCostByPeriod } from '../../data/usecase/calculate-cost-by-period/calculate-cost-by-period'
import { ValidatorAdapter } from '../../infra/validators/validator-adapter'
import { ServiceCalculationByPeriodController } from '../../presentation/controllers/service-calculation-by-period/service-calculation-by-period'
import { Controller } from '../../presentation/protocols/http'
import { CalculateCost } from '../../infra/usecase/db/calculate/calculate-cost'

export const makeServiceCalculationByPeriodController = (): Controller => {
  const loadByCNPJ = new CalculateCost()
  const loadHolidaysByDatesProvided = new CalculateCost()
  const costByPeriod = new CalculateCost()
  const businessDay = new CalculateCost()
  const Calculate = new CalculateCostByPeriod(loadByCNPJ, loadHolidaysByDatesProvided, costByPeriod, businessDay)
  const validation = new ValidatorAdapter()
  return new ServiceCalculationByPeriodController(validation, Calculate)
}
