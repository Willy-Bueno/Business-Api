import { CalculateCost, CalculateCostModel, CostByPeriodModel } from '../../../domain/usecases/calculate-cost'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest } from '../../helpers/http'
import { Validation } from '../../protocols/validation'
import { ServiceCalculationByPeriodController } from './service-calculation-by-period'

const makeFakeCostModel = (): CostByPeriodModel => ({
  valor_calculado: 4284.00
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validateCNPJ (input: string): boolean {
      return true
    }

    validateISO (input: string): boolean {
      return true
    }

    isBefore (startDate: string, endDate: string): boolean {
      return true
    }
  }
  return new ValidationStub()
}

const makeCalculateCost = (): CalculateCost => {
  class CalculateCostStub implements CalculateCost {
    async calculate (data: CalculateCostModel): Promise<CostByPeriodModel> {
      return await new Promise(resolve => resolve(
        makeFakeCostModel()
      ))
    }
  }
  return new CalculateCostStub()
}

interface SutTypes {
  sut: ServiceCalculationByPeriodController
  validationStub: Validation
  calculateCostStub: CalculateCost
}

const makeSut = (): SutTypes => {
  const calculateCostStub = makeCalculateCost()
  const validationStub = makeValidation()
  const sut = new ServiceCalculationByPeriodController(validationStub, calculateCostStub)
  return {
    sut,
    validationStub,
    calculateCostStub
  }
}

describe('Service Calculation By Period Controller', () => {
  test('Should return 400 if cnpj no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new MissingParamError('cnpj')))
  })

  test('Should return 400 if data_inicio no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new MissingParamError('data_inicio')))
  })

  test('Should return 400 if data_fim no is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new MissingParamError('data_fim')))
  })

  test('Should return 400 if cnpj is invalid', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateCNPJ').mockReturnValueOnce(false)
    const httpResquest = {
      body: {
        cnpj: 'invalid_cnpj',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new InvalidParamError('cnpj')))
  })

  test('Should return 400 if data_inicio is invalid', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validateISO').mockReturnValueOnce(false)
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new InvalidParamError('data_inicio')))
  })

  test('Should returns 400 if data_inicio is greater than data_fim', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'isBefore').mockReturnValueOnce(false)
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(badRequest(new InvalidParamError('data_fim')))
  })

  test('Should call Calculate with correct values', async () => {
    const { sut, calculateCostStub } = makeSut()
    const calculateSpy = jest.spyOn(calculateCostStub, 'calculate')
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    await sut.handle(httpResquest)
    expect(calculateSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 500 if Calculate throws', async () => {
    const { sut, calculateCostStub } = makeSut()
    jest.spyOn(calculateCostStub, 'calculate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response.statusCode).toBe(500)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        cnpj: '12345678912345',
        data_inicio: '2022-01-01',
        data_fim: '2022-01-02'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(makeFakeCostModel())
  })
})
