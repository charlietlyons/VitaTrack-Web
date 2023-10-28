describe("Common Functionality", () => {
  describe("Layout", () => {
    it("should display sidebar on click arrow", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {});

      cy.get("#sidebar-floating-button").click();

      cy.get("#sidebar-nav-list").should("be.visible");
    });

    it("should hide sidebar on click arrow", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {});

      cy.get("#sidebar-floating-button").click();
      cy.get("#sidebar-close").click();

      cy.get("#sidebar-nav-list").should("not.exist");
    });

    it("should redirect to register on click", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {});

      cy.get("#sidebar-floating-button").click();

      cy.get("#sidebar-nav-list").contains("Register").click();

      cy.get("h1").contains("Register");
    });

    it("should redirect to login on click", () => {
      cy.visit("http://localhost:8080/vitatrack/register", {});
      cy.get("#sidebar-floating-button").click();

      cy.get("#sidebar-nav-list").contains("Login").click();

      cy.get("h1").contains("Login");
    });

    it("should redirect to account details on click", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {
        onBeforeLoad: (win) => {
          win.localStorage.setItem("token", "someToken");
        },
      });

      cy.get("h1").contains("Daily Stats");

      cy.get("#sidebar-floating-button").click();

      cy.get("#sidebar-nav-list").contains("Account").click();

      cy.get("h3").contains("Account Details");
    });

    it("should redirect to login on log out", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {
        onBeforeLoad: (win) => {
          win.localStorage.setItem("token", "someToken");
        },
      });

      cy.get("h1").contains("Daily Stats");

      cy.get("#sidebar-floating-button").click();

      cy.get("#sidebar-nav-list").contains("Logout").click();

      cy.get("h1").contains("Login");
    });

    it("should redirect to login on log out", () => {
      cy.visit("http://localhost:8080/vitatrack/daily", {
        onBeforeLoad: (win) => {
          win.localStorage.setItem("token", "someToken");
        },
      });

      cy.get("#sidebar-floating-button").click();
      cy.get("#sidebar-nav-list").contains("Daily").click();

      cy.get("h1").contains("Daily Stats");
    });
  });
});
