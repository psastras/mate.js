# maté.js

[![CircleCI](https://circleci.com/gh/psastras/mate.js.svg?style=shield&circle-token=:circle-ci-badge-token)](https://circleci.com/gh/psastras/mate.js/tree/master)
[![codecov](https://codecov.io/gh/psastras/mate.js/branch/master/graph/badge.svg)](https://codecov.io/gh/psastras/mate.js)

<p align="center">
  <img src="https://psastras.github.io/mate.js/icon.png" alt="mate.js"/>
</p>

_Core primitives and utilities for javascript and typescript, based off of Google's [Guava](https://github.com/google/guava) library._

## Links

- [GitHub](https://github.com/psastras/mate.js)
- [Documentation](https://psastras.github.io/mate.js/)

## Installation

Not yet, sorry.

## Exported Classes

### Collections

- [ArrayMultimap](https://psastras.github.io/mate.js/classes/_collections_hashbimap_.arraymultimap.html) -
a multimap backed by arrays for its values
- [HashBiMap](https://psastras.github.io/mate.js/classes/_collections_hashbimap_.hashbimap.html) -
a bidirectional map backed by two hash tables

## Development

Install dependencies

```shell
yarn install
```

Running tests

```shell
yarn test
```

Building the distribution

```shell
jspm install
npm run build
```

When developing, it can be helpful to watch the source and tests for changes, rerunning
tests when necessary.

```shell
npm run watch
```