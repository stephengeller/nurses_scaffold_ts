import * as fs from 'fs'

export interface Nurse {
  uid: string;
  name: string;
}

export enum ShiftType { 
  Morning = 'morning', 
  Evening = 'evening', 
  Night = 'night'
}
export interface Shift {
  shiftType: ShiftType;
  date: Date;
  nurses: Nurse[]
}

interface BuildArgs {
  filename: string;
  startDate: string;
  endDate: string;
}

const loadNurses = (filename: string): Nurse[] => {
  const contents = fs.readFileSync(filename, 'utf8')
  return JSON.parse(contents)
}

const build = ({filename, startDate, endDate}: BuildArgs): Shift[] => {
  const nurses = loadNurses(filename)
  throw 'RosterBuilder#build Not Implemented'
}

export const RosterBuilder = {
  build
}
