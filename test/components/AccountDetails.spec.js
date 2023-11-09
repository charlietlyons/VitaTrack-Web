import AccountDetails from "../../src/components/AccountDetails";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../context/MockAuthContext";
import BackendClient from "../../src/client/BackendClient";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";

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
    act(() => {
      BackendClient.getAccountDetails = jest.fn().mockResolvedValue({
        email: "hey",
        firstName: "  ",
        lastName: "  ",
        phone: "  ",
      });

      render(
        <MockAuthContextProvider isLoggedIn={true}>
          <AccountDetails />
        </MockAuthContextProvider>
      );
    });

    await waitFor(() => {
      expect(BackendClient.getAccountDetails).toHaveBeenCalled();
    });

    const updatePasswordButton = await screen.getByRole("button", {
      name: "Change Password",
    });

    act(() => {
      updatePasswordButton.click();
    })
    
    const updatePasswordHeading = await screen.findByText(
      /Enter your new password/i
    );

    expect(updatePasswordHeading).toBeInTheDocument();
  });
});
