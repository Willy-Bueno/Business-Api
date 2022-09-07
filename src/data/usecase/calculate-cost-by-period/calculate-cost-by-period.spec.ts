import { CompanyModel } from '../../../domain/usecases/add-company'
import { CalculateCostModel, CostByPeriodModel } from '../../../domain/usecases/calculate-cost'
import { BusinessDay } from '../../protocols/business-day'
import { CostByPeriod, CostModel } from '../../protocols/cost-by-period'
import { LoadCompanyByCnpj } from '../../protocols/load-company-by-cnpj'
import { Dates, LoadHolidaysByDatesProvided } from '../../protocols/load-holidays-by-dates-provided'
import { CalculateCostByPeriod } from './calculate-cost-by-period'

const makeFakeCostModel = (): CalculateCostModel => ({
  cnpj: '12345678912345',
  data_inicio: '2022-09-01',
  data_fim: '2022-09-30'
})

const makeFakeCompanyModel = (): CompanyModel => ({
  id: 1,
  nome: 'any_name',
  cnpj: '12345678912345',
  data_fundacao: '2021-09-01',
  valor_hora: 1
})

const makeLoadCompanyByCnpjStub = (): LoadCompanyByCnpj => {
  class LoadCompanyByCnpjStub implements LoadCompanyByCnpj {
    async load (cnpj: string): Promise<CompanyModel> {
      return await Promise.resolve(makeFakeCompanyModel())
    }
  }
  return new LoadCompanyByCnpjStub()
}

const makeLoadHolidaysByDatesProvidedStub = (): LoadHolidaysByDatesProvided => {
  class LoadHolidaysByPeriodProvidedStub implements LoadHolidaysByDatesProvided {
    async loadHolidays (dates: Dates): Promise<number> {
      return await Promise.resolve(3)
    }
  }
  return new LoadHolidaysByPeriodProvidedStub()
}

const makeCostByPeriod = (): CostByPeriod => {
  class CostByPeriodStub implements CostByPeriod {
    calc (data: CostModel): CostByPeriodModel {
      return {
        valor_calculado: 1
      }
    }
  }
  return new CostByPeriodStub()
}

const makeBusinessDay = (): BusinessDay => {
  class BusinessDayStub implements BusinessDay {
    get (startDate: string, endDate: string): number {
      return 20
    }
  }
  return new BusinessDayStub()
}

interface SutTypes {
  sut: CalculateCostByPeriod
  loadCompanyByCnpjStub: LoadCompanyByCnpj
  loadHolidaysByDatesProvidedStub: LoadHolidaysByDatesProvided
  costByPeriodStub: CostByPeriod
  businessDayStub: BusinessDay
}

const makeSut = (): SutTypes => {
  const businessDayStub = makeBusinessDay()
  const costByPeriodStub = makeCostByPeriod()
  const loadHolidaysByDatesProvidedStub = makeLoadHolidaysByDatesProvidedStub()
  const loadCompanyByCnpjStub = makeLoadCompanyByCnpjStub()
  const sut = new CalculateCostByPeriod(
    loadCompanyByCnpjStub,
    loadHolidaysByDatesProvidedStub,
    costByPeriodStub,
    businessDayStub
  )

  return {
    sut,
    loadCompanyByCnpjStub,
    loadHolidaysByDatesProvidedStub,
    costByPeriodStub,
    businessDayStub
  }
}

describe('CalculateCost UseCse', () => {
  test('should call LoadCompanyByCnpj with correct values', async () => {
    const { sut, loadCompanyByCnpjStub } = makeSut()
    const loadSpy = jest.spyOn(loadCompanyByCnpjStub, 'load')
    await sut.calculate(makeFakeCostModel())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeCostModel().cnpj)
  })

  test('should throw if LoadCompanyByCnpj throws', async () => {
    const { sut, loadCompanyByCnpjStub } = makeSut()
    jest.spyOn(loadCompanyByCnpjStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.calculate(makeFakeCostModel())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadCompanyByCnpj returns null', async () => {
    const { sut, loadCompanyByCnpjStub } = makeSut()
    jest.spyOn(loadCompanyByCnpjStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const result = await sut.calculate(makeFakeCostModel())
    expect(result).toBeNull()
  })

  test('should call LoadHolidaysByDatesProvided with correct values', async () => {
    const { sut, loadHolidaysByDatesProvidedStub } = makeSut()
    const loadSpy = jest.spyOn(loadHolidaysByDatesProvidedStub, 'loadHolidays')
    await sut.calculate(makeFakeCostModel())
    expect(loadSpy).toHaveBeenCalledWith({
      startDate: makeFakeCostModel().data_inicio,
      endDate: makeFakeCostModel().data_fim
    })
  })

  test('should call BusinessDay with correct values', async () => {
    const { sut, businessDayStub } = makeSut()
    const getSpy = jest.spyOn(businessDayStub, 'get')
    await sut.calculate(makeFakeCostModel())
    expect(getSpy).toHaveBeenCalledWith(makeFakeCostModel().data_inicio, makeFakeCostModel().data_fim)
  })

  test('should call CostByPeriod with correct values', async () => {
    const { sut, costByPeriodStub } = makeSut()
    const loadSpy = jest.spyOn(costByPeriodStub, 'calc')
    await sut.calculate(makeFakeCostModel())
    expect(loadSpy).toHaveBeenCalledWith({
      dias_uteis: 20,
      valor_hora: makeFakeCompanyModel().valor_hora,
      feriados: 3,
      horas_trabalhadas: 8
    })
  })
})
