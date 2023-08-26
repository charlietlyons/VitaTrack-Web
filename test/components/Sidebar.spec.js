import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Sidebar from "../../src/components/Sidebar/Sidebar";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../../test/context/MockAuthContext";

describe("Sidebar", () => {
  beforeEach(() => {});

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

  it("should navigate to register page then login page when button are pressed", () => {
    render(
      <MockAuthContextProvider isLoggedIn={false}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </MockAuthContextProvider>
    );

    const registerButton = screen.queryByRole("button", {
      name: /Register/i,
    });

    fireEvent.click(registerButton);

    expect(window.location.pathname).toBe("/vitatrack/register");

    const loginButton = screen.queryByRole("button", { name: /Login/i });

    fireEvent.click(loginButton);

    expect(window.location.pathname).toBe("/vitatrack/login");
  });

  it("should navigate to account, daily, then login after corresponding buttons pressed", () => {
    render(
      <MockAuthContextProvider isLoggedIn={true}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </MockAuthContextProvider>
    );

    const accountButton = screen.queryByRole("button", {
      name: /Account/i,
    });
    fireEvent.click(accountButton);
    expect(window.location.pathname).toBe("/vitatrack/account");

    const dailyButton = screen.queryByRole("button", { name: /Daily/i });
    fireEvent.click(dailyButton);
    expect(window.location.pathname).toBe("/vitatrack/daily");

    const logoutButton = screen.queryByRole("button", { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(window.location.pathname).toBe("/vitatrack/login");
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
