import {
  visitDailyStatsPage,
  mockGetFoodOptions,
  mockGetIntakes,
  mockVerifyToken,
  mockGetFirstIntakeById,
  mockGetSecondIntakeById,
  mockAddIntake,
  mockUpdateFood,
  mockAddFood,
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
  IMAGE_URL,
  FOOD,
} from "../../src/components/common/constants";

const testOptions = [
  { field: FOOD_NAME, value: "Grapes", error: "Name is required" },
  { field: SERVING_SIZE, value: "Grapes", error: "Serving Size is required" },
  {
    field: SERVING_METRIC,
    value: "Grapes",
    error: "Serving Metric is required",
  },
  { field: CALORIES, value: "Grapes", error: "Calories is required" },
  { field: PROTEIN, value: "Grapes", error: "Protein is required" },
  { field: CARBS, value: "Grapes", error: "Carbs is required" },
  { field: FAT, value: "Grapes", error: "Fat is required" },
  { field: ACCESS, value: "Grapes", error: "Access is required" },
  { field: DESCRIPTION, value: "Grapes", error: "Description is required" },
  { field: IMAGE_URL, value: "Grapes", error: "Image URL is required" },
];

describe("Food Dialog", () => {
  beforeEach(() => {
    mockGetFirstIntakeById();
    mockGetSecondIntakeById();
    mockGetFoodOptions();
    mockVerifyToken();
    mockGetIntakes();
    mockAddIntake();
  });

  it("should update food data", () => {
    mockUpdateFood();
    visitDailyStatsPage();
    cy.get("#edit-intake-button-0").click();
    cy.wait("@getFoodOptions");
    cy.get(`#${FOOD}`).should("contain.value", "Grapes");
    cy.get("#edit-food-button").click();
    cy.get(`#${FOOD_NAME}`).should("contain.value", "Grapes");
    cy.get("#quantity").should("contain.value", "10000");
    cy.get(`#${FOOD_NAME}`).clear().type("Apples");
    cy.get("#add-update-food-button").click();
    cy.get(`#${FOOD}`).should("contain.value", "Apples");
  });

  it("should add food data", () => {
    mockAddFood();
    visitDailyStatsPage();
    cy.get("#add-intake-id").click();
    cy.get("#add-food-button").click();
    testOptions.forEach((testOption) => {
      cy.get(`#${testOption.field}`).type(testOption.value);
    });
    cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
    cy.get("#add-update-food-button").click();
    cy.get("input[role='combobox']").type("Cucum");
    cy.get("li").click();
    cy.get("#food").should("contain.value", "Cucumbers");
  });

  it("should close on clicking close", () => {
    visitDailyStatsPage();
    cy.get("#add-intake-id").click();
    cy.get("#add-food-button").click();
    cy.get("#close-add-food-button").click();
    cy.get("#add-food-button").should("exist");
  });

  it("should set error if call fails to add food", () => {
    cy.intercept("POST", "http://localhost:3000/food", {
      statusCode: 500,
      body: {},
    });
    visitDailyStatsPage();
    cy.get("#add-intake-id").click();
    cy.get("#add-food-button").click();
    testOptions.forEach((testOption) => {
      cy.get(`#${testOption.field}`).type(testOption.value);
    });
    cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
    cy.get("#add-update-food-button").click();
    cy.get("#form-error-add-food-form").should(
      "contain",
      "Something went wrong"
    );
  });

  it("should set error if call fails to update food", () => {
    cy.intercept("PATCH", "/food?", {
      statusCode: 500,
      body: {},
    });
    visitDailyStatsPage();
    cy.get("#edit-intake-button-0").click();
    cy.get("#edit-food-button").click();
    cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
    cy.get("#add-update-food-button").click();
    cy.get("#form-error-add-food-form").should(
      "contain",
      "Something went wrong"
    );
  });

  it("should set error if input empty", () => {
    visitDailyStatsPage();
    cy.contains("Add Intake").click();
    cy.contains("Add Food").click();
    testOptions.forEach((testOption) => {
      cy.get("#add-update-food-button").click();
      cy.get(`#form-error-add-food-form`).should("contain", testOption.error);
      cy.get(`#${testOption.field}`).type("value");
    });
  });
});
