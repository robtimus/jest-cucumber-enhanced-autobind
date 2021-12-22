import { loadFeatures, StepDefinitions } from "jest-cucumber";
import { ParsedFeature } from "jest-cucumber/dist/src/models";
import { JestCucumberExecutor } from "../src";

// Based on https://github.com/bencompton/jest-cucumber/blob/master/examples/ecmascript/specs/step-definitions/basic-scenarios.steps.js
class LoginExecutor extends JestCucumberExecutor {
  private password = "1234";
  private accessGranted = false;

  // For checking Jest callbacks
  private activeFeatureCount = 0;
  private completedFeatureCount = 0;
  private readonly expectedFeatureCount: number;
  private readonly featuresExecuted: string[] = [];
  private readonly expectedFeaturesExecuted: string[];

  private activeScenarioCount = Number.MIN_VALUE;
  private completedScenarioCount = Number.MIN_VALUE;
  private expectedScenarioCount = Number.MIN_VALUE;

  private readonly scenariosPerFeature: { [feature: string]: number };

  constructor(features: ParsedFeature[]) {
    super();
    this.expectedFeatureCount = features.length;
    this.expectedFeaturesExecuted = features.map((feature) => feature.title);
    this.scenariosPerFeature = {};
    features.forEach((feature) => (this.scenariosPerFeature[feature.title] = feature.scenarios.length));
  }
  afterFeatures(): void {
    expect(this.activeFeatureCount).toBe(0);
    expect(this.completedFeatureCount).toBe(this.expectedFeatureCount);
    expect(this.featuresExecuted).toStrictEqual(this.expectedFeaturesExecuted);
  }
  beforeFeature(feature: ParsedFeature): void {
    this.activeFeatureCount++;

    this.activeScenarioCount = 0;
    this.completedScenarioCount = 0;
    this.expectedScenarioCount = this.scenariosPerFeature[feature.title];
  }
  afterFeature(feature: ParsedFeature): void {
    this.activeFeatureCount--;
    this.completedFeatureCount++;
    this.featuresExecuted.push(feature.title);

    expect(this.activeScenarioCount).toBe(0);
    expect(this.completedScenarioCount).toBe(this.expectedScenarioCount);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeScenario(_feature: ParsedFeature): void {
    this.activeScenarioCount++;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterScenario(_feature: ParsedFeature): void {
    this.activeScenarioCount--;
    this.completedScenarioCount++;

    expect(this.activeScenarioCount).toBe(0);
  }

  stepDefinitions(): StepDefinitions[] {
    return [
      ({ given, when, then }) => {
        given("I have previously created a password", () => {
          this.password = "1234";
        });

        given(/My password = "(.*)"/, (password) => {
          this.password = password;
        });

        given("I have an existing password", () => {
          // don't change anything
        });

        when("I enter my password correctly", () => {
          this.accessGranted = true;
        });

        when(/I enter password "(.*)"/, (password) => {
          this.accessGranted = this.password === password;
        });

        then("I should be granted access", () => {
          expect(this.accessGranted).toBe(true);
        });

        then("I should not be granted access", () => {
          expect(this.accessGranted).toBe(false);
        });
      },
    ];
  }
}

const features = loadFeatures("features/**/*.feature");

const executor = new LoginExecutor(features);
afterAll(() => executor.afterFeatures());

describe("JestCucumberExecutor", () => {
  executor.execute(features);
});
