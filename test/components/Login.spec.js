import { fireEvent, screen, render } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Login from "../../src/components/Login";
import React from "react";

describe("Login", () => {
  beforeEach(() => {
    render(<Login />);
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
    const emailInputElement = screen.getByLabelText("Email Address");
    const passwordInputElement = screen.getByLabelText("Password");
    const submitButtonElement = screen.getByRole("button", {
      name: /Login/i,
    });

    fireEvent.change(emailInputElement, { target: { value: "test" } });
    fireEvent.change(passwordInputElement, { target: { value: "password" } });
    fireEvent.click(submitButtonElement);

    const loggedInHeaderElement = await screen.findByRole("heading", {
      name: /Logged In/i,
    });

    expect(loggedInHeaderElement).toHaveTextContent("Logged in");
  });
});
