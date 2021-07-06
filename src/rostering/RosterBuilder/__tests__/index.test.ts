import {
  flatten,
  Nurse,
  RosterBuilder,
  RosterBuilderArgs,
  ShiftType,
} from "../index";
describe("RosterBuilder", function () {
  let rosterBuilder: RosterBuilder;
  beforeEach(() => {
    rosterBuilder = rosterBuilderForTesting({ nurses: testNurses(100) });
  });

  describe("createShift", function () {
    it("should generate a shift from available nurses", function () {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: testNurses(5),
      });

      const shift = rosterBuilder.createShift(ShiftType.Morning);

      expect(shift).toEqual({
        shiftType: ShiftType.Morning,
        nurses: [
          { uid: "0", name: "0" },
          { uid: "1", name: "1" },
          { uid: "2", name: "2" },
          { uid: "3", name: "3" },
          { uid: "4", name: "4" },
        ],
      });
    });
    it("should throw error if not enough nurses available", function () {
      const rosterBuilder = rosterBuilderForTesting({ nurses: testNurses(3) });

      expect(() => rosterBuilder.createShift(ShiftType.Evening)).toThrowError(
        "Not enough nurses to fill shift (3 nurses available)"
      );
    });

    it("should pick the first available nurses in order", function () {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: [
          testNurse(7),
          testNurse(2),
          testNurse(5),
          testNurse(4),
          testNurse(999),
          testNurse(402),
          testNurse(11234),
        ],
      });

      expect(rosterBuilder.createShift(ShiftType.Evening)).toEqual({
        shiftType: ShiftType.Evening,
        nurses: [
          testNurse(7),
          testNurse(2),
          testNurse(5),
          testNurse(4),
          testNurse(999),
        ],
      });
    });

    it("should remove nurses from the available pool once assigned to a shift", function () {
      const nurses = [
        testNurse(1),
        testNurse(2),
        testNurse(3),
        testNurse(4),
        testNurse(5),
        testNurse(6),
        testNurse(7),
      ];

      const rosterBuilder = rosterBuilderForTesting({ nurses });
      expect(rosterBuilder.nurses).toEqual(nurses);

      rosterBuilder.createShift(ShiftType.Evening);

      expect(rosterBuilder.nurses).toEqual([testNurse(6), testNurse(7)]);
    });
  });

  describe("createDay", function () {
    it("should produce 3 shifts", function () {
      const day = rosterBuilder.createDay(new Date());
      expect(day).toHaveLength(3);
    });

    it("should have one of each shift type", function () {
      const day = rosterBuilder.createDay(new Date());
      const shiftTypes = day.map((d) => d.shiftType);
      expect(new Set(shiftTypes).size).toEqual(day.length);
    });

    it("should produce a list of 5 nurses for each type of shift", function () {
      const day = rosterBuilder.createDay(new Date());
      day.forEach((shift) => expect(shift.nurses).toHaveLength(5));
    });

    it("should throw error if not enough nurses to fill a day of shifts", function () {
      rosterBuilder = rosterBuilderForTesting({ nurses: testNurses(13) });
      expect(() => rosterBuilder.createDay(new Date())).toThrowError(
        `Not enough nurses to fill shift (3 nurses available)`
      );
    });

    it("should have no nurses working twice in a day", function () {
      const day = rosterBuilder.createDay(new Date());
      day.forEach((shift) =>
        shift.nurses.some((nurse) =>
          day.forEach((shift) => shift.nurses.includes(nurse))
        )
      );
    });
  });

  describe("build", function () {
    describe("for one day", function () {
      beforeEach(() => {
        return (rosterBuilder = rosterBuilderForTesting({
          startDate: "2001-01-01",
          endDate: "2001-01-02",
        }));
      });

      it("builds a roster from available nurse list", () => {
        const roster = rosterBuilder.build();
        expect(roster.length > 0).toBeTruthy();
      });

      it("throws error if not enough nurses", () => {
        expect(() =>
          rosterBuilderForTesting({ nurses: testNurses(14) }).build()
        ).toThrowError();
      });

      it("should produce a shift of each shiftType", function () {
        expect(rosterBuilder.build().map((shift) => shift.shiftType)).toEqual([
          "morning",
          "evening",
          "night",
        ]);
      });

      it("should contain 5 nurses per shift", function () {
        rosterBuilder
          .build()
          .forEach((shift) => expect(shift.nurses).toHaveLength(5));
      });
    });
  });
});

describe("flatten", function () {
  it("should flatten an array of arrays into one", function () {
    const arrayOfArrays = [[1], [2], [3]];
    expect(flatten(arrayOfArrays)).toEqual([1, 2, 3]);
  });
});

const testNurse = (uid: number): Nurse => ({
  uid: uid.toString(),
  name: uid.toString(),
});

const testNurses = (count: number): Nurse[] =>
  Array.from(Array(count).keys()).map((n) => testNurse(n));

const rosterBuilderForTesting = (args: Partial<RosterBuilderArgs>) =>
  new RosterBuilder({
    startDate: "2001-01-01",
    endDate: "2001-01-02",
    nurses: testNurses(100),
    ...args,
  });
