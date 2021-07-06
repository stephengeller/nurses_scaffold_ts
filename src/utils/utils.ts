import moment = require('moment')

export const flatten = (arr: any[][]): any[] =>
  arr.reduce((accumulator, value) => accumulator.concat(value), [])

export function differenceInDays(startDate: Date, endDate: Date): number {
  // add ` +1` if inclusive of endDate
  return moment(endDate).diff(moment(startDate), 'days')
}
