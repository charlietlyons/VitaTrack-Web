import { render, within } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import IntakeDialog from "../../src/components/dialogs/IntakeDialog/IntakeDialog";
import React from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import BackendClient from "../../src/client/BackendClient";
import "@testing-library/jest-dom";
import AddIntakeValidator from "../../src/validators/AddIntakeValidator";

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
      {
        name: "Apple",
        _id: "test2",
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

    BackendClient.update = jest.fn(() => {
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
    // TODO: replace async react functionality with Cypress tests because this autocomplete stuff is irritating
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

      const quantity = screen.getByLabelText(/Quantity/i);

      await act(async () => {
        fireEvent.change(quantity, { target: { value: 1 } });
        fireEvent.keyPress(quantity, { key: "Enter", code: 13 });
      });

      expect(quantity).toHaveValue(1);
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

    it("should update Intake if formData is valid, food data is provided.", async () => {
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
        expect(BackendClient.update).toHaveBeenCalledTimes(1);
      });
    });

    it("should not update Intake if formData is not valid", async () => {
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

      expect(BackendClient.update).toHaveBeenCalledTimes(0);
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
      BackendClient.update = jest.fn(() => {
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
});

function setQuantityValue(value) {
  const quantity = screen.getByLabelText(/Quantity/i);
  fireEvent.change(quantity, { target: { value: value } });
}

function getAutocompleteInput(autocompleteTestId) {
  const autocompleteInput = screen.getByTestId(autocompleteTestId);
  const input = within(autocompleteInput).getByRole("combobox");
  return { autocompleteInput, input };
}
