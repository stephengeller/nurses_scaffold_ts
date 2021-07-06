# My Approach

## Structure

I wanted to keep my solution to this challenge simple and decided to keep the logic predominantly restricted to the `RosterBuilder` module, which I turned into a class in order to handle state. I therefore kept most of the scaffolding/starter code outside of `RosterBuilder` largely as-is, with small changes made to improve the rendered output and add more types. The `RosterBuilder` class handles virtually all the logic for managing shifts, days of shifts, and the nurses added to said shifts.

The provided interfaces guided me in my solution, and I largely kept them defined as-is.

## Commits

I decided to approach my commits by using the [`commitizen`](https://github.com/commitizen/cz-cli) library to ensure the commits are descriptive and have a clear scope. In my daily work, I would normally make commits on a branch and clean up the commit history ahead of raising a pull request. I would then add new commits as requests for changes came through, and a merge would likely squash these commits into a single change set. The main/master branch would then have clear sets of changes in the form of merges from branches. 

For this challenge however, I aimed to make incremental commits where possible, looking to reveal my thought process along the way. This resulted in a comparatively large number of commits (over 20, sorry!), but I would have looked to reduce the number of commits produced if looking to merge this work into an existing application. That being said, I would likely have raised incremental PRs for this work rather than one big PR in that scenario!

## Tests

The [`RosterBuilder` test suite](../src/rostering/RosterBuilder/__tests__/index.test.ts) is quite intimidatingly large. Although I would have preferred this file to be more succinct, I decided to keep the tests more explicit in what functionality they are looking to test rather than look to refactor them in favour of conciseness. This will hopefully help with legibility despite the length of the file.

## Quality of Life Improvements

I also added some quality of life improvements to the repository:

 * Added some helper scripts in `scripts/` to facilitate the setting up, testing and running the code.
 * Added linting and formatting tools (eslint and prettier) to ensure consistency across the codebase
 * Used yarn over npm (although eventually reverted this change to ensure evaluators had no issues running the code)

## Development

Although challenging to consistently show through my commit history, I followed a test-driven development approach to build my solution. I progressively added failing tests, passed them, then refactored accordingly using the red-green-refactor approach. I ensured I only wrote code to successfully pass tests, keeping a tight scope.

In order to ensure that the end-user (standard output, for now) received the intended result, I created [integration tests](../src/__tests__/integration.ts) to combine the `RosterBuidler` and `RosterFormatter` implementations and provide means of testing the program outside of running the CLI.

## Ideas for improvement 

With more time, I would have looked to break out some logic held within the `RosterBuilder` class and moved it into other, smaller classes. For example, the `RosterBuilder` class contains logic on managing lists of nurses, divided into groups of nurses based on their assignment to a shift. I would have liked to have created a `NurseManager` class of some form, which could handle some logic of managing the state of the nurse lists as well as reduce the bloat within the `RosterBuilder` test suite.

I wasn't sure who/what was going to ingest the output of this application, so made an assumption that it would be for primarily human eyes. Given that, I made a small change in how the output is rendered so that the columns are of an equal width, slightly improving the reading experience. If I had more time, I would have explored rendering the output in different formats depending on use-cases. For example, it would have been nice to have a `--output` flag that could allow users to selectively render the output as JSON, YAML, CSV or other parsable formats.

Below are a few other ideas that I would have considered exploring:
 * Shuffle the list of nurses at the start of each day (or week/month, if longer periods of time are implemented)
 * Write the output to file (as an optional command-line flag)
 * Refactor types/interfaces to dedicated `types.ts` file
 * Make tests less brittle (for example, refactor tests to use NURSES_PER_SHIFT constant to determine nurse count rather than assume the number of nurses required per shift will always be 5)
 * Provide an interface where, after a roster has been produced, users can query for every shift for a specific nurse within the specified dates.
