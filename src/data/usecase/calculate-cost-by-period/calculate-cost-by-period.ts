import { CalculateCost, CalculateCostModel, CostByPeriodModel } from '../../../domain/usecases/calculate-cost'
import { BusinessDay } from '../../protocols/business-day'
import { CostByPeriod } from '../../protocols/cost-by-period'
import { LoadCompanyByCnpj } from '../../protocols/load-company-by-cnpj'
import { LoadHolidaysByDatesProvided } from '../../protocols/load-holidays-by-dates-provided'

export class CalculateCostByPeriod implements CalculateCost {
  constructor (
    private readonly loadCompanyByCnpj: LoadCompanyByCnpj,
    private readonly loadHolidaysByDatesProvided: LoadHolidaysByDatesProvided,
    private readonly costByPeriod: CostByPeriod,
    private readonly businessDay: BusinessDay
  ) {}

  async calculate (data: CalculateCostModel): Promise<CostByPeriodModel> {
    const business = await this.loadCompanyByCnpj.load(data.cnpj)
    if (!business) {
      return null
    }

    const dates = Object.assign({}, {
      startDate: data.data_inicio,
      endDate: data.data_fim
    })

    const holidays = await this.loadHolidaysByDatesProvided.loadHolidays(dates)

    const businessDays = this.businessDay.get(data.data_inicio, data.data_fim)

    const cost = this.costByPeriod.calc({
      valor_hora: business.valor_hora,
      horas_trabalhadas: 8,
      dias_uteis: businessDays,
      feriados: holidays
    })

    return await new Promise(resolve => resolve(cost))
  }
}
