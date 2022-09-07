export interface CostByPeriodModel {
  valor_calculado: number
}

export interface CalculateCostModel {
  cnpj: string
  data_inicio: string
  data_fim: string
}

export interface CalculateCost {
  calculate: (data: CalculateCostModel) => Promise<CostByPeriodModel>
}
