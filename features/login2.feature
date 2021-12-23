Feature: Logging in 2

Scenario: Entering a correct password
    Given My password = "5678"
    When I enter password "5678"
    Then I should be granted access

Scenario: Entering an incorrect password
    Given My password = "1234"
    When I enter password "5678"
    Then I should not be granted access
