# jest-cucumber-enhanced-autobind

A replacement for [jest-cucumber](https://www.npmjs.com/package/jest-cucumber)'s [autoBindSteps](https://github.com/bencompton/jest-cucumber/blob/HEAD/docs/AutomaticStepBinding.md) that allows more configuration options as an optional third argument.

Available options:

* `beforeFeature`: a function that runs before each feature. The feature is given as function argument.
* `afterFeature`: a function that runs after each feature. The feature is given as function argument.
* `beforeScenario`: a function that runs before each scenario. The feature is given as function argument. Unfortunately, the scenario is not available.
* `afterScenario`: a function that runs after each scenario. The feature is given as function argument. Unfortunately, the scenario is not available.
* `scope`: the scope to register step definitions for. The narrower the scope, the smaller the chances for conflicts.\
  Possible values:
  * `global`: step definitions are registered globally. This scope works just like `jest-cucumber`'s own `autoBindSteps`.
  * `local` (default): step definitions are registered per call to `autoBindSteps`. This scope works just like [@saasquatch/scoped-autobindsteps](https://www.npmjs.com/package/@saasquatch/scoped-autobindsteps).

## Deprecated

As of 2022-06-26, this project is no longer maintained. Unlike Jest's `beforeAll`, `afterAll`, `beforeEach` and `afterEach`, the callback functions don't allow timeouts to be specified, and don't support the `done` argument that Jest's callback functions support. Just use Jest's callback functions in the same scope where `jest-cucumber`'s `autoBindSteps` is used.
