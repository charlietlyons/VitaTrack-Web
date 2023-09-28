import { render, within } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import IntakeDialog from "../../src/components/IntakeDialog/IntakeDialog";
import React from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import BackendClient from "../../src/client/BackendClient";
import "@testing-library/jest-dom";
import { fillAllFoodDialogInputsAndSubmit } from "./FoodDialog.spec";

describe("IntakeDialog", () => {
  let setShowDialogMock;
  let addIntakeMock;
  let getFoodOptionsMock;
  let refreshIntakesMock;

  beforeEach(() => {
    jest.resetAllMocks();
    setShowDialogMock = jest.fn();
    refreshIntakesMock = jest.fn();
    getFoodOptionsMock = jest
      .spyOn(BackendClient, "getFoodOptions")
      .mockImplementation(() => {
        return [
          {
            _id: "grapeId",
            name: "Grapes",
          },
          {
            _id: "orangeId",
            name: "Oranges",
          },
        ];
      });
  });

  it("should send addIntake request when submit is pressed", async () => {
    addIntakeMock = jest
      .fn()
      .mockImplementation((body, successHandler, failHandler) => {
        successHandler();
      });
    jest.spyOn(BackendClient, "addIntake").mockImplementation(addIntakeMock);

    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    setFoodValue("Grapes");
    setQuantityValue(1);
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(addIntakeMock).toHaveBeenCalledWith(
        {
          foodId: "grapeId",
          quantity: "1",
        },
        expect.any(Function),
        expect.any(Function)
      );
      expect(setShowDialogMock).toHaveBeenCalledWith(false);
    });
  });

  it("should not addIntake if formData is missing", async () => {
    await act(async () => {
      render(
        <IntakeDialog showDialog={true} setShowDialog={setShowDialogMock} />
      );
    });
    fireEvent.click(screen.getByText(/Submit/i));

    const errorElement = screen.getByText(/Food is required/i);

    expect(errorElement).toBeInTheDocument();
  });

  it("should set Food to empty if newValue is empty", async () => {
    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    setFoodValue("Grapes");
    setFoodValue("");

    const { input } = getAutocompleteInput("food-input");
    expect(input.value).toBe("");
  });

  it("should setError to Something went wrong if addIntake call errors", async () => {
    addIntakeMock = jest
      .fn()
      .mockImplementation((body, successHandler, failHandler) => {
        failHandler();
      });
    jest.spyOn(BackendClient, "addIntake").mockImplementation(addIntakeMock);

    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    setFoodValue("Grapes");
    setQuantityValue("1");
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(addIntakeMock).toHaveBeenCalledWith(
        {
          foodId: "grapeId",
          quantity: "1",
        },
        expect.any(Function),
        expect.any(Function)
      );
      expect(setShowDialogMock).not.toHaveBeenCalledWith(false);
    });
  });

  it("should display get food options for the food input", async () => {
    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    expect(getFoodOptionsMock).toHaveBeenCalled();
  });

  it("should show add food dialog if Add Food button pressed", async () => {
    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    const addFoodButton = screen.getByText(/Add Food/i);
    fireEvent.click(addFoodButton);

    const addFoodDialog = screen.getByLabelText(/Protein/i);

    expect(addFoodDialog).toBeInTheDocument();
  });

  it("should stop displaying when pressing Cancel", async () => {
    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });

  it("should set add food dialog to false and get data when ", async () => {
    addIntakeMock = jest
      .fn()
      .mockImplementation((body, successHandler, failHandler) => {
        successHandler();
      });
    jest.spyOn(BackendClient, "addIntake").mockImplementation(addIntakeMock);

    await act(async () => {
      render(
        <IntakeDialog
          showDialog={true}
          setShowDialog={setShowDialogMock}
          refreshIntakes={refreshIntakesMock}
        />
      );
    });

    const addFoodButton = await screen.findByText(/Add Food/i);
    fireEvent.click(addFoodButton);

    const submitButtonElement = await screen.findByRole("button", {
      name: /Add/i,
    });
    await fillAllFoodDialogInputsAndSubmit(submitButtonElement);
    await waitFor(() => {
      const proteinElement = screen.queryByLabelText(/Protein/i);
      expect(proteinElement).not.toBeInTheDocument();
    });
  });
});

function setQuantityValue(value) {
  const quantity = screen.getByLabelText(/Quantity/i);
  fireEvent.change(quantity, { target: { value: value } });
}

function setFoodValue(value) {
  const { autocompleteInput, input } = getAutocompleteInput("food-input");
  autocompleteInput.focus();
  fireEvent.change(input, { target: { value: value } });
  if (value !== "") {
    const option = screen.getByText(value);
    fireEvent.click(option);
  }
}

function getAutocompleteInput(autocompleteTestId) {
  const autocompleteInput = screen.getByTestId(autocompleteTestId);
  const input = within(autocompleteInput).getByRole("combobox");
  return { autocompleteInput, input };
}
