import Helper from '../helper/helper'
import { Company } from '../models/Company'
import { AddCompanyMysqlRepository } from './add-company-mysql-repository'

describe('CompanyRepository', () => {
  beforeAll(async () => {
    await Helper.connect()
  })

  afterEach(async () => {
    await Helper.clear()
  })

  afterAll(async () => {
    await Helper.disconnect()
  })

  test('Should add Company on database', async () => {
    const sut = new AddCompanyMysqlRepository()
    const company = {
      name: 'valid_name_company',
      cnpj: '12345678912345', // 14 digits
      date_foundation: '2022-09-04',
      hour_value: 25.90
    }
    await sut.add(company)
    const result = await Company.findOne({ where: { cnpj: company.cnpj } })
    expect(result).toBeTruthy()
  })

  test('Should return a company if loadByCNPJ return a compnay', async () => {
    const sut = new AddCompanyMysqlRepository()
    const company = {
      name: 'valid_name_company',
      cnpj: '12345678912345', // 14 digits
      date_foundation: '2022-09-04',
      hour_value: 25.90
    }
    await sut.add(company)
    const result = await sut.load(company.cnpj)
    expect(result.dataValues.id).toBeTruthy()
    expect(result.dataValues.name).toBe(company.name)
    expect(result.dataValues.cnpj).toBe(company.cnpj)
    expect(result.dataValues.data_fundacao).toBe(company.date_foundation)
    expect(result.dataValues.valor_hora).toBe(company.hour_value.toFixed(2))
  })
})
