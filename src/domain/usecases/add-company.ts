export interface AddCompanyModel {
  name: string
  cnpj: string
  date_foundation: string
  hour_value: number
}

export interface AddCompany {
  add: (company: AddCompanyModel) => Promise<void>
}
