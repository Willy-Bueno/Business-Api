export interface BusinessDay {
  get: (startDate: string, endDate: string) => number
}
