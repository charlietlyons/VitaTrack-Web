import AccountDetails from "../../src/components/AccountDetails";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../context/MockAuthContext";

describe("AccountDetails", () => {
  it("should show login screen when not loggedIn", () => {
    render(
      <MockAuthContextProvider isLoggedIn={false}>
        <AccountDetails />
      </MockAuthContextProvider>
    );

    const loginElement = screen.getByRole("heading", { level: 1 });

    expect(loginElement).toHaveTextContent("Login");
  });

  it("should show account details if logged in", () => {
    render(
      <MockAuthContextProvider isLoggedIn={true}>
        <AccountDetails />
      </MockAuthContextProvider>
    );

    const detailsElement = screen.getByRole("heading", { level: 1 });

    expect(detailsElement).toHaveTextContent("Account Details");
  });
});
