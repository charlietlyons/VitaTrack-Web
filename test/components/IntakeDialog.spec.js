import { render, within } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import IntakeDialog from "../../src/components/IntakeDialog/IntakeDialog";
import React from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import BackendClient from "../../src/client/BackendClient";
import "@testing-library/jest-dom";
import AddIntakeValidator from "../../src/validators/AddIntakeValidator";
import userEvent from "@testing-library/user-event";

describe("IntakeDialog", () => {
  let mockSetShowDialog, mockRefreshIntakes;

  beforeEach(() => {
    jest.resetAllMocks();

    mockSetShowDialog = jest.fn();
    mockRefreshIntakes = jest.fn();

    AddIntakeValidator.validate = jest.fn(() => {
      return true;
    });

    BackendClient.getFoodOptions = jest.fn().mockReturnValue([
      {
        name: "Grapes",
        _id: "test",
      },
    ]);

    BackendClient.getIntakeById = jest.fn(() => {
      return Promise.resolve({
        foodId: "test",
        name: "Grapes",
        quantity: 1,
        _id: "test",
      });
    });

    BackendClient.updateIntake = jest.fn(() => {
      return Promise.resolve({
        data: true,
      });
    });

    BackendClient.addIntake = jest.fn(() => {
      return Promise.resolve({
        data: true,
      });
    });
  });

  describe("Common", () => {
    it("should setFood and setQuantity", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        )
      );

      await act(async () => {
        setFoodValue("Grapes");
        setQuantityValue("1");
      });

      const { input } = getAutocompleteInput("food-input");
      expect(input.value).toBe("Grapes");
      const quantity = screen.getByLabelText(/Quantity/i);
      expect(quantity).toHaveValue(1);
    });

    it("should set food to empty string when newValue is blank", async () => {
      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
          />
        );
      });

      await act(async () => {
        
      });

      const { input } = getAutocompleteInput("food-input");
      expect(input.value).toBe("");
    });

    it("should set error if no food selected", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        )
      );

      await act(async () => {
        setQuantityValue("1");
        const submit = screen.getByText(/Submit/i);
        fireEvent.click(submit);
      });

      new Promise((resolve) => setTimeout(resolve, 10));
      const foodInput = screen.getByLabelText(/Food/i);
      expect(foodInput).toHaveValue("");
    });

    it("should getFoodOptions and setShowDialog if clicking Cancel", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        )
      );

      const cancel = screen.getByText(/Cancel/i);
      await act(async () => {
        fireEvent.click(cancel);
      });

      expect(BackendClient.getFoodOptions).toHaveBeenCalledTimes(1);
      expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    });

    it("should show the food dialog if clicking add food", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        )
      );

      const foodAdd = screen.getByText(/Add Food/i);
      fireEvent.click(foodAdd);

      const proteinInput = screen.getByLabelText(/Protein/i);
      expect(proteinInput).toBeInTheDocument();
    });

    it("should call setShowDialog to false if pressing cancel", async () => {
      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        );
      });

      await act(async () => {
        const cancel = screen.getByText(/Cancel/i);
        fireEvent.click(cancel);
      });
      expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    });

    it("should getFoodOptionsData and closeAddFood", async () => {
      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId={false}
          />
        );
      });

      await act(async () => {
        const foodAdd = screen.getByText(/Add Food/i);
        fireEvent.click(foodAdd);
      });

      await act(async () => {
        const close = screen.getByText(/Close/i);
        fireEvent.click(close);
      });

      await waitFor(() => {
        new Promise((resolve) => setTimeout(resolve, 10));
        const proteinInput = screen.queryByLabelText(/Protein/i);
        expect(proteinInput).not.toBeInTheDocument();
      });
    });
  });

  describe("Update Intake", () => {
    it("should set food and quantity values on inputs when dialog is opened and getIntakeById returns true", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        )
      );

      const { input } = getAutocompleteInput("food-input");
      expect(input.value).toBe("Grapes");
      const quantity = screen.getByLabelText(/Quantity/i);
      expect(quantity).toHaveValue(1);
    });

    it("should set error to could not get intake if getIntakeById returns false", async () => {
      BackendClient.getIntakeById = jest.fn().mockImplementation(() => {
        return false;
      });

      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        )
      );

      const error = screen.getByText(/Could not get intake. Try again later./i);
      expect(error).toBeInTheDocument();
    });

    it("should updateIntake if formData is valid, food data is provided.", async () => {
      BackendClient.getIntakeById = jest.fn(() => {
        return Promise.resolve({
          foodId: "test",
          name: "Grapes",
          quantity: 1,
          _id: "test",
        });
      });
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        )
      );

      await act(async () => {
        setQuantityValue(1);

        const submit = screen.getByText(/Update/i);
        fireEvent.click(submit);
      });

      await waitFor(() => {
        expect(BackendClient.updateIntake).toHaveBeenCalledTimes(1);
      });
    });

    it("should not updateIntake if formData is not valid", async () => {
      AddIntakeValidator.validate = jest.fn(() => {
        return false;
      });

      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        );
      });

      await act(async () => {
        const submit = screen.getByText(/Update/i);
        fireEvent.click(submit);
      });

      expect(BackendClient.updateIntake).toHaveBeenCalledTimes(0);
    });

    it("should setShowDialog to false if press cancel", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        )
      );

      await act(async () => {
        const cancel = screen.getByText(/Cancel/i);
        fireEvent.click(cancel);
      });

      expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    });

    it("should call refreshIntakes and setShowDialog if result of update is true ", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        )
      );

      await act(async () => {
        const submit = screen.getByText(/Update/i);
        fireEvent.click(submit);
      });

      expect(mockRefreshIntakes).toHaveBeenCalledTimes(1);
      expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    });

    it("should call setError with Could not submit intakes if result of update is false ", async () => {
      BackendClient.updateIntake = jest.fn(() => {
        return false;
      });

      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        );
      });

      await act(async () => {
        const submit = screen.getByText(/Update/i);
        fireEvent.click(submit);
      });

      const { input } = getAutocompleteInput("food-input");
      expect(input.value).toBe("Grapes");
      const quantity = screen.getByLabelText(/Quantity/i);
      expect(quantity).toHaveValue(1);

      await waitFor(() => {
        const error = screen.getByText(
          /Could not submit intake. Try again later./i
        );

        expect(error).toBeInTheDocument();
      });
    });

    it("should show update and cancel buttons if isUpdate", async () => {
      await act(async () => {
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
            intakeId="test"
          />
        );
      });

      const update = screen.getByText(/Update/i);
      expect(update).toBeInTheDocument();
      const cancel = screen.getByText(/Cancel/i);
      expect(cancel).toBeInTheDocument();
    });
  });

  describe("Add Intake", () => {
    it("should addIntake if formData is valid, food data is provided.", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
          />
        )
      );

      await act(async () => {
        setFoodValue("Grapes");
        setQuantityValue(1);

        const submit = screen.getByText(/Submit/i);
        fireEvent.click(submit);
      });

      await waitFor(() => {
        expect(BackendClient.addIntake).toHaveBeenCalledTimes(1);
      });
    });

    it("should addIntake if formData is valid, food data is provided.", async () => {
      await act(async () =>
        render(
          <IntakeDialog
            showDialog={true}
            setShowDialog={mockSetShowDialog}
            refreshIntakes={mockRefreshIntakes}
          />
        )
      );

      await act(async () => {
        setFoodValue("Grapes");
        setQuantityValue(1);

        const submit = screen.getByText(/Submit/i);
        fireEvent.click(submit);
      });

      await waitFor(() => {
        expect(BackendClient.addIntake).toHaveBeenCalledTimes(1);
      });
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
