# jest-cucumber-executor

Constains class `JestCucumberExecutor`, an executor for [jest-cucumber](https://www.npmjs.com/package/jest-cucumber) features. This class works a lot like `jest-cucumber`'s [autoBindSteps](https://github.com/bencompton/jest-cucumber/blob/HEAD/docs/AutomaticStepBinding.md) functionality. However, it does not register steps globally, but per execution of a set of features. In addition, it provides [jest](https://www.npmjs.com/package/jest) callbacks.

## Creating executors

To create an executor for `jest-cucumber` features, create a sub class of `JestCucumberExecutor`. Only one method must be implemented: `stepDefinitions()`. This must return an array of `StepDefinitions` (which is an alias of `StepsDefinitionCallbackFunction`). This is comparable with the `stepDefinitions` argument to `jest-cucumber`'s `autoBindSteps`. However, the steps can reference any field of the sub class.

In addition, the following methods can be overridden; by default they all do nothing:

* `beforeFeature(feature: ParsedFeature)`: runs before each feature. The feature is given as function argument.
* `afterFeature(feature: ParsedFeature)`: runs after each feature. The feature is given as function argument.
* `beforeScenario(feature: ParsedFeature)`: runs before each scenario of a feature. The feature is given as function argument. Unfortunately, the scenario is not available.
* `afterScenario(feature: ParsedFeature)`: runs after each scenario of a feature. The feature is given as function argument. Unfortunately, the scenario is not available.

## Testing features

Once a `JestCucumberExecutor` sub class has been created, call its `execute(features: ParsedFeature[])` method to run tests. The features can be created as usual, usually using `jest-cucumber`'s `loadFeature` or `loadFeatures` functions.
