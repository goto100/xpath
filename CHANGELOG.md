# Changelog

All notable changes to this project are listed here. Dates are the npm
publish dates. Earlier entries were reconstructed from the git history and
npm, so the older they are, the less detail they have.

## 0.1.0 (unreleased)

### Breaking changes (TypeScript only)

- The TypeScript interface `XPathResult` in `xpath.d.ts` is renamed to
  `XPathEvaluationResult`. It describes the values custom functions receive
  as arguments and that `XPathEvaluator.evaluate()` returns
  (`booleanValue()`, `numberValue()`, `stringValue()`, and `toArray()` /
  `first()` / `size` on node sets). It was added in 0.0.36.

  This is a type-only change: nothing changes at runtime. The name
  `XPathResult` now belongs to the DOM 3 `XPathResult` class that
  `xpath.evaluate()` returns and the library exports as
  `xpath.XPathResult` (`xpath.XPathResult.ANY_TYPE`, etc.), which is
  unchanged.

  To migrate, replace type references to `XPathResult` from this package
  with `XPathEvaluationResult`. The documentation page moved from
  `docs/XPathResult.md` to `docs/XPathEvaluationResult.md`.

### Changed

- Faster evaluation: contexts are copied with the new
  `XPathContext.prototype.clone()`, which copies a fixed set of fields,
  instead of copying every property (#146). On the benchmark in #146
  (100,000 selections), evaluation took about a third to a half as long.
- Behavior change: custom properties set on an `XPathContext` are no longer
  copied to the contexts that location paths and predicates are evaluated
  with. Only the library's own context fields are (#146).

### Deprecated

- `XPathContext.prototype.extend()`. The library no longer uses it. It still
  works as before, logs a deprecation warning the first time it's called,
  and will be removed in a future version (#146).

### Fixed

- Parsing number literals no longer backtracks quadratically on long runs of
  digits (#151).

### Other

- Removed the out-of-date `package-lock.json`; the repository uses yarn
  (`yarn.lock`) for its dev dependencies (#154).
- Added this changelog.

## 0.0.36 (2026-10-28)

- TypeScript: added typings for `xpath.parse()` and the parsed-expression
  API (#139), including the `XPathResult` interface renamed in 0.1.0.

## 0.0.35 (2026-10-07)

- Parsed expressions can be given the context position and size to evaluate
  with (#148).
- Clearer errors when the expression or the context node is missing or
  invalid: a missing or non-string expression, and a context node that
  isn't a DOM node, now throw (#137).
- TypeScript: `isArrayOfNodes()` accepts the value `select()` returns
  (#127).
- The published package lists `xpath.d.ts` in `files` (#124).
- More tests for node positions and namespace nodes (#136).

## 0.0.34 (2023-12-16)

- Node positions on reverse axes are correct, and nodes are sorted before
  predicates are applied (#135, via #136).
- Fixed sorting of namespace nodes (#83, via #136).

## 0.0.33 (2023-07-14)

- Added node type test functions, with typings: `isNodeLike()`,
  `isArrayOfNodes()`, `isElement()`, `isAttribute()` and the other `is…()`
  helpers. Fixed issues in the type definitions (#116).
- Added an ES5 check of `xpath.js` (`validate` script) (#118).
- Tests and documentation use `@xmldom/xmldom` instead of `xmldom` (#106,
  #117); documentation install command updated (#114).

## 0.0.32 (2020-10-20)

- `NodeTest` objects expose `.type` again (restoring earlier behavior).

## 0.0.31 (2020-10-19)

- Fixed a "maximum call stack size exceeded" error (#99).

## 0.0.30 (2020-10-14)

- More of the library's internal types are exported.

## 0.0.29 (2020-08-21)

- Republished with no code changes from 0.0.28.

## 0.0.28 (2020-08-21)

- Fixed performance problems introduced after 0.0.24.
- TypeScript: definitions updated for strict null checks (#82), and they
  reference the DOM library, fixing "Cannot find name 'Node'" errors (#86,
  via #90).
- Added `.npmignore` (#80) and a `LICENSE` file (#94).
- Unit tests converted to mocha.

## 0.0.27 (2017-12-04)

- Added the `isHtml` option for parsed expressions (#27). It also turns on
  `allowAnyNamespaceForNoPrefix`.
- License changed from CC-BY-SA-2.0 to MIT (#76).

## 0.0.26 (2017-11-25)

- Added the `allowAnyNamespaceForNoPrefix` option for parsed expressions
  (#27).
- Documentation fixes.

## 0.0.25 (2017-11-23)

- Path evaluation refactored, fixing incorrect handling of the context
  position (#45).
- Fixed processing-instruction node tests with a name failing to match
  (#48).
- Fixed an error thrown by `numberValue()` on booleans (#74).
- Fixed inequality comparisons (#71).
- Documentation fixes.

## 0.0.24 (2017-03-10)

- Added TypeScript type definitions (#68).
- Fixed comparisons between two node sets (#53).
- Fixed the string value of numbers (#67).
- Documentation for parsed expressions, `XPathEvaluator`, `XPathResult`
  (now `XPathEvaluationResult`) and the function and namespace resolvers;
  `xpath.parse()` added to the API documentation.
- The license in `package.json` is given as `CC-BY-SA-2.0` (was
  "Creative Commons").

## 0.0.23 (2016-04-09)

- A meaningful error for an invalid function name (#44).
- Fixed a regression in the string values of element and document nodes
  (#39, via #40).
- Code samples in the README cleaned up (#43).

## 0.0.22 (2016-03-02)

- Selecting multiple attributes returns all of them (#37, #42).
- Fixed string values of element, document and document fragment nodes, and
  of node sets containing CDATA.
- Attribute string values use `Attr.value`, falling back to
  `Attr.nodeValue` (#35).
- Fixed issues in strict mode (#31).

## 0.0.21 (2016-01-26)

- Republished with no code changes from 0.0.20.

## 0.0.20 (2016-01-25)

0.0.10 to 0.0.19 were never published.

- Expressions can be parsed once and evaluated many times (`xpath.parse()`),
  with support for custom functions and variables.
- The library's types are exposed, so parsed expressions can be analyzed.
- Performance improvements for node ordering and node sets
  (`Node.compareDocumentPosition()` when available).
- Fixed the `preceding::` axis in document fragments, and names of DOM
  Level 1 elements.
- Unterminated string literals are detected.
- `XPathException` behaves like an `Error`; `string()` with no arguments and
  `string()` on document fragments fixed.
- Fixed string values in several cases, and `name()` / `local-name()` for
  processing instructions.
- `Utilities` is no longer created as a global variable.
- The license in `package.json` changed from MIT to "Creative Commons".
- README fixes (#8, #9).

## 0.0.9 (2015-01-06)

- Fixed `substring-after()` (#15).

## 0.0.8 (2014-12-11)

- Fixed `XPathNamespace` instantiation (#10).

## 0.0.7 (2014-07-08)

- Works in a browser as well as in Node (#3).

## 0.0.6 (2014-02-12)

- Namespace support (#2) and README fixes (#1).

## 0.0.1 to 0.0.5 (2012-08-20 to 2012-08-22)

The first releases. The commit history doesn't say what changed between
them: its version numbers don't line up with what was published, and
0.0.5 has no matching commit.
