import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "../../src/components/Sidebar/Sidebar";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../../test/context/MockAuthContext";

describe("Sidebar", () => {
  it("should render registration and login buttons on sidebar if isLoggedIn is false", () => {
    render(
      <MockAuthContextProvider isLoggedIn={false}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </MockAuthContextProvider>
    );

    const {
      loginButton,
      registerButton,
      logoutButton,
      accountButton,
      dailyButton,
    } = getSidebarButtons();

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(logoutButton).not.toBeInTheDocument();
    expect(accountButton).not.toBeInTheDocument();
    expect(dailyButton).not.toBeInTheDocument();
  });

  it("should render logout and account buttons on sidebar if isLoggedIn is true", () => {
    render(
      <MockAuthContextProvider isLoggedIn={true}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </MockAuthContextProvider>
    );

    const {
      loginButton,
      registerButton,
      logoutButton,
      accountButton,
      dailyButton,
    } = getSidebarButtons();

    expect(loginButton).not.toBeInTheDocument();
    expect(registerButton).not.toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(accountButton).toBeInTheDocument();
    expect(dailyButton).toBeInTheDocument();
  });
});

function getSidebarButtons() {
  return {
    loginButton: screen.queryByRole("button", { name: /Login/i }),
    registerButton: screen.queryByRole("button", { name: /Register/i }),
    logoutButton: screen.queryByRole("button", { name: /Logout/i }),
    accountButton: screen.queryByRole("button", { name: /Account/i }),
    dailyButton: screen.queryByRole("button", { name: /Daily/i }),
  };
}
