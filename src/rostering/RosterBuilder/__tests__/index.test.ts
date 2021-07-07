import {
  Nurse,
  RosterBuilder,
  RosterBuilderArgs,
  Shift,
  ShiftType
} from '../index'
import {differenceInDays, flatten} from '../../../utils/utils'

const testNurse = (uid: number): Nurse => ({
  uid: uid.toString(),
  name: uid.toString()
})

const testNurses = (count: number, startingId?: number): Nurse[] =>
  Array.from(Array(count).keys()).map((n) => testNurse((startingId ?? 0) + n))

const rosterBuilderForTesting = (args?: Partial<RosterBuilderArgs>) =>
  new RosterBuilder({
    startDate: new Date('2001-01-01'),
    endDate: new Date('2001-01-01'),
    nurses: testNurses(100),
    ...args
  })

describe('RosterBuilder', () => {
  let rosterBuilder: RosterBuilder
  beforeEach(() => (rosterBuilder = rosterBuilderForTesting()))

  describe('createShift', () => {
    it('should generate a shift from available nurses', () => {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: testNurses(5)
      })

      const shift = rosterBuilder.createShift(ShiftType.Morning)

      expect(shift).toEqual({
        shiftType: ShiftType.Morning,
        nurses: testNurses(5)
      })
    })

    it('nurses should be unique from each other', () => {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: testNurses(5)
      })

      const shift = rosterBuilder.createShift(ShiftType.Morning)
      // Sets rely on primitive values to remove duplicates
      const uniqueIds = new Set(shift.nurses.map(({uid}) => uid))
      expect(uniqueIds.size).toEqual(shift.nurses.length)
    })

    it('should throw error if there are not at least 5 nurses available', () => {
      const rosterBuilder = rosterBuilderForTesting({nurses: testNurses(3)})

      expect(() => rosterBuilder.createShift(ShiftType.Evening)).toThrowError(
        'Not enough nurses to fill shift (3 nurses available)'
      )
    })

    it('should pick the first available nurses in order', () => {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: [
          testNurse(7),
          testNurse(2),
          testNurse(5),
          testNurse(4),
          testNurse(999),
          testNurse(402),
          testNurse(11234)
        ]
      })

      expect(rosterBuilder.createShift(ShiftType.Evening)).toEqual({
        shiftType: ShiftType.Evening,
        nurses: [
          testNurse(7),
          testNurse(2),
          testNurse(5),
          testNurse(4),
          testNurse(999)
        ]
      })
    })

    it('should remove nurses from the available pool once assigned to a shift', () => {
      const nurses = testNurses(7, 1)

      const rosterBuilder = rosterBuilderForTesting({nurses})
      expect(rosterBuilder.availableNurses).toEqual(nurses)

      rosterBuilder.createShift(ShiftType.Evening)

      expect(rosterBuilder.availableNurses).toEqual([
        testNurse(6),
        testNurse(7)
      ])
    })

    it('should add nurses to list of assigned nurses', () => {
      const nurses = testNurses(7, 1)

      const rosterBuilder = rosterBuilderForTesting({nurses})
      expect(rosterBuilder.availableNurses).toEqual(nurses)
      expect(rosterBuilder.assignedNurses).toEqual([])

      rosterBuilder.createShift(ShiftType.Evening)

      expect(rosterBuilder.assignedNurses).toEqual(testNurses(5, 1))
    })
  })

  describe('createDay', () => {
    it('should produce 3 shifts', () => {
      const day = rosterBuilder.createDay(new Date())
      expect(day).toHaveLength(3)
    })

    it('should have one of each shift type', () => {
      const day = rosterBuilder.createDay(new Date())
      const shiftTypes = day.map((d) => d.shiftType)
      expect(new Set(shiftTypes).size).toEqual(day.length)
    })

    it('should produce a list of 5 nurses for each type of shift', () => {
      const day = rosterBuilder.createDay(new Date())
      day.forEach((shift) => expect(shift.nurses).toHaveLength(5))
    })

    it('should throw error if not enough nurses to fill a day of shifts', () => {
      rosterBuilder = rosterBuilderForTesting({nurses: testNurses(13)})
      expect(() => rosterBuilder.createDay(new Date())).toThrowError(
        `Not enough nurses to fill shift (3 nurses available)`
      )
    })

    it('should have no nurses working twice in a day', () => {
      const day = rosterBuilder.createDay(new Date())
      const flattened: Nurse[] = flatten(day.map(({nurses}) => nurses))

      // This test relies on the `uid` value always being unique,
      // as Sets only check for unique values for primitive types
      // and so doesn't produce a list of unique objects if passed
      // the original `Nurse` object
      const uniqueUids = new Set(flattened.map(({uid}) => uid))
      expect(uniqueUids.size).toEqual(flattened.length)
    })
  })

  describe('build', () => {
    describe('for one day', () => {
      beforeEach(() => {
        rosterBuilder = rosterBuilderForTesting({
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-01')
        })
      })

      it('builds a roster from available nurse list', () => {
        const roster = rosterBuilder.build()
        expect(roster.length > 0).toBeTruthy()
      })

      it('throws error if not enough nurses', () => {
        expect(() =>
          rosterBuilderForTesting({nurses: testNurses(14)}).build()
        ).toThrowError()
      })

      it('should produce a shift of each shiftType', () => {
        expect(rosterBuilder.build().map((shift) => shift.shiftType)).toEqual(
          Object.values(ShiftType)
        )
      })

      it('should contain 5 nurses per shift', () => {
        rosterBuilder
          .build()
          .forEach((shift) => expect(shift.nurses).toHaveLength(5))
      })
    })

    describe('for multiple days', () => {
      it('should produce 3 different types of shift per day', () => {
        rosterBuilder = rosterBuilderForTesting({
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-02') // 2 days
        })

        const roster = rosterBuilder.build()

        expect(roster).toHaveLength(6)

        expect(roster.map((shift) => shift.date)).toEqual([
          new Date('2001-01-01T00:00:00.000Z'),
          new Date('2001-01-01T00:00:00.000Z'),
          new Date('2001-01-01T00:00:00.000Z'),
          new Date('2001-01-02T00:00:00.000Z'),
          new Date('2001-01-02T00:00:00.000Z'),
          new Date('2001-01-02T00:00:00.000Z')
        ])

        expect(roster.map((shift) => shift.shiftType)).toEqual([
          ShiftType.Morning,
          ShiftType.Evening,
          ShiftType.Night,
          ShiftType.Morning,
          ShiftType.Evening,
          ShiftType.Night
        ])
      })

      it('can have the same nurses on shifts over multiple days', () => {
        rosterBuilder = rosterBuilderForTesting({
          nurses: testNurses(15), // Each nurse should work once a day, since 3 shifts * 5 nurses per shift
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-02')
        })

        const roster = rosterBuilder.build()

        const expected: Shift[] = [
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 0)
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 5)
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 10)
          },
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-02'),
            nurses: testNurses(5, 0)
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-02'),
            nurses: testNurses(5, 5)
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-02'),
            nurses: testNurses(5, 10)
          }
        ]

        expect(roster).toEqual(expected)
      })

      it('should persist nurse ordering over multiple days', () => {
        rosterBuilder = rosterBuilderForTesting({
          // This is more than the 3 shifts * 5 people, so the roster should
          // use the remaining nurses (16 and 17) on the second day
          // before rolling over to the first ones
          nurses: testNurses(17),
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-02')
        })

        const roster = rosterBuilder.build()

        const expected: Shift[] = [
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 0)
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 5)
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-01'),
            nurses: testNurses(5, 10)
          },
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-02'),
            nurses: [
              testNurse(15),
              testNurse(16),
              testNurse(0), // Resets to the first user here, having reached the end of the nurse list
              testNurse(1),
              testNurse(2)
            ]
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-02'),
            nurses: testNurses(5, 3)
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-02'),
            nurses: testNurses(5, 8)
          }
        ]

        expect(roster).toEqual(expected)
      })

      it('should generate the appropriate number of shifts over longer periods', () => {
        const startDate = new Date('2001-01-01')
        const endDate = new Date('2001-03-01')

        rosterBuilder = rosterBuilderForTesting({
          nurses: testNurses(100),
          startDate,
          endDate
        })

        // 3 shifts per day
        const expectedNumberOfShifts = differenceInDays(startDate, endDate) * 3

        const roster = rosterBuilder.build()
        expect(roster).toHaveLength(expectedNumberOfShifts)
      })
    })
  })
})
