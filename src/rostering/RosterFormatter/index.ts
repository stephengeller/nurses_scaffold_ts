import {Shift} from '../RosterBuilder'

const nursesForShift = ({nurses}) => nurses.map(nurse => nurse.name).join(', ')

const shiftLine = (shift: Shift) => {
  const {date, shiftType} = shift
  const nurses = nursesForShift(shift)

  return `${date.toDateString()} | ${shiftType} | ${nurses}`
}

const formattedRoster = (roster: Shift[]) => {
  return roster.reduce(
    (completeOutput, shift) => `${completeOutput}${shiftLine(shift)}\n`,
    ''
  )
}

const output = (loggingFunction: (string) => void, roster: Shift[]) =>
  loggingFunction(formattedRoster(roster))

export const RosterFormatter = {
  output
}
