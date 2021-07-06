# Nurse Rostering

## My Approach

Please see [my approach](./docs/approach.md) for details on how I went about completing this challenge.

## To Setup

Install all the dependencies via NPM: 

```bash
$ ./script/setup
```

## To Run

To try the implementation, you can run `script/start` with optional arguments:

```bash
$ ./script/start # runs with default arguments stated within the script
$ ./script/start <START_DATE> <END_DATE>
$ ./script/start 2021-01-05 2021-03-05
```

## To Test

```bash
$ ./script/test
```

## Context

You just started work for a startup that sells medical rostering software. They’ve just landed a new client, a major hospital, and everyone’s excited! However, the HR policies at the hospital are too complex for the software to handle.

At the hospital nurses work a rotating shift system. There are three work shifts per day; a morning shift, an evening shift and a night shift. Each day, all three shifts need to be filled.

Your task is to develop a rostering system that implements the following policies:

- Five nurses need to be on staff for each shift.
- Nurses must not be expected to work more than one shift per day.

The rostering system should calculate and output the nursing roster for any time period (specified by a start and end date).

A list of rosterable nurses has been provided in the file spec/sample_data/nurses.json.

## Scaffold Code

Some code has already been provided to help save you time. This focusses on the following areas.

1. Providing a command line interface so that this app can be called with parameters and provide help information.
2. Handling of input and output, such as parsing a file of nurses, and formatting the resulting roster to text, for printing to standard out.

You're welcome to change any of this code if you like, but the goal is to save you time so you can show us how you'd like to solve the interesting parts of this problem, not spend your time formatting strings for output.

You may want to start by looking at the RosterBuilder class which is intended to do the work of creating the Roster.

## Running

This app is designed to be from the command line using:

```
npm start -- --start-date=<start> --end-date=<end> --filename=<file>
```

Doing so with no params should print out usage information.

## Tests

You can run tests with `npm test`. Tests for the scaffold code have been provided.
