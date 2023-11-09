import {
  mockGetFoodOptions,
  mockGetFirstIntakeById,
  mockGetSecondIntakeById,  
  visitDailyStatsPage,
  mockAddIntake, 
  mockGetIntakes,
  mockVerifyToken,
  mockDeleteFood,
} from "./TestUtils";

describe("Intake Dialog", () => {
  beforeEach(() => {
    mockVerifyToken();
    mockGetIntakes();
    mockAddIntake();
  });
    it("should display error if add intake fails", () => {
      mockGetFoodOptions();
      cy.intercept("POST", "/intake", (req) => {
        req.destroy();
      })
      visitDailyStatsPage();

      cy.get("#add-intake-id").click();
      cy.get("#food").type("Bananas");
      cy.get("li").click();
      cy.get("#quantity").type(1);

      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Could not submit intake. Try again later.");
    });

    it("should set error if food validation fails", () => {
      mockGetFoodOptions();
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.get("#add-intake-id").click();
      cy.get("#food").type("Bananas");
      cy.get("li").click();
      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Quantity is required");
    });

    it("should set error if quantity validation fails", () => {
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      mockGetFoodOptions();
      visitDailyStatsPage();


      cy.get("#add-intake-id").click();
      cy.get("#food").type("Bananas");
      cy.get("li").click();
      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Quantity is required");
    });

    it("should set empty options if get food options fails", () => {
      cy.intercept("GET", "/food", (req) => {
        req.destroy();
      })
      visitDailyStatsPage();

      cy.get("#add-intake-id").click();
      cy.get("input[role='combobox']").click();
      cy.get("li").should("not.exist");
    });

    it("should display validation error if field empty", () => {
      visitDailyStatsPage();

      cy.get("#add-intake-id").click();

      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Food is required");
    });

    it("should add new intakes through dialog", () => {
      mockGetFoodOptions();
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.contains("Daily Stats");

      cy.get("#add-intake-id").click();

      cy.get("h2").contains("Add Intake");
      cy.get("input[role='combobox']").type("Bananas");
      cy.get("li").click();
      cy.get("#quantity").type(1);
      cy.get("#add-button").click();

      cy.get("#intake-1").should("contain", "Bananas");
    });

    it("should show edit intake dialog when click edit intake", () => {
      mockGetFoodOptions();
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.contains("Daily Stats");

      cy.get("#edit-intake-button-0").click();

      cy.contains("Edit Intake");
      cy.get("#food").should("contain.value", "Grapes");
      cy.get("#quantity").should("contain.value", "10000");
      cy.get("#update-button").click();

      cy.get("#intake-0").should("contain", "Grapes");
    });

    it("should set error if cannot get intake", () => {
      mockGetFoodOptions();
      cy.intercept(
        "GET",
        "/intake/*",
        {
          statusCode: 500,
          body: {},
        }
      );
      visitDailyStatsPage();

      cy.get("#edit-intake-button-0").click();

      cy.get("#form-error-intake-form").should("contain",
        "Could not get intake. Try again later."
      );
    })

    it("should display error if can't delete food", () => {
      mockGetFoodOptions();
      cy.intercept(
        "DELETE",
        "/food/*",
        (req) => { req.destroy() }
      );
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.get("#edit-intake-button-0").click();
      cy.get("#delete-food-button").click()
      cy.get("#form-error-intake-form").should("contain",
        "Could not delete food. Try again later."
      );
    });

    it("should delete food on delete click", () => {
      mockGetFoodOptions();
      mockDeleteFood();
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.get("#edit-intake-button-1").click();
      cy.get("#food").should("contain.value", "Bananas")
      cy.get("#delete-food-button").click();
      cy.get("#food").should("not.contain.value", "Bananas");
    });

    it("should show food is required when pressing delete and no food selected", () => {
      mockDeleteFood();
      visitDailyStatsPage();

      cy.contains("Add Intake").click();
      cy.get("#delete-food-button").click();

      cy.get("#form-error-intake-form").should("contain", "Food is required");
    });

    it("should close add intake dialog on close click", () => {
      visitDailyStatsPage();

      cy.get("#add-intake-id").click();
      cy.get("#cancel-button").click();
      cy.get("#add-intake-id").should("exist");
    });

    it("should close edit intake dialog on close click", () => {
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitDailyStatsPage();

      cy.get("#edit-intake-button-0").click();
      cy.get("#cancel-button").click();
      cy.get("#edit-intake-button-0").should("exist");
    });
  });