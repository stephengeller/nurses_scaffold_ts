import * as fs from 'fs'
import {differenceInDays, flatten} from '../../utils/utils'
import moment = require('moment')

export interface Nurse {
  uid: string
  name: string
}

// TODO: This implementation is based on the ordering of these shifts. Do we need to be more explicit in the ordering?
export enum ShiftType {
  Morning = 'morning',
  Evening = 'evening',
  Night = 'night'
}

export interface Shift {
  shiftType: ShiftType
  nurses: Nurse[]
  date: Date
}

export interface RosterBuilderArgs {
  nurses?: Nurse[]
  startDate: Date
  endDate: Date
}

export class RosterBuilder {
  private _nurses: Nurse[]
  private _assignedNurses: Nurse[]
  private readonly startDate: Date
  private readonly endDate: Date

  constructor({startDate, endDate, nurses}: RosterBuilderArgs) {
    this._nurses = nurses
    this._assignedNurses = []
    this.startDate = startDate
    this.endDate = endDate
  }

  get availableNurses(): Nurse[] {
    return this._nurses
  }

  get assignedNurses(): Nurse[] {
    return this._assignedNurses
  }

  createShift(shiftType: ShiftType): {
    shiftType: ShiftType
    nurses: Nurse[]
  } {
    const nurses = this._nurses.slice(0, 5)
    if (nurses.length < 5) {
      throw `Not enough nurses to fill shift (${nurses.length} nurses available)`
    }

    this._assignedNurses = this._assignedNurses.concat(nurses)
    this._nurses = this.availableNurses.slice(5, this.availableNurses.length)
    return {shiftType, nurses}
  }

  createDay(date: Date): Shift[] {
    return Object.values(ShiftType).map((shiftType) => {
      const shift = this.createShift(shiftType)
      return {...shift, date}
    })
  }

  static loadNurses = (filename: string): Nurse[] => {
    const contents = fs.readFileSync(filename, 'utf8')
    return JSON.parse(contents)
  }

  private resetAvailableNurses() {
    this._nurses = this._nurses.concat(this._assignedNurses)
    this._assignedNurses = []
  }

  build(): Shift[] {
    const days = differenceInDays(this.startDate, this.endDate)
    const daysAsArray: number[] = Array.from(Array(days).keys())

    const start = moment(this.startDate)
    const arrayOfShifts: Shift[][] = daysAsArray.map(() => {
      this.resetAvailableNurses()
      const day = this.createDay(start.toDate())
      // `start` is stateful, so we need to add one day to the counter after we create the day
      start.add(1, 'days').toDate()
      return day
    })

    return flatten(arrayOfShifts)
  }
}
