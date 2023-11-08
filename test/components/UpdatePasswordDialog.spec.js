import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import BackendClient from "../../src/client/BackendClient";
import UpdatePasswordDialog from "../../src/components/dialogs/UpdatePasswordDialog/UpdatePasswordDialog";
import UpdatePasswordValidator from "../../src/validators/UpdatePasswordValidator";

describe("UpdatePasswordDialog", () => {
  it("should not attempt to update password and setError if validation is false", async () => {
    const setShowDialogMock = jest.fn();
    const setErrorMock = jest.fn();
    const updatePasswordMock = jest.fn();

    UpdatePasswordValidator.validate = jest
      .fn()
      .mockImplementation((form, setError) => {
        setError("Password is required.");
        return false;
      });
    BackendClient.updatePassword = updatePasswordMock;

    await act(async () => {
      render(
        <UpdatePasswordDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          setError={setErrorMock}
        />
      );
    });

    const submitButtonElement = screen.getByRole("button", {
      name: /Submit/i,
    });
    await act(async () => {
      fireEvent.click(submitButtonElement);
    });

    const errorElement = screen.getByText(/Password is required./i);

    expect(errorElement).toBeInTheDocument();
    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  it("should update password and close dialog if validation is true", async () => {
    const setShowDialogMock = jest.fn();
    const updatePasswordMock = jest.fn().mockImplementation(() => {
      return { status: 200 };
    });
    const setErrorMock = jest.fn();

    UpdatePasswordValidator.validate = jest
      .fn()
      .mockImplementation((form, setError) => {
        setError("");
        return true;
      });
    BackendClient.updatePassword = updatePasswordMock;

    act(() => {
      render(
        <UpdatePasswordDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          setError={setErrorMock}
        />
      );
    });

    const passwordInputElement = screen.getByTestId("password");
    const passwordConfirmationInputElement = screen.getByTestId(
      "passwordConfirmation"
    );
    const submitButtonElement = screen.getByRole("button", {
      name: /Submit/i,
    });

    fireEvent.change(passwordInputElement, { target: { value: "password" } });
    fireEvent.change(passwordConfirmationInputElement, {
      target: { value: "password" },
    });

    await act(async () => {
      fireEvent.click(submitButtonElement);
    });

    expect(updatePasswordMock).toHaveBeenCalled();
    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });

  it("should setError if returns false", async () => {
    const setShowDialogMock = jest.fn();
    const updatePasswordMock = jest.fn().mockImplementation(() => {
      return false;
    });
    const setErrorMock = jest.fn();

    UpdatePasswordValidator.validate = jest
      .fn()
      .mockImplementation((form, setError) => {
        return true;
      });
    BackendClient.updatePassword = updatePasswordMock;

    act(() => {
      render(
        <UpdatePasswordDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          setError={setErrorMock}
        />
      );
    });

    const passwordInputElement = screen.getByTestId("password");
    const passwordConfirmationInputElement = screen.getByTestId(
      "passwordConfirmation"
    );
    const submitButtonElement = screen.getByRole("button", {
      name: /Submit/i,
    });

    await act(async () => {
      fireEvent.change(passwordInputElement, {
        target: { value: "password" },
      });
      fireEvent.change(passwordConfirmationInputElement, {
        target: { value: "password" },
      });
      fireEvent.click(submitButtonElement);
    });

    const errorElement = screen.getByText(/An error occurred./i);

    expect(errorElement).toBeInTheDocument();
  });

  it("should close dialog if user click cancel", async () => {
    const setShowDialogMock = jest.fn();
    const setErrorMock = jest.fn();

    act(() => {
      render(
        <UpdatePasswordDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          setError={setErrorMock}
        />
      );
    });

    const cancelButtonElement = screen.getByRole("button", {
      name: /Cancel/i,
    });

    await act(async () => {
      fireEvent.click(cancelButtonElement);
    });
    expect(setShowDialogMock).toHaveBeenCalled();
  });
});
