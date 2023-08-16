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
});
