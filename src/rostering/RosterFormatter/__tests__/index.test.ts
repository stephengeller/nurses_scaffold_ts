import { RosterFormatter } from "../index";
import { Shift, ShiftType } from "../../RosterBuilder";

describe("Pretty Printing", () => {
  it("Writes the shift, then the nurses assigned to that shift", () => {
    // Could also be an array of typed objects using ES6 Getters too...
    const roster: Shift[] = [
      {
        shiftType: ShiftType.Morning,
        date: new Date("1972-01-10"),
        nurses: [
          {
            uid: "h7h2365fd3i2gyd2i2dg37d2",
            name: "Bill",
          },
          {
            uid: "2d73gd2i2dyg2i3df5632h7h",
            name: "Ted",
          },
        ],
      },
      {
        shiftType: ShiftType.Evening,
        date: new Date("1993-09-21"),
        nurses: [
          {
            uid: "2gyd2i2dg37d2h7h2365fd3i",
            name: "Wayne",
          },
          {
            uid: "i3df5632h7h2d73gd2i2dyg2",
            name: "Garth",
          },
        ],
      },
    ];

    const loggingFunction = jest.fn();

    RosterFormatter.output(loggingFunction, roster);

    expect(loggingFunction).toHaveBeenCalledWith(
      "Mon Jan 10 1972 | morning | Bill, Ted\nTue Sep 21 1993 | evening | Wayne, Garth\n"
    );
  });
});
