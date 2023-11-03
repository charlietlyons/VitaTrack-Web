import {
  mockGetFoodOptions,
  mockGetFirstIntakeById,
  mockGetSecondIntakeById,
  mockGetIntakes,
  mockVerifyToken,
  mockAddIntake,
  mockUpdateFood,
  mockAddFood,
  mockDeleteFood, 
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
  FOOD
} from "../../src/components/common/constants";

describe("Daily Stats Page", () => {
  beforeEach(() => {
    mockVerifyToken();
    mockGetIntakes();
    mockGetFoodOptions();
    mockAddIntake();
  });

  describe("Intake Dialog", () => {
    it("should display error if add intake fails", () => {
      cy.intercept("POST", "/intake", (req) => {
        req.destroy();
      })
      visitPage();

      cy.get("#add-intake-id").click();
      cy.get("#food").type("Bananas");
      cy.get("li").click();
      cy.get("#quantity").type(1);

      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Could not submit intake. Try again later.");
    });

    it("should display validation error if field empty", () => {
      visitPage();

      cy.get("#add-intake-id").click();

      cy.get("#add-button").click();

      cy.get("#form-error-intake-form").should("contain", "Food is required");
    });

    it("should add new intakes through dialog", () => {
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitPage();

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
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitPage();

      cy.contains("Daily Stats");

      cy.get("#edit-intake-button-0").click();

      cy.contains("Edit Intake");
      cy.get("#food").should("contain.value", "Grapes");
      cy.get("#quantity").should("contain.value", "10000");
      cy.get("#update-button").click();

      cy.get("#intake-0").should("contain", "Grapes");
    });

    it("should set error if cannot get intake", () => {
      cy.intercept(
        "GET",
        "/intake/someId",
        {
          statusCode: 500,
          body: {},
        }
      );
      visitPage();

      cy.get("#edit-intake-button-0").click();

      cy.get("#form-error-intake-form").should("contain",
        "Could not get intake. Try again later."
      );
    })

    it("should display error if can't delete food", () => {
      cy.intercept(
        "DELETE",
        "/food/*",
        (req) => { req.destroy() }
      );
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitPage();

      cy.get("#edit-intake-button-0").click();
      cy.get("#delete-food-button").click()
      cy.get("#form-error-intake-form").should("contain",
        "Could not delete food. Try again later."
      );
    });

    it("should delete food on delete click", () => {
      mockDeleteFood();
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitPage();

      cy.get("#edit-intake-button-1").click();
      cy.get("#food").should("contain.value", "Bananas")
      cy.get("#delete-food-button").click();
      cy.get("#food").should("not.contain.value", "Bananas");
    });

    it("should show food is required when pressing delete and no food selected", () => {
      mockDeleteFood();
      visitPage();

      cy.contains("Add Intake").click();
      cy.get("#delete-food-button").click();

      cy.get("#form-error-intake-form").should("contain", "Food is required");
    });

    it("should close add intake dialog on close click", () => {
      visitPage();

      cy.get("#add-intake-id").click();
      cy.get("#cancel-button").click();
      cy.get("#add-intake-id").should("exist");
    });

    it("should close edit intake dialog on close click", () => {
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
      visitPage();

      cy.get("#edit-intake-button-0").click();
      cy.get("#cancel-button").click();
      cy.get("#edit-intake-button-0").should("exist");
    });
  });

  describe("Food Dialog", () => {
    beforeEach(() => {
      mockGetFirstIntakeById();
      mockGetSecondIntakeById();
    })

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

    it("should update food data", () => {   
      mockUpdateFood();   
      visitPage();
      cy.get("#edit-intake-button-0").click();
      cy.get("#edit-food-button").click();
      cy.get(`#${FOOD_NAME}`).should("contain.value", "Grapes");
      cy.get("#quantity").should("contain.value", "10000");

      cy.get(`#${FOOD_NAME}`).clear().type("Apples");
      cy.get("#add-update-food-button").click();
      cy.get(`#${FOOD}`).should("contain.value", "Apples");
    });

    it("should add food data", () => {      
      mockAddFood();
      visitPage();
      cy.get("#add-intake-id").click();
      cy.get("#add-food-button").click();

      testOptions.forEach(testOption => {
        cy.get(`#${testOption.field}`).type(testOption.value);
      });

      cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
      cy.get("#add-update-food-button").click();
      cy.get("input[role='combobox']").type("Cucum");
      cy.get("li").click();
      cy.get("#food").should("contain.value", "Cucumbers");
    });

    it("should close on clicking close", () => {
      visitPage();
      cy.get("#add-intake-id").click();
      cy.get("#add-food-button").click();
      cy.get("#close-add-food-button").click();
      cy.get("#add-food-button").should("exist");
    })

    it("should set error if call fails to add food", () => {
      cy.intercept(
        "POST",
        "http://localhost:3000/food",
        {
          statusCode: 500,
          body: {},
        }
      );
      visitPage();

      cy.get("#add-intake-id").click();
      cy.get("#add-food-button").click();

      testOptions.forEach(testOption => {
        cy.get(`#${testOption.field}`).type(testOption.value);
      });

      cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
      cy.get("#add-update-food-button").click();
      cy.get("#form-error-add-food-form").should("contain", "Something went wrong");
    })

    it("should set error if call fails to update food", () => {
      cy.intercept(
        "POST",
        "/food?",
        {
          statusCode: 500,
          body: {},
        }
      );
      visitPage();

      cy.get("#edit-intake-button-0").click();
      cy.get("#edit-food-button").click();

      cy.get(`#${FOOD_NAME}`).clear().type("Cucumbers");
      cy.get("#add-update-food-button").click();
      cy.get("#form-error-add-food-form").should("contain", "Something went wrong");
    })

    it("should set error if input empty", () => {
      cy.intercept(
        "PATCH",
        "/food",
        {
          statusCode: 500,
          body: {},
        }
      );
      visitPage();

      cy.contains("Add Intake").click();
      cy.contains("Add Food").click();

      testOptions.forEach(testOption => {
        cy.get("#add-update-food-button").click();
        cy.get("#form-error-add-food-form").should("contain", testOption.error);
        cy.get(`#${testOption.field}`).type(testOption.value);
      });

      cy.get("#add-update-food-button").click();
      cy.get("#form-error-add-food-form").should("contain", "Something went wrong");
    })
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
