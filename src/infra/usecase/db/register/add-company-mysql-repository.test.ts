import { AddCompanyModel } from '../../../../domain/usecases/add-company'
import Helper from '../helper/helper'
import { Empresa } from '../models/Company'
import { AddCompanyMysqlRepository } from './add-company-mysql-repository'

const makeFakeCompany = (): AddCompanyModel => ({
  nome: 'valid_name_company',
  cnpj: '12345678912345',
  data_fundacao: '2022-09-04',
  valor_hora: 25.90
})

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
    await sut.add(makeFakeCompany())
    const result = await Empresa.findOne({ where: { cnpj: makeFakeCompany().cnpj } })
    expect(result).toBeTruthy()
  })

  test('Should return a company if loadByCNPJ return a compnay', async () => {
    const sut = new AddCompanyMysqlRepository()
    const { nome, cnpj, data_fundacao, valor_hora } = makeFakeCompany()
    await sut.add(makeFakeCompany())
    const result = await sut.load(cnpj)
    expect(result.dataValues.id).toBeTruthy()
    expect(result.dataValues.nome).toBe(nome)
    expect(result.dataValues.cnpj).toBe(cnpj)
    expect(result.dataValues.data_fundacao).toBe(data_fundacao)
    expect(result.dataValues.valor_hora).toBe(valor_hora.toFixed(2))
  })
})
