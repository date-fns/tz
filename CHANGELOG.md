# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning].

This change log follows the format documented in [Keep a CHANGELOG].

[semantic versioning]: http://semver.org/
[keep a changelog]: http://keepachangelog.com/

## v1.0.3 - 2024-09-22

This is yet another critical bug-fix release. Thank you to all the people who sent PRs and reported their issues.

### Fixes

- [Fixes negative fractional time zones like `America/St_Johns`](https://github.com/date-fns/tz/pull/7). Kudos to [@allohamora](https://github.com/allohamora)!

## v1.0.2 - 2024-09-14

This release fixes a couple of critical bugs in the previous release.

### Fixes

- Fixed UTC setters functions generation.

- Create `Invalid Date` instead of throwing an error on invalid arguments.

- Make all the number getters return `NaN` when the date or time zone is invalid.

- Make `tzOffset` return `NaN` when the date or the time zone is invalid.

## v1.0.1 - 2024-09-13

Initial version
