import moment from 'moment'

export function businesDay (startDate: string, enDate: string): number {
  try {
    const start = moment(startDate)
    const end = moment(enDate)
    const days = end.diff(start, 'days')
    let bussinesDays = 0
    for (let i = 0; i <= days; i++) {
      const day = moment(startDate).add(i, 'days')
      if (day.isoWeekday() !== 6 && day.isoWeekday() !== 7) {
        bussinesDays++
      }
    }
    return bussinesDays
  } catch (error) {
    return 0
  }
}
