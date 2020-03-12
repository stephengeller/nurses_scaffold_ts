import csv from 'async-csv'
import * as fs from 'fs'

const loadNurses = async (filename: string) => {
  const contents = fs.readFileSync(filename)
  const [header, ...rows] = await csv.parse(contents.toString())

  return rows
}

const build = async ({filename, startDate, endDate}) => {
  const nurses = await loadNurses(filename)

  throw 'RosterBuilder#build Not Implemented'
}

export const RosterBuilder = {
  build
}
