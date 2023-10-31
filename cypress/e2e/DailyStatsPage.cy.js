import {
  mockGetFoodOptions,
  mockGetIntakeById,
  mockGetIntakes,
  mockVerifyToken,
  mockAddIntake,
} from "./TestUtils";

describe("Daily Stats Page", () => {
  beforeEach(() => {
    mockVerifyToken();
    mockGetIntakes();
    mockGetIntakeById();
    mockGetFoodOptions();
    mockAddIntake();
  });

  describe("Intake Dialog", () => {
    it("should show an empty intake dialog when click add intake and add intake", () => {
      visitPage();

      cy.contains("Daily Stats");

      cy.get("#add-intake-id").click();

      cy.get("h2").contains("Add Intake");
      cy.get("input[role='combobox']").type("Grapes");
      cy.get("li").click();
      cy.get("#quantity").type(1);
      cy.get("#add-button").click();

      // cy.get("#intake-1").should("contain", "Grapes");
    });

    it("should show edit intake dialog when click edit intake", () => {
      visitPage();

      cy.contains("Daily Stats");

      cy.get("#edit-intake-button-0").click();

      cy.contains("Edit Intake");
      cy.get("#food").should("contain.value", "Grapes");
      cy.get("#quantity").should("contain.value", "10000");
      cy.get("#update-button").click();

      cy.get("#intake-0").should("contain", "Grapes");
    });
  });

  describe("Daily Log", () => {
    it("should not delete intake if delete fails", () => {
      cy.intercept(
        "DELETE",
        "http://localhost:3000/intake/6b99dc4c-2299-4ad2-8299-08cd7e3de025",
        {
          statusCode: 500,
          body: {},
        }
      );

      visitPage();

      cy.get("#delete-intake-button-0").click();

      cy.get("#form-error").contains(
        "Could not delete intake. Try again later."
      );
    });

    it("should delete intake on delete click", () => {
      visitPage();

      cy.get("#delete-intake-button-0").click();

      cy.get("#intake-0").should("not.exist");
    });
  });
});

function visitPage() {
  cy.visit("http://localhost:8080/vitatrack/daily", {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "someToken");
    },
  });
}
