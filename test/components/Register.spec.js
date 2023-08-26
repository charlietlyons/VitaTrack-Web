import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Register from "../../src/components/Register";
import { BrowserRouter } from "react-router-dom";
import BackendClient from "../../src/client/BackendClient";

describe("Register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

  it("should display error if passwords do not match", async () => {
    fillForm({
      first: "firstName",
      last: "lastName",
      email: "emailAddress",
      phone: "somePhone",
      password: "passwords",
      passwordConfirmation: "password",
    });

    const errorElement = await screen.findByText("Passwords do not match");

    expect(errorElement).toBeInTheDocument();
  });

  it("should display error if trouble registering new account", async () => {
    // TODO: Fix this test
  });

  it("should send request to register and redirect on submission ", async () => {
    jest
      .spyOn(BackendClient, "register")
      .mockImplementation((body, callback) => {
        callback();
      });

    fillForm({
      first: "firstName",
      last: "lastName",
      email: "emailAddress",
      phone: "somePhone",
      password: "password",
      passwordConfirmation: "password",
    });

    expect(BackendClient.register).toHaveBeenCalledWith(
      {
        first: "firstName",
        last: "lastName",
        email: "emailAddress",
        phone: "somePhone",
        password: "password",
      },
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should submit on enter", async () => {
    jest
      .spyOn(BackendClient, "register")
      .mockImplementation((body, callback) => {
        callback();
      });

    fillForm(
      {
        first: "firstName",
        last: "lastName",
        email: "emailAddress",
        phone: "somePhone",
        password: "password",
        passwordConfirmation: "password",
      },
      () => {
        const passwordInputElement = screen.getByLabelText("Password");
        fireEvent.keyDown(passwordInputElement, { keyCode: 13 });
      }
    );

    expect(BackendClient.register).toHaveBeenCalledWith(
      {
        first: "firstName",
        last: "lastName",
        email: "emailAddress",
        phone: "somePhone",
        password: "password",
      },
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should not submit on different input", async () => {
    jest
      .spyOn(BackendClient, "register")
      .mockImplementation((body, callback) => {
        callback();
      });

    fillForm(
      {
        first: "firstName",
        last: "lastName",
        email: "emailAddress",
        phone: "somePhone",
        password: "password",
        passwordConfirmation: "password",
      },
      () => {
        const passwordInputElement = screen.getByLabelText("Password");
        fireEvent.keyDown(passwordInputElement, { keyCode: 17 });
      }
    );

    expect(BackendClient.register).not.toHaveBeenCalled();
  });
});

function fillForm(
  formValues,
  submitCallback = () => {
    const submitButtonElement = screen.getByRole("button", {
      name: /Register/i,
    });
    fireEvent.click(submitButtonElement);
  }
) {
  const firstNameInputElement = screen.getByLabelText("First Name");
  const lastNameInputElement = screen.getByLabelText("Last Name");
  const emailInputElement = screen.getByLabelText("Email Address");
  const phoneInputElement = screen.getByLabelText("Phone");
  const passwordInputElement = screen.getByLabelText("Password");
  const passwordConfirmationInputElement =
    screen.getByLabelText("Confirm Password");

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

  submitCallback();
}
