import { render, within } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import IntakeDialog from "../../src/components/IntakeDialog/IntakeDialog";
import React from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import BackendClient from "../../src/client/BackendClient";
import "@testing-library/jest-dom";

describe("IntakeDialog", () => {
  let setShowDialogMock;
  let addIntakeMock;

  beforeEach(() => {
    jest.resetAllMocks();
    setShowDialogMock = jest.fn();
  });

  it("should send addIntake request when submit is pressed", async () => {
    addIntakeMock = jest
      .fn()
      .mockImplementation((body, successHandler, failHandler) => {
        successHandler();
      });
    jest.spyOn(BackendClient, "addIntake").mockImplementation(addIntakeMock);

    render(
      <IntakeDialog showDialog={true} setShowDialog={setShowDialogMock} />
    );

    const autocompleteInput = screen.getByTestId("food-input");
    const input = within(autocompleteInput).getByRole("combobox");
    autocompleteInput.focus();
    fireEvent.change(input, { target: { value: "Banana" } });
    const option = screen.getByText("Banana");
    fireEvent.click(option);

    const quantity = screen.getByLabelText(/Quantity/i);
    fireEvent.change(quantity, { target: { value: "1" } });

    const submit = screen.getByText(/Submit/i);
    fireEvent.click(submit);

    await waitFor(() => {
      expect(addIntakeMock).toHaveBeenCalledWith(
        {
          foodId: "Banana",
          quantity: "1",
        },
        expect.any(Function),
        expect.any(Function)
      );
      expect(setShowDialogMock).toHaveBeenCalledWith(false);
    });
  });

  it("should setError to Something went wrong if addIntake call errors", async () => {
    addIntakeMock = jest
      .fn()
      .mockImplementation((body, successHandler, failHandler) => {
        failHandler();
      });
    jest.spyOn(BackendClient, "addIntake").mockImplementation(addIntakeMock);

    render(
      <IntakeDialog showDialog={true} setShowDialog={setShowDialogMock} />
    );

    const autocompleteInput = screen.getByTestId("food-input");
    const input = within(autocompleteInput).getByRole("combobox");
    autocompleteInput.focus();
    fireEvent.change(input, { target: { value: "Banana" } });
    const option = screen.getByText("Banana");
    fireEvent.click(option);

    const quantity = screen.getByLabelText(/Quantity/i);
    fireEvent.change(quantity, { target: { value: "1" } });

    const submit = screen.getByText(/Submit/i);
    fireEvent.click(submit);

    await waitFor(() => {
      expect(addIntakeMock).toHaveBeenCalledWith(
        {
          foodId: "Banana",
          quantity: "1",
        },
        expect.any(Function),
        expect.any(Function)
      );
      expect(setShowDialogMock).not.toHaveBeenCalledWith(false);
    });
  });

  it("should show add food dialog if Add Food button pressed", () => {
    render(
      <IntakeDialog showDialog={true} setShowDialog={setShowDialogMock} />
    );

    const addFoodButton = screen.getByText(/Add Food/i);
    fireEvent.click(addFoodButton);

    const addFoodDialog = screen.getByLabelText(/Protein/i);

    expect(addFoodDialog).toBeInTheDocument();
  });

  it("should stop displaying when pressing Cancel", () => {
    render(
      <IntakeDialog showDialog={true} setShowDialog={setShowDialogMock} />
    );

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });
});
