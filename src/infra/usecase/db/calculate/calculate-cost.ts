import { Op } from 'sequelize'
import { BusinessDay } from '../../../../data/protocols/business-day'
import { CostByPeriod, CostModel } from '../../../../data/protocols/cost-by-period'
import { LoadCompanyByCnpj } from '../../../../data/protocols/load-company-by-cnpj'
import { Dates, LoadHolidaysByDatesProvided } from '../../../../data/protocols/load-holidays-by-dates-provided'
import { CostByPeriodModel } from '../../../../domain/usecases/calculate-cost'
import { businesDay } from '../../../../utils/busines-day'
import { Company } from '../models/Company'
import { Feriado } from '../models/Holidays'

export class CalculateCost implements LoadCompanyByCnpj, LoadHolidaysByDatesProvided, CostByPeriod, BusinessDay {
  async load (cnpj: string): Promise<any> {
    const company = await Company.findOne({
      where: {
        cnpj
      }
    })
    return company
  }

  async loadHolidays (dates: Dates): Promise<number> {
    const holidays = await Feriado.findAll({
      where: {
        data: {
          [Op.between]: [dates.startDate, dates.endDate]
        }
      }
    })
    const holidaysCount = holidays.length
    return holidaysCount
  }

  get (startDate: string, endDate: string): number {
    const days = businesDay(startDate, endDate)
    return days
  }

  calc (data: CostModel): CostByPeriodModel {
    const { valor_hora, horas_trabalhadas, dias_uteis, feriados } = data
    const valor_calculado = valor_hora * horas_trabalhadas * (dias_uteis - feriados)
    return {
      valor_calculado
    }
  }
}
