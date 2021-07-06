import {differenceInDays, flatten} from '../utils'

describe('flatten', function () {
  it('should flatten an array of arrays into one', function () {
    const arrayOfArrays = [[1], [2], [3, 4, 5]]
    expect(flatten(arrayOfArrays)).toEqual([1, 2, 3, 4, 5])
  })
})

describe('differenceInDays', function () {
  it('should return the correct difference in days between two dates', function () {
    const start = new Date('2001-01-01')
    const end = new Date('2001-01-11')
    expect(differenceInDays(start, end)).toEqual(11)
  })

  it('works over multiple months', function () {
    const start = new Date('2001-01-01')
    const end = new Date('2001-01-31')
    expect(differenceInDays(start, end)).toEqual(31)
  })

  it('works over multiple years', function () {
    const start = new Date('2001-01-01')
    const end = new Date('2001-12-31')
    expect(differenceInDays(start, end)).toEqual(365)
  })
})
