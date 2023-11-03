import { mockLogin, mockVerifyToken, mockForgetPasswordEmail } from "./TestUtils";

describe("Login Page", () => {
  beforeEach(() => {
    mockLogin();
  });

  it("should set error to Credential provided are invalid if credentials invalid", () => {
    cy.intercept("POST", "http://localhost:3000/verify-user", {
      statusCode: 401,
    });
    visitPageAndInputCredentials();
    cy.get("#login-submit").click();

    cy.get("#form-error-login-form").should(
      "contain",
      "Credentials provided are invalid."
    );
  });

  it("should login through form", () => {
    visitPageAndInputCredentials();
    cy.get("#login-submit").click();

    cy.contains("Daily Stats");
  });

  it("should login through form if pressing enter on input", () => {
    visitPageAndInputCredentials();
    cy.get("#password").type("{enter}");
    cy.contains("Daily Stats");
  });

  it("should set error if credentials invalid", () => {
    cy.intercept("POST", "http://localhost:3000/verify-user", {
      statusCode: 401,
    });
    visitPageAndInputCredentials();
    cy.get("#login-submit").click();

    cy.get("#form-error-login-form").should(
      "contain",
      "Credentials provided are invalid."
    );
  });

  it("should set error if backend fails", () => {
    cy.intercept("POST", "http://localhost:3000/verify-user", {
      statusCode: 500,
    });

    visitPageAndInputCredentials();
    cy.get("#login-submit").click();

    cy.get("#form-error-login-form").should(
      "contain",
      "There was an error communicating with the server."
    );
  });

  it("should redirect to daily stats if token provided", () => {
    mockVerifyToken();
    cy.visit("http://localhost:8080/vitatrack/login", {
      onBeforeLoad: (win) => {
        win.localStorage.setItem("token", "someToken");
      },
    });

    cy.contains("Daily Stats");
  });

  it("should show forget password dialog on click", () => {
    cy.visit("http://localhost:8080/vitatrack/login", {});

    cy.get("#forgot-password").click();
  });

  it("should set error if send forgot password fails", () => {
    cy.visit("http://localhost:8080/vitatrack/login", {});

    cy.get("#forgot-password").click();

    cy.get("#forgot-password-form").find("input").type("someemail.gmail.com")

    cy.get("#forgot-password-form").contains("Submit").click();
    cy.get("#form-error-forgot-password-form").should("contain.text", "An error occurred.");
  })

    it("should hide forgot password dialogue if send forgot password success", () => {
      mockForgetPasswordEmail();
      cy.visit("http://localhost:8080/vitatrack/login", {});

      cy.get("#forgot-password").click();

      cy.get("#forgot-password-form").find("input").type("someemail.gmail.com")

      cy.get("#forgot-password-form").contains("Submit").click();
      cy.get("#forgot-password-form").should("not.exist");
  })

  it("should hide forgot password dialogue if clicking cancel", () => {
    cy.visit("http://localhost:8080/vitatrack/login", {});

      cy.get("#forgot-password").click();
      cy.get("#forgot-password-form").contains("Cancel").click();
      cy.get("#forgot-password-form").should("not.exist");
  });
});

function visitPageAndInputCredentials() {
  cy.visit("http://localhost:8080/vitatrack/login");

  cy.get("#email").type("test");
  cy.get("#password").type("password");
}
