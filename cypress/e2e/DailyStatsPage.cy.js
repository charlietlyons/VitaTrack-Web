import {
  mockGetIntakes,
  mockVerifyToken,
  mockAddIntake,
  visitDailyStatsPage,
  mockDeleteIntake,
} from "./TestUtils";

describe("Daily Stats Page", () => {
  beforeEach(() => {
    mockVerifyToken();
    mockGetIntakes();
    mockAddIntake();
  });

  describe("Daily Log", () => {
    it("should not delete intake if delete fails", () => {
      cy.intercept(
        "DELETE",
        "/intake/*",
        {
          statusCode: 500,
          body: {},
        }
      );

      visitDailyStatsPage();

      cy.get("#delete-intake-button-0").click();

      cy.get("#daily-log-error").contains(
        "Could not delete intake. Try again later."
      );
    });

    it("should delete intake on delete click", () => {
      mockDeleteIntake();

      visitDailyStatsPage();

      cy.get("#delete-intake-button-0").click();

      cy.get("#intake-0").should("not.exist");
    });

    it("should display error if refresh fails", () => {
      cy.intercept(
        "GET",
        "/intake?*",
        {
          statusCode: 500,
          body: {},
        }
      );

      visitDailyStatsPage();

      cy.get("#daily-log-error").contains(
        "Something went wrong."
      );
    })

    it("should display error if error thrown", () => {
      cy.intercept(
        "GET",
        "/intake?*",
        (req) => { req.destroy() }
      );
      
      visitDailyStatsPage();
      
      cy.get("#daily-log-error").contains(
        "Something went wrong. Network error."
      );
    })
  });

});