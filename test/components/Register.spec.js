import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Register from "../../src/components/Register";
import { BrowserRouter } from "react-router-dom";

describe("Register", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  });

  it("should render with proper inputs", () => {
    const registerHeaderElement = screen.getByRole("heading", {
      name: /Register/i,
    });
    const firstNameInputElement = screen.getByLabelText("First Name");
    const lastNameInputElement = screen.getByLabelText("Last Name");
    const emailInputElement = screen.getByLabelText("Email Address");
    const phoneInputElement = screen.getByLabelText("Phone");
    const passwordInputElement = screen.getByLabelText("Password");
    const passwordConfirmationInputElement =
      screen.getByLabelText("Confirm Password");
    const submitButtonElement = screen.getByRole("button", {
      name: /Register/i,
    });

    expect(registerHeaderElement).toHaveTextContent("Register");
    expect(firstNameInputElement).toBeInTheDocument();
    expect(lastNameInputElement).toBeInTheDocument();
    expect(emailInputElement).toBeInTheDocument();
    expect(phoneInputElement).toBeInTheDocument();
    expect(passwordInputElement).toBeInTheDocument();
    expect(passwordConfirmationInputElement).toBeInTheDocument();
    expect(submitButtonElement).toBeInTheDocument();
  });

  it("should display error when passwords do not match", async () => {
    fillForm({
      first: "test",
      last: "test",
      email: "test",
      phone: "test",
      password: "test",
      passwordConfirmation: "test2",
    });
    const errorElement = await screen.findByText("Passwords do not match");
    expect(errorElement).toBeInTheDocument();
  });

  it(`should display error when inputs are empty`, async () => {
    fillForm({
      first: "",
      last: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    });

    const errorElement = await screen.findByText("Form is incomplete");

    expect(errorElement).toBeInTheDocument();
  });

  it("should display error if trouble registering new account", async () => {
    fillForm({
      first: "test",
      last: "test",
      phone: "test",
      email: "test",
      password: "password",
      passwordConfirmation: "password",
    });

    const errorElement = await screen.findByText(
      "Registration failed. Email already in use."
    );
    expect(errorElement).toBeInTheDocument();
  });

  // TODO: Fix this test
  it("should redirect on submission ", async () => {
    fillForm({
      first: "test",
      last: "test",
      email: "new account",
      phone: "test",
      password: "password",
      passwordConfirmation: "password",
    });

    await waitFor(
      () => {
        const errorElement = screen.queryByText(
          "Registration failed. Email already in use."
        );

        expect(errorElement).not.toBeInTheDocument();
      },
      { interval: 2000 }
    );
  });
});

function fillForm(formValues) {
  const firstNameInputElement = screen.getByLabelText("First Name");
  const lastNameInputElement = screen.getByLabelText("Last Name");
  const emailInputElement = screen.getByLabelText("Email Address");
  const phoneInputElement = screen.getByLabelText("Phone");
  const passwordInputElement = screen.getByLabelText("Password");
  const passwordConfirmationInputElement =
    screen.getByLabelText("Confirm Password");
  const submitButtonElement = screen.getByRole("button", {
    name: /Register/i,
  });

  fireEvent.change(firstNameInputElement, {
    target: { value: formValues.first },
  });
  fireEvent.change(lastNameInputElement, {
    target: { value: formValues.last },
  });
  fireEvent.change(emailInputElement, {
    target: { value: formValues.email },
  });
  fireEvent.change(phoneInputElement, {
    target: { value: formValues.phone },
  });
  fireEvent.change(passwordInputElement, {
    target: {
      value: formValues.password,
    },
  });
  fireEvent.change(passwordConfirmationInputElement, {
    target: {
      value: formValues.passwordConfirmation,
    },
  });
  fireEvent.click(submitButtonElement);
}
