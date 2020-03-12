const nursesForShift = ({nurses}) => nurses.map(nurse => nurse.name).join(', ')

const shiftLine = shift => {
  const {date, shiftType} = shift
  const nurses = nursesForShift(shift)

  return `${date.toDateString()} | ${shiftType} | ${nurses}`
}

const formattedRoster = roster => {
  return roster.reduce(
    (completeOutput, shift) => `${completeOutput}${shiftLine(shift)}\n`,
    ''
  )
}

const output = (loggingFunction, roster) =>
  loggingFunction(formattedRoster(roster))

export const RosterFormatter = {
  output
}
