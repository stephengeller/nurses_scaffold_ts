import * as fs from 'fs'
import * as yargs from 'yargs'
import {RosterBuilder, Shift} from './src/rostering/RosterBuilder'
import {RosterFormatter} from './src/rostering/RosterFormatter'

const validateArgs = (args: any) => {
  let errors = []

  if (isNaN(args['start-date'])) {
    errors.push('please provide valid start date')
  }

  if (isNaN(args['end-date'])) {
    errors.push('please provide valid end date')
  }

  if (!fs.existsSync(args['filename'])) {
    errors.push('input file does not exist')
  }

  if (args['start-date'] > args['end-date']) {
    errors.push('please provide a valid date range')
  }

  if (errors.length > 0) {
    console.log('\n' + errors.length + ' parameter errors found:')
    console.log('===============================')

    errors.forEach(function(error) {
      console.log('- ' + error)
    })

    console.log('\n')
    process.exit()
  }
}

// Just an example. Tackle this however you like.
const getRosteredNurses = (args: any) => {
  return RosterBuilder.build({
    filename: args['filename'],
    startDate: args['start-date'],
    endDate: args['end-date']
  })
}

const outputFormattedRoster = (roster: Shift[]) =>
  RosterFormatter.output(console.log, roster)

yargs
  .usage('$0 <cmd> [args]')
  .option('start-date', {
    describe: 'the first date of the period to roster, in YYYY-MM-DD format'
  })
  .option('end-date', {
    describe: 'the final date of the period to roster, in YYYY-MM-DD format'
  })
  .option('filename', {
    describe: 'a nurses file to import'
  })
  .coerce(['start-date', 'end-date'], Date.parse)
  .demandOption(['start-date', 'end-date', 'filename'])
  .command(
    '$0',
    'Build a nurses roster',
    () => {},
    argv => {
      validateArgs(argv)
      outputFormattedRoster(getRosteredNurses(argv))
    }
  )
  .help().argv
