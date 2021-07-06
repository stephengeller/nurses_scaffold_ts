import moment = require('moment')

export const flatten = (arr: any[][]): any[] =>
  arr.reduce((accumulator, value) => accumulator.concat(value), [])

export function differenceInDays(startDate: Date, endDate: Date): number {
  return moment(endDate).diff(moment(startDate), 'days') + 1
}
