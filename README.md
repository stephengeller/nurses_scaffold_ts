# Nurse Rostering

## Challenge

In a hospital environment, nurses work a rotating shift system. There are three work shifts per day; a morning shift, an evening shift and a night shift. Each day, all three shift needs to be filled.

You have been tasked with developing a rostering system which can calculate and output the nursing roster for any specified month.

A list of rosterable nurses has been provided in the file sample_data/nurses.csv.

## Considerations

- 5 nurses need to be on staff for each shift.
- Nurses must not be expected to work more than one shift per day.
- To maintain a healthy work/life balance, no nurse can be asked to work for more than 5 days in a row.
- Similarly, no nurse can be expected to work more than five night shifts per month.
- Days off must occur in groups of two or more.

## Scaffold Code

Some code has already been provided to help save you time. This focusses on the following areas.

1. Providing a command line interface so that this app can be called with parameters and provide help information.
2. Handling of input and output, such as parsing a file of nurses, and formatting the resulting roster to text, for printing to standard out.
3. A few basic data classes such as Roster and Nurse, mainly provided so that the input and output handling code has something to work with.

You're welcome to change any of this code if you like, but the goal is to save you time so you can show us how you'd like to solve the interesting parts of this problem, not spend your time formatting strings for output.

You may want to start by looking at the RosterBuilder class which is intended to do the work of creating the Roster.

## Running

This app is designed to be from the command line using:

```
node index.js
```

Doing so with no params should print out usage information.

## Tests

You can run tests with `npm test`. Tests for the scaffold code have been provided.
