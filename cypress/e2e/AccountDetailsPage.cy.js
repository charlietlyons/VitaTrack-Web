import { mockVerifyToken, mockAccountDetails } from "./TestUtils";

describe("Account Details Page", () => {
  beforeEach(() => {
    mockAccountDetails();
  });

  describe("Account Details", () => {
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

    it("should set error to could not retrieve if backend error thrown", () => {
      mockVerifyToken();
      cy.intercept("GET", "/account-details", {
        statusCode: 400,
      });

      visitPage();

      cy.get("#account-details-error").should("contain",
        "Could not retrieve account details."
      );
    });
  })
  

  describe("Update Password Dialog", () => {
    it("should hide dialog if change password successful", () => {
      cy.intercept("POST", "/update-password", (req) => {
        req.reply(200);
      });
      mockVerifyToken();
      visitPage();

      cy.get("#change-password-button").click();
      cy.get("#new-password").type("newPassword");
      cy.get("#confirm-password").type("newPassword");
      cy.get("#submit-password-button").click();

      cy.get("#new-password").should("not.exist");
    })

    it("should set error if change password unsuccessful", () => {
      mockVerifyToken();
      visitPage();

      cy.get("#change-password-button").click();
      cy.get("#new-password").type("newPassword");
      cy.get("#confirm-password").type("newPassword");
      cy.get("#submit-password-button").click();

      cy.get("#form-error-update-password-form").should("contain",
        "An error occurred."
      );
    })

    it("should hide on cancel click", () => {
      mockVerifyToken();
      visitPage();

      cy.get("#change-password-button").click();
      cy.get("#cancel-button").click();

      cy.get("#change-password-button").should("exist");
    })
  })
});

function visitPage() {
  cy.visit("http://localhost:8080/vitatrack/account", {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "someToken");
    },
  });
}
