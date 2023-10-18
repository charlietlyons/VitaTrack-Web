import AccountDetails from "../../src/components/AccountDetails";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../context/MockAuthContext";
import { act } from "react-dom/test-utils";

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

    const detailsElement = screen.getByRole("heading", { level: 3 });

    expect(detailsElement).toHaveTextContent("Account Details");
  });

  it("should show update password dialog when change password button is clicked", async () => {
    await act(async () => {
      render(
        <MockAuthContextProvider isLoggedIn={true}>
          <AccountDetails />
        </MockAuthContextProvider>
      );
    });

    const updatePasswordButton = screen.getByRole("button", {
      name: "Change Password",
    });

    updatePasswordButton.click();

    const updatePasswordHeading = await screen.findByText(
      /Enter your new password/i
    );

    expect(updatePasswordHeading).toBeInTheDocument();
  });
});
