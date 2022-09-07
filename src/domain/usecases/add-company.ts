export interface AddCompanyModel {
  nome: string
  cnpj: string
  data_fundacao: string
  valor_hora: number
}

export interface CompanyModel {
  id: number
  nome: string
  cnpj: string
  data_fundacao: string
  valor_hora: number
}

export interface AddCompany {
  add: (company: AddCompanyModel) => Promise<CompanyModel>
}
