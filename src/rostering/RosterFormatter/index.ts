import { Shift, ShiftType } from "../RosterBuilder";

const nursesForShift = ({ nurses }) =>
  nurses.map((nurse) => nurse.name).join(", ");

const shiftLine = (shift: Shift) => {
  const { date, shiftType } = shift;
  const nurses = nursesForShift(shift);
  const longestShiftType = Object.values(ShiftType).reduce(function (a, b) {
    return a.length > b.length ? a : b;
  });

  const whiteSpaceToAlignCol = new Array(
    longestShiftType.length - shiftType.length + 1
  ).join(" ");

  return `${date.toDateString()} | ${
    shiftType + whiteSpaceToAlignCol
  } | ${nurses}`;
};

const formattedRoster = (roster: Shift[]) => {
  return roster.reduce(
    (completeOutput, shift) => `${completeOutput}${shiftLine(shift)}\n`,
    ""
  );
};

const output = (loggingFunction: (string) => void, roster: Shift[]): void =>
  loggingFunction(formattedRoster(roster));

export const RosterFormatter = {
  output,
};
