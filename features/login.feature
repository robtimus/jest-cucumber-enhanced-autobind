Feature: Logging in

Scenario: Entering a previously set correct password
    Given I have previously created a password
    When I enter my password correctly
    Then I should be granted access

Scenario: Entering a specific correct password
    Given My password = "5678"
    When I enter password "5678"
    Then I should be granted access

Scenario: Entering an incorrect password
    Given My password = "1234"
    When I enter password "5678"
    Then I should not be granted access
