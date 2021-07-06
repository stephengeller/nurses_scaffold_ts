import {RosterBuilder} from '../rostering/RosterBuilder'
import {RosterFormatter} from '../rostering/RosterFormatter'
import * as path from 'path'

describe('Integration Tests', function () {
  it('should output 3 shifts per day for 3 days', () => {
    const rosterBuilder = new RosterBuilder({
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-03'),
      nurses: RosterBuilder.loadNurses(
        // assuming the nurses.json data is sample data for testing, I've hardcoded tha path here
        //  In practice, we might want to set this more dynamically
        path.join(__dirname, '../../sample_data/nurses.json')
      )
    })

    const roster = rosterBuilder.build()

    const loggingFunction = jest.fn()

    RosterFormatter.output(loggingFunction, roster)

    expect(loggingFunction).toHaveBeenCalledWith(
      `Wed Jan 01 2020 | morning | Gannon, Galya, Gaetan, Gabriel, Gabin
Wed Jan 01 2020 | evening | Gemini, Garin, Galil, Garrick, Gabi
Wed Jan 01 2020 | night   | Gareth, Gardenia, Gaius, Gemma, Gandy
Thu Jan 02 2020 | morning | Garnet, Garth, Gannet, Galloway, Garner
Thu Jan 02 2020 | evening | Gary, Gabo, Gal, Garvey, Garrett
Thu Jan 02 2020 | night   | Garnet, Galiot, Galena, Gaines, Gene
Fri Jan 03 2020 | morning | Gen, Garland, Galen, Galila, Garren
Fri Jan 03 2020 | evening | Gadiel, Garcia, Gauri, Gallagher, Galo
Fri Jan 03 2020 | night   | Gay, Gavi, Galt, Ganesh, Galway
`
    )
  })
})
