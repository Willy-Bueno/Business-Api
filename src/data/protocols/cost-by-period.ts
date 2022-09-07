import { CostByPeriodModel } from '../../domain/usecases/calculate-cost'

export interface CostModel {
  valor_hora: number
  horas_trabalhadas: number
  feriados: number
  dias_uteis: number
}

export interface CostByPeriod {
  calc: (data: CostModel) => CostByPeriodModel
}
