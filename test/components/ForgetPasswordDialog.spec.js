import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordDialog from "../../src/components/dialogs/ForgotPasswordDialog/ForgotPasswordDialog";
import { act } from "react-dom/test-utils";
import BackendClient from "../../src/client/BackendClient";

describe("ForgotPasswordDialog", () => {
  let setShowDialogMock = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();
    await act(async () => {
      render(
        <ForgotPasswordDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
        />
      );
    });
  });

  it("should setShowDialog to false if response is 200", async () => {
    BackendClient.sendForgotPasswordEmail = jest
      .fn()
      .mockResolvedValue({ status: 200 });

    const emailInputElement = screen.getByLabelText(/Email/i);
    const submitButtonElement = screen.getByRole("button", {
      name: /Submit/i,
    });
    await act(async () => {
      fireEvent.change(emailInputElement, { target: { value: "test" } });
      fireEvent.click(submitButtonElement);
    });

    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });

  it("should setError to 'an error occurred' if response is false", () => {
    BackendClient.sendForgotPasswordEmail = jest.fn().mockResolvedValue(false);

    const emailInputElement = screen.getByLabelText(/Email/i);
    const submitButtonElement = screen.getByRole("button", {
      name: /Submit/i,
    });

    fireEvent.change(emailInputElement, { target: { value: "test" } });
    fireEvent.click(submitButtonElement);

    expect(setShowDialogMock).not.toHaveBeenCalled();
  });

  it("should close dialog if user click cancel", () => {
    const cancelButtonElement = screen.getByRole("button", {
      name: /Cancel/i,
    });

    fireEvent.click(cancelButtonElement);
    expect(setShowDialogMock).toHaveBeenCalled();
  });
});
