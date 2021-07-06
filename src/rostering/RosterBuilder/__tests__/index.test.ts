import {
  Nurse,
  RosterBuilder,
  RosterBuilderArgs,
  Shift,
  ShiftType
} from '../index'
import {differenceInDays} from '../../../utils/utils'

const testNurse = (uid: number): Nurse => ({
  uid: uid.toString(),
  name: uid.toString()
})

const testNurses = (count: number): Nurse[] =>
  Array.from(Array(count).keys()).map((n) => testNurse(n))

const rosterBuilderForTesting = (args: Partial<RosterBuilderArgs>) =>
  new RosterBuilder({
    startDate: new Date('2001-01-01'),
    endDate: new Date('2001-01-02'),
    nurses: testNurses(100),
    ...args
  })

describe('RosterBuilder', function () {
  let rosterBuilder: RosterBuilder
  beforeEach(() => {
    rosterBuilder = rosterBuilderForTesting({nurses: testNurses(100)})
  })

  describe('createShift', function () {
    it('should generate a shift from available nurses', function () {
      const rosterBuilder = rosterBuilderForTesting({
        nurses: testNurses(5)
      })

      const shift = rosterBuilder.createShift(ShiftType.Morning)

      expect(shift).toEqual({
        shiftType: ShiftType.Morning,
        nurses: [
          {uid: '0', name: '0'},
          {uid: '1', name: '1'},
          {uid: '2', name: '2'},
          {uid: '3', name: '3'},
          {uid: '4', name: '4'}
        ]
      })
    })
    it('should throw error if not enough nurses available', function () {
      const rosterBuilder = rosterBuilderForTesting({nurses: testNurses(3)})

      expect(() => rosterBuilder.createShift(ShiftType.Evening)).toThrowError(
        'Not enough nurses to fill shift (3 nurses available)'
      )
    })

    it('should pick the first available nurses in order', function () {
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

    it('should remove nurses from the available pool once assigned to a shift', function () {
      const nurses = [
        testNurse(1),
        testNurse(2),
        testNurse(3),
        testNurse(4),
        testNurse(5),
        testNurse(6),
        testNurse(7)
      ]

      const rosterBuilder = rosterBuilderForTesting({nurses})
      expect(rosterBuilder.nurses).toEqual(nurses)

      rosterBuilder.createShift(ShiftType.Evening)

      expect(rosterBuilder.nurses).toEqual([testNurse(6), testNurse(7)])
    })

    it('should add nurses to list of assigned nurses', function () {
      const nurses = [
        testNurse(1),
        testNurse(2),
        testNurse(3),
        testNurse(4),
        testNurse(5),
        testNurse(6),
        testNurse(7)
      ]

      const rosterBuilder = rosterBuilderForTesting({nurses})
      expect(rosterBuilder.nurses).toEqual(nurses)
      expect(rosterBuilder.assignedNurses).toEqual([])

      rosterBuilder.createShift(ShiftType.Evening)

      expect(rosterBuilder.nurses).toEqual([testNurse(6), testNurse(7)])
      expect(rosterBuilder.assignedNurses).toEqual([
        testNurse(1),
        testNurse(2),
        testNurse(3),
        testNurse(4),
        testNurse(5)
      ])
    })
  })

  describe('createDay', function () {
    it('should produce 3 shifts', function () {
      const day = rosterBuilder.createDay(new Date())
      expect(day).toHaveLength(3)
    })

    it('should have one of each shift type', function () {
      const day = rosterBuilder.createDay(new Date())
      const shiftTypes = day.map((d) => d.shiftType)
      expect(new Set(shiftTypes).size).toEqual(day.length)
    })

    it('should produce a list of 5 nurses for each type of shift', function () {
      const day = rosterBuilder.createDay(new Date())
      day.forEach((shift) => expect(shift.nurses).toHaveLength(5))
    })

    it('should throw error if not enough nurses to fill a day of shifts', function () {
      rosterBuilder = rosterBuilderForTesting({nurses: testNurses(13)})
      expect(() => rosterBuilder.createDay(new Date())).toThrowError(
        `Not enough nurses to fill shift (3 nurses available)`
      )
    })

    it('should have no nurses working twice in a day', function () {
      const day = rosterBuilder.createDay(new Date())
      day.forEach((shift) =>
        shift.nurses.some((nurse) =>
          day.forEach((shift) => shift.nurses.includes(nurse))
        )
      )
    })
  })

  describe('build', function () {
    describe('for one day', function () {
      beforeEach(() => {
        rosterBuilder = rosterBuilderForTesting({
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-02')
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

      it('should produce a shift of each shiftType', function () {
        expect(rosterBuilder.build().map((shift) => shift.shiftType)).toEqual([
          'morning',
          'evening',
          'night'
        ])
      })

      it('should contain 5 nurses per shift', function () {
        rosterBuilder
          .build()
          .forEach((shift) => expect(shift.nurses).toHaveLength(5))
      })
    })

    describe('for multiple days', function () {
      it('should produce 3 different types of shift per day', function () {
        rosterBuilder = rosterBuilderForTesting({
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-03') // 2 days
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

      it('can have the same nurses on shifts over multiple days', function () {
        rosterBuilder = rosterBuilderForTesting({
          nurses: testNurses(15), // Each nurse should work once a day, since 3 shifts * 5 nurses per shift
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-03')
        })

        const roster = rosterBuilder.build()

        const expected: Shift[] = [
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(0),
              testNurse(1),
              testNurse(2),
              testNurse(3),
              testNurse(4)
            ]
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(5),
              testNurse(6),
              testNurse(7),
              testNurse(8),
              testNurse(9)
            ]
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(10),
              testNurse(11),
              testNurse(12),
              testNurse(13),
              testNurse(14)
            ]
          },
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-02'),
            nurses: [
              testNurse(0),
              testNurse(1),
              testNurse(2),
              testNurse(3),
              testNurse(4)
            ]
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-02'),
            nurses: [
              testNurse(5),
              testNurse(6),
              testNurse(7),
              testNurse(8),
              testNurse(9)
            ]
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-02'),
            nurses: [
              testNurse(10),
              testNurse(11),
              testNurse(12),
              testNurse(13),
              testNurse(14)
            ]
          }
        ]

        expect(roster).toEqual(expected)
      })

      it('should persist nurse ordering over multiple days', function () {
        rosterBuilder = rosterBuilderForTesting({
          // This is more than the 3 shifts * 5 people, so the roster should
          // use the remaining nurses (16 and 17) before rolling over to the first ones
          nurses: testNurses(17),
          startDate: new Date('2001-01-01'),
          endDate: new Date('2001-01-03')
        })

        const roster = rosterBuilder.build()

        const expected: Shift[] = [
          {
            shiftType: ShiftType.Morning,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(0),
              testNurse(1),
              testNurse(2),
              testNurse(3),
              testNurse(4)
            ]
          },
          {
            shiftType: ShiftType.Evening,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(5),
              testNurse(6),
              testNurse(7),
              testNurse(8),
              testNurse(9)
            ]
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-01'),
            nurses: [
              testNurse(10),
              testNurse(11),
              testNurse(12),
              testNurse(13),
              testNurse(14)
            ]
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
            nurses: [
              testNurse(3),
              testNurse(4),
              testNurse(5),
              testNurse(6),
              testNurse(7)
            ]
          },
          {
            shiftType: ShiftType.Night,
            date: new Date('2001-01-02'),
            nurses: [
              testNurse(8),
              testNurse(9),
              testNurse(10),
              testNurse(11),
              testNurse(12)
            ]
          }
        ]

        expect(roster).toEqual(expected)
      })

      it('should generate the appropriate number of shifts over longer periods', function () {
        const startDate = new Date('2001-01-01')
        const endDate = new Date('2001-03-01')

        rosterBuilder = rosterBuilderForTesting({
          nurses: testNurses(100),
          startDate,
          endDate
        })

        const roster = rosterBuilder.build()
        expect(roster).toHaveLength(differenceInDays(startDate, endDate) * 3)
      })
    })
  })
})
