import { act } from "react-dom/test-utils";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import FoodDialog from "../../src/components/FoodDialog/FoodDialog";
import BackendClient from "../../src/client/BackendClient";
import AddFoodValidator from "../../src/validators/AddFoodValidator";
import { FOOD } from "../../src/components/common/constants";

describe("FoodDialog", () => {
  const testPayload = {
    name: "test",
    servingSize: "test",
    servingUnit: "test",
    calories: "test",
    protein: "test",
    carbs: "test",
    fat: "test",
    access: "test",
    description: "test",
    imageUrl: "test",
  };
  let clientSpy, addFoodCloseHandlerSpy;

  beforeEach(() => {
    clientSpy = jest.spyOn(BackendClient, "addFood");
    addFoodCloseHandlerSpy = jest.fn();
  });

  describe("when isUpdate is false", () => {
    it("should display error if any input is empty", async () => {
      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const [
        nameElement,
        servingSizeElement,
        servingUnitElement,
        caloriesElement,
        proteinElement,
        carbsElement,
        fatElement,
        accessElement,
        descriptionElement,
      ] = getFoodDialogInputs();
      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      fireEvent.click(submitButtonElement);
      await expectError("Name is required");

      fillInputAndSubmit(nameElement, submitButtonElement);
      await expectError("Serving Size is required");

      fillInputAndSubmit(servingSizeElement, submitButtonElement);
      await expectError("Serving Metric is required");

      fillInputAndSubmit(servingUnitElement, submitButtonElement);
      await expectError("Calories is required");

      fillInputAndSubmit(caloriesElement, submitButtonElement);
      await expectError("Protein is required");

      fillInputAndSubmit(proteinElement, submitButtonElement);
      await expectError("Carbs is required");

      fillInputAndSubmit(carbsElement, submitButtonElement);
      await expectError("Fat is required");

      fillInputAndSubmit(fatElement, submitButtonElement);
      await expectError("Access is required");

      // TODO: make these last two optional
      fillInputAndSubmit(accessElement, submitButtonElement);
      await expectError("Description is required");

      fillInputAndSubmit(descriptionElement, submitButtonElement);
      await expectError("Image URL is required");
    });

    it("should addFood if form data is valid", () => {
      const validatorSpy = jest
        .spyOn(AddFoodValidator, "validate")
        .mockReturnValueOnce(true);

      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      fillAllFoodDialogInputsAndSubmit(submitButtonElement);

      expect(clientSpy).toHaveBeenCalledWith(
        testPayload,
        expect.any(Function),
        expect.any(Function)
      );
      expect(validatorSpy).toHaveBeenCalledWith(
        testPayload,
        expect.any(Function)
      );
    });

    it("should setError to empty and send addFood request if inputs not empty", async () => {
      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );
      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      fireEvent.click(submitButtonElement);

      await expectError("Name is required");

      fillAllFoodDialogInputsAndSubmit(submitButtonElement);

      expectNoError();

      expect(clientSpy).toHaveBeenCalledWith(
        testPayload,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should setShowDialog to false if addFood call is successful", () => {
      clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
        successHandler();
      });

      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      fillAllFoodDialogInputsAndSubmit(submitButtonElement);

      expectNoError();
      expect(addFoodCloseHandlerSpy).toHaveBeenCalled();
      expect(clientSpy).toHaveBeenCalledWith(
        testPayload,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should setError to Something went wrong, if addFood call fails", async () => {
      clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
        failHandler("test");
      });

      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const servingUnitElement = screen.getByLabelText(/Serving Metric/i);
      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      expect(servingUnitElement).toBeInTheDocument();

      fillAllFoodDialogInputsAndSubmit(submitButtonElement);
      await expectError("Something went wrong");

      expect(clientSpy).toHaveBeenCalledWith(
        testPayload,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should stop displaying when close button pressed", () => {
      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const closeButtonElement = screen.getByRole("button", {
        name: /Close/i,
      });

      fireEvent.click(closeButtonElement);

      expect(addFoodCloseHandlerSpy).toHaveBeenCalled();
    });

    it("should stop displaying after add food call", async () => {
      clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
        successHandler();
      });

      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      await fillAllFoodDialogInputsAndSubmit(submitButtonElement);

      expect(addFoodCloseHandlerSpy).toHaveBeenCalled();
    });

    it("should displaying after add food call", () => {
      clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
        failHandler();
      });

      render(
        <FoodDialog
          showDialog={true}
          addFoodCloseHandler={addFoodCloseHandlerSpy}
        />
      );

      const submitButtonElement = screen.getByRole("button", {
        name: /Add/i,
      });

      fillAllFoodDialogInputsAndSubmit(submitButtonElement);

      expect(addFoodCloseHandlerSpy).not.toHaveBeenCalledWith(false);
    });
  });

  describe("when isUpdate is true", () => {
    let foodData = {
      name: "test",
      servingSize: "test",
      servingUnit: "test",
      calories: "test",
      protein: "test",
      carbs: "test",
      fat: "test",
      access: "test",
      description: "test",
      imageUrl: "test",
    };

    it("should patch food and if form data is valid and update successful", async () => {
      BackendClient.getFoodById = jest.fn().mockImplementationOnce((foodId) => {
        return testPayload;
      });

      BackendClient.update = jest.fn().mockImplementation(() => {
        return true;
      });

      await act(async () => {
        render(
          <FoodDialog
            showDialog={true}
            addFoodCloseHandler={addFoodCloseHandlerSpy}
            foodId="test"
            foodData={foodData}
          />
        );
      });

      const [
        nameElement,
        servingSizeElement,
        servingUnitElement,
        caloriesElement,
        proteinElement,
        carbsElement,
        fatElement,
        accessElement,
        descriptionElement,
        imageURLElement,
      ] = getFoodDialogInputs();

      expect(nameElement).toHaveValue(testPayload.name);
      expect(servingSizeElement).toHaveValue(testPayload.servingSize);
      expect(servingUnitElement).toHaveValue(testPayload.servingUnit);
      expect(caloriesElement).toHaveValue(testPayload.calories);
      expect(proteinElement).toHaveValue(testPayload.protein);
      expect(carbsElement).toHaveValue(testPayload.carbs);
      expect(fatElement).toHaveValue(testPayload.fat);
      expect(accessElement).toHaveValue(testPayload.access);
      expect(descriptionElement).toHaveValue(testPayload.description);
      expect(imageURLElement).toHaveValue(testPayload.imageUrl);

      await act(async () => {
        fireEvent.change(caloriesElement, { target: { value: "test2" } });
        fireEvent.click(
          screen.getByRole("button", {
            name: /Update/i,
          })
        );
      });

      const expectedPayload = {
        ...testPayload,
      };
      expectedPayload.calories = "test2";

      expect(BackendClient.update).toHaveBeenCalledWith(FOOD, expectedPayload);
      expect(addFoodCloseHandlerSpy).toHaveBeenCalled();
    });

    it("should setError to Something went wrong, if patchFood call fails", async () => {
      BackendClient.getFoodById = jest.fn().mockImplementationOnce((foodId) => {
        return testPayload;
      });

      BackendClient.update = jest.fn().mockImplementation(() => {
        return false;
      });

      await act(async () => {
        render(
          <FoodDialog
            showDialog={true}
            addFoodCloseHandler={addFoodCloseHandlerSpy}
            foodId="test"
            foodData={foodData}
          />
        );
      });

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", {
            name: /Update/i,
          })
        );
      });

      expect(BackendClient.update).toHaveBeenCalledWith(FOOD, testPayload);
      expect(addFoodCloseHandlerSpy).not.toHaveBeenCalled();
    });
  });
});

function fillInputAndSubmit(inputElement, submitButtonElement) {
  fillInput(inputElement);
  fireEvent.click(submitButtonElement);
}

async function expectError(error) {
  const errorElement = await screen.findByTestId("form-error");
  expect(errorElement).toHaveTextContent(error);
}

function expectNoError() {
  const errorElement = screen.queryByTestId("form-error");
  expect(errorElement).not.toBeInTheDocument();
}

function fillInput(inputElement) {
  fireEvent.change(inputElement, { target: { value: "test" } });
}

export async function fillAllFoodDialogInputsAndSubmit(submitButtonElement) {
  getFoodDialogInputs().forEach((input) => {
    fillInput(input);
  });
  fireEvent.click(submitButtonElement);
}

function getFoodDialogInputs() {
  const nameElement = screen.getByLabelText(/Name/i);
  const servingSizeElement = screen.getByLabelText(/Serving Size/i);
  const servingUnitElement = screen.getByLabelText(/Serving Metric/i);
  const caloriesElement = screen.getByLabelText(/Calories/i);
  const proteinElement = screen.getByLabelText(/Protein/i);
  const carbsElement = screen.getByLabelText(/Carbs/i);
  const fatElement = screen.getByLabelText(/Fat/i);
  const accessElement = screen.getByLabelText(/Access/i);
  const descriptionElement = screen.getByLabelText(/Description/i);
  const imageURLElement = screen.getByLabelText(/Image URL/i);

  return [
    nameElement,
    servingSizeElement,
    servingUnitElement,
    caloriesElement,
    proteinElement,
    carbsElement,
    fatElement,
    accessElement,
    descriptionElement,
    imageURLElement,
  ];
}
