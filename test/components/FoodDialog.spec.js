import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import FoodDialog from "../../src/components/FoodDialog/FoodDialog";
import BackendClient from "../../src/client/BackendClient";
import AddFoodValidator from "../../src/validators/AddFoodValidator";

describe("FoodDialog", () => {
  const testPayload = {
    name: "test",
    servingSize: "test",
    servingMetric: "test",
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
      servingMetricElement,
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

    fillInputAndSubmit(servingMetricElement, submitButtonElement);
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

    const servingMetricElement = screen.getByLabelText(/Serving Metric/i);
    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    expect(servingMetricElement).toBeInTheDocument();

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
  const servingMetricElement = screen.getByLabelText(/Serving Metric/i);
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
    servingMetricElement,
    caloriesElement,
    proteinElement,
    carbsElement,
    fatElement,
    accessElement,
    descriptionElement,
    imageURLElement,
  ];
}
