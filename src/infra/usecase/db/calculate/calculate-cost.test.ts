import { AddCompanyModel } from '../../../../domain/usecases/add-company'
import Helper from '../helper/helper'
import { AddCompanyMysqlRepository } from '../register/add-company-mysql-repository'
import { CalculateCost } from './calculate-cost'

const makeFakeCompany = (): AddCompanyModel => ({
  nome: 'valid_name_company',
  cnpj: '12345678912345',
  data_fundacao: '2022-09-04',
  valor_hora: 25.90
})

describe('CalculateCost', () => {
  beforeAll(async () => {
    await Helper.connect()
  })

  afterEach(async () => {
    await Helper.clear()
  })

  afterAll(async () => {
    await Helper.disconnect()
  })

  test('Should return a company if load return a compnay', async () => {
    const sut = new CalculateCost()
    const addBusiness = new AddCompanyMysqlRepository()
    const { nome, cnpj, data_fundacao, valor_hora } = makeFakeCompany()
    await addBusiness.add(makeFakeCompany())
    const result = await sut.load(cnpj)
    expect(result.dataValues.id).toBeTruthy()
    expect(result.dataValues.name).toBe(nome)
    expect(result.dataValues.cnpj).toBe(cnpj)
    expect(result.dataValues.data_fundacao).toBe(data_fundacao)
    expect(result.dataValues.valor_hora).toBe(valor_hora.toFixed(2))
  })

  test('Should return holidays if loadHolidays returns holidays', async () => {
    const sut = new CalculateCost()
    const dates = {
      startDate: '2022-09-01',
      endDate: '2022-09-30'
    }
    const result = await sut.loadHolidays(dates)
    expect(result).toBe(1)
  })

  test('Should return business days if get return business days', async () => {
    const sut = new CalculateCost()
    const dates = {
      startDate: '2022-09-01',
      endDate: '2022-09-30'
    }
    const result = sut.get(dates.startDate, dates.endDate)
    expect(result).toBe(22)
  })

  test('Should return cost if calculate return cost', async () => {
    const sut = new CalculateCost()
    const data = {
      dias_uteis: 22,
      feriados: 1,
      horas_trabalhadas: 8,
      valor_hora: 25.90
    }
    const result = sut.calc(data)
    expect(result).toEqual({
      valor_calculado: 4351.2
    })
  })
})
