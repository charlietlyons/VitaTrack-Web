import { screen, render, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Login from "../../src/components/Login";
import React from "react";
import { MockAuthContextProvider } from "../../test/context/MockAuthContext";

describe("Login", () => {
  beforeEach(() => {
    render(<MockAuthContextProvider>
      <Login />
    </MockAuthContextProvider>);
  });

  it("should render login text and inputs", () => {
    const loginHeaderElement = screen.getByRole("heading", { level: 1 });
    const submitButtonElement = screen.getByRole("button", {
      name: /Login/i,
    });
    const emailInputElement = screen.getByLabelText("Email Address");
    const passwordInputElement = screen.getByLabelText("Password");

    expect(loginHeaderElement).toHaveTextContent("Login");
    expect(submitButtonElement).toBeInTheDocument();
    expect(emailInputElement).toBeInTheDocument();
    expect(passwordInputElement).toBeInTheDocument();
  });

  it("should display Logged In component when isLoggedIn is true", async () => {
    fillLoginForm();

    const loggedInHeaderElement = await screen.findByRole("heading", {
      name: /Logged In/i,
    });

    expect(loggedInHeaderElement).toHaveTextContent("Logged in");
  });
});

function fillLoginForm() {
    const emailElement = screen.getByLabelText("Email Address");
    const passwordElement = screen.getByLabelText("Password");
    const submitButtonElement = screen.getByRole("button", {
      name: /Login/i,
    });

    fireEvent.change(emailElement, { target: { value: "test" } });
    fireEvent.change(passwordElement, { target: { value: "password" } });
    fireEvent.click(submitButtonElement);
}
