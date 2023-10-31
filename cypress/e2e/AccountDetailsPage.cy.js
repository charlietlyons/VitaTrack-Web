import { mockVerifyToken, mockAccountDetails } from "./TestUtils";

describe("Account Details Page", () => {
  beforeEach(() => {
    mockAccountDetails();
  });

  it("should redirect to login if not logged in", () => {
    cy.visit("http://localhost:8080/vitatrack/account", {});

    cy.contains("Login");
    cy.contains("Forgot Password?");
  });

  it("should show page if logged in", () => {
    mockVerifyToken();
    visitPage();

    cy.contains("Account Details");
  });

  it("should show change password dialog on click", () => {
    mockVerifyToken();
    visitPage();

    cy.get("#change-password-button").click();

    cy.contains("Enter your new password.");
  });
});

function visitPage() {
  cy.visit("http://localhost:8080/vitatrack/account", {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "someToken");
    },
  });
}
