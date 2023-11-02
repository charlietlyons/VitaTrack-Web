describe("Register Page", () => {
  it("should submit and redirect to Login", () => {
    cy.intercept("POST", "http://localhost:3000/register-user", {
      statusCode: 200,
    });
    visitPageAndInputForm([]);
    cy.get("#submit").click();

    cy.contains("Login");
  });

  it("should submit on enter", () => {
    cy.intercept("POST", "http://localhost:3000/register-user", {
      statusCode: 200,
    });
    visitPageAndInputForm([]);
    cy.get("#password-confirmation").type("{enter}");

    cy.contains("Login");
  });

  it("set error to passwords don't match", () => {
    visitPageAndInputForm();
    cy.get("#password-confirmation").type("MOREPASSWORD");
    cy.get("#submit").click();

    cy.contains("Register");
    cy.get("#form-error-register-form").should("contain.text", "Passwords do not match");
  });

  [
    {
      fieldId: "firstname",
      value: "John",
    },
    {
      fieldId: "lastname",
      value: "Doe",
    },
    {
      fieldId: "password",
      value: "password",
    },
    {
      fieldId: "password-confirmation",
      value: "password",
    },
    {
      fieldId: "phone",
      value: "1234567890",
    },
    {
      fieldId: "email",
      value: "john.doe@gmail",
    },
  ].forEach((field) => {
    it(`should show Form is incomplete if ${field.fieldId} is incomplete`, () => {
      visitPageAndInputForm([field.fieldId]);
      cy.get("#submit").click();

      cy.contains("Register");
      cy.get("#form-error-register-form").should("contain.text", "Form is incomplete");
    });
  });
});

function visitPageAndInputForm(exclusions) {
  function fillOrExclude(fieldId, value) {
    if (exclusions && exclusions.includes(fieldId)) {
      return;
    } else {
      cy.get(`#${fieldId}`).type(value);
    }
  }

  // TODO: make exclusions optional when moving to typescript
  cy.visit("http://localhost:8080/vitatrack/register");

  fillOrExclude("firstname", "John");
  fillOrExclude("lastname", "Doe");
  fillOrExclude("password", "password");
  fillOrExclude("password-confirmation", "password");
  fillOrExclude("phone", "1234567890");
  fillOrExclude("email", "john.doe@gmail");
}
