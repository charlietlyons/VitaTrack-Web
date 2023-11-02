import {
  mockGetFoodOptions,
  mockGetIntakeById,
  mockGetIntakes,
  mockVerifyToken,
  mockAddIntake,
} from "./TestUtils";
import { 
  FOOD_NAME, 
  SERVING_SIZE,
  SERVING_METRIC, 
  CALORIES,
  PROTEIN,
  CARBS,
  FAT,
  ACCESS,
  DESCRIPTION,
  IMAGE_URL
} from "../../src/components/common/constants";

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

  describe("Food Dialog", () => {
    it("should set error if input empty", () => {
      const testOptions = [
        { field: FOOD_NAME, value: "Grapes", error: "Name is required" },
        { field: SERVING_SIZE, value: "Grapes", error: "Serving Size is required" },
        { field: SERVING_METRIC, value: "Grapes",error: "Serving Metric is required" },
        { field: CALORIES, value: "Grapes",error: "Calories is required" },
        { field: PROTEIN, value: "Grapes", error: "Protein is required" },
        { field: CARBS, value: "Grapes", error: "Carbs is required" },
        { field: FAT, value: "Grapes", error: "Fat is required" },
        { field: ACCESS, value: "Grapes", error: "Access is required" },
        { field: DESCRIPTION, value: "Grapes", error: "Description is required" },
        { field: IMAGE_URL, value: "Grapes", error: "Image URL is required" },
      ];

      visitPage();

      cy.contains("Add Intake").click();
      cy.contains("Add Food").click();

      testOptions.forEach(testOption => {
        cy.get("#add-food-button").click();
        cy.get("#form-error-add-food-form").should("contain", testOption.error);
        cy.get(`#${testOption.field}`).type(testOption.value);
      });

      cy.get("#add-food-button").click();
      cy.get("#form-error-add-food-form").should("contain", "Something went wrong");
    })

    it("should open food dialog with prefilled data if updating food", () => {
      // TODO: Implement
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
