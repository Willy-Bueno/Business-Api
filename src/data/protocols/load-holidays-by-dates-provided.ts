export interface Dates {
  startDate: string
  endDate: string
}

export interface LoadHolidaysByDatesProvided {
  loadHolidays: (dates: Dates) => Promise<number>
}
