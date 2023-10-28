describe("Daily Stats Page", () => {
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

  it("should delete intake on delete click", () => {
    visitPage();

    cy.get("#delete-intake-button-0").click();

    cy.get("#intake-0").should("not.exist");
  });
});

function visitPage() {
  cy.visit("http://localhost:8080/vitatrack/daily", {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "someToken");
    },
  });
}
