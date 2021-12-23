import { defineFeature, StepDefinitions } from "jest-cucumber";
import { ParsedFeature } from "jest-cucumber/dist/src/models";
import { generateStepCode } from "jest-cucumber/dist/src/code-generation/step-generation";
import { matchSteps } from "jest-cucumber/dist/src/validation/step-definition-validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepFunction = () => any;
type StepRegistration = { stepMatcher: string | RegExp; stepFunction: StepFunction };

function collectSteps(scopedSteps: StepRegistration[], stepDefinitions: StepDefinitions[]): void {
  const registerStep = (stepMatcher: string | RegExp, stepFunction: StepFunction) => {
    scopedSteps.push({
      stepMatcher,
      stepFunction,
    });
  };

  stepDefinitions.forEach((stepDefinitionCallback) => {
    stepDefinitionCallback({
      defineStep: registerStep,
      given: registerStep,
      when: registerStep,
      then: registerStep,
      and: registerStep,
      but: registerStep,
      pending: () => {
        // Nothing to do
      },
    });
  });
}

const globalSteps: StepRegistration[] = [];

export interface AutoBindStepOptions {
  beforeFeature?: (feature: ParsedFeature) => void;
  afterFeature?: (feature: ParsedFeature) => void;
  beforeScenario?: (feature: ParsedFeature) => void;
  afterScenario?: (feature: ParsedFeature) => void;
  scope?: "global" | "local";
}

export const autoBindSteps = (features: ParsedFeature[], stepDefinitions: StepDefinitions[], options?: AutoBindStepOptions) => {
  const scopedSteps = options?.scope === "global" ? globalSteps : [];
  collectSteps(scopedSteps, stepDefinitions);

  const errors: string[] = [];

  features.forEach((feature) => {
    defineFeature(feature, (test) => {
      beforeAll(() => options?.beforeFeature && options.beforeFeature(feature));
      afterAll(() => options?.afterFeature && options.afterFeature(feature));
      beforeEach(() => options?.beforeScenario && options.beforeScenario(feature));
      afterEach(() => options?.afterScenario && options.afterScenario(feature));

      const scenarioOutlineScenarios = feature.scenarioOutlines.map((scenarioOutline) => scenarioOutline.scenarios[0]);
      const scenarios = [...feature.scenarios, ...scenarioOutlineScenarios];

      scenarios.forEach((scenario) => {
        test(scenario.title, (options) => {
          scenario.steps.forEach((step, stepIndex) => {
            const matches = scopedSteps.filter((scopedStep) => matchSteps(step.stepText, scopedStep.stepMatcher));

            if (matches.length === 1) {
              const match = matches[0];

              options.defineStep(match.stepMatcher, match.stepFunction);
            } else if (matches.length === 0) {
              const stepCode = generateStepCode(scenario.steps, stepIndex, false);
              // tslint:disable-next-line:max-line-length
              errors.push(`No matching step found for step "${step.stepText}" in scenario "${scenario.title}" in feature "${feature.title}". Please add the following step code: \n\n${stepCode}`);
            } else {
              const matchingCode = matches.map((match) => `${match.stepMatcher.toString()}\n\n${match.stepFunction.toString()}`);
              errors.push(`${matches.length} step definition matches were found for step "${step.stepText}" in scenario "${scenario.title}" in feature "${feature.title}". Each step can only have one matching step definition. The following step definition matches were found:\n\n${matchingCode.join("\n\n")}`);
            }
          });
        });
      });
    });
  });

  if (errors.length) {
    throw new Error(errors.join("\n\n"));
  }
};
