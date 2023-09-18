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
  let clientSpy;

  beforeEach(() => {
    clientSpy = jest.spyOn(BackendClient, "addFood");
  });

  it("should display error if any input is empty", () => {
    render(<FoodDialog showDialog={true} />);

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
    ] = getInputs();
    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fireEvent.click(submitButtonElement);
    expectError("Name is required");

    fillInputAndSubmit(nameElement, submitButtonElement);
    expectError("Serving Size is required");

    fillInputAndSubmit(servingSizeElement, submitButtonElement);
    expectError("Serving Metric is required");

    fillInputAndSubmit(servingMetricElement, submitButtonElement);
    expectError("Calories is required");

    fillInputAndSubmit(caloriesElement, submitButtonElement);
    expectError("Protein is required");

    fillInputAndSubmit(proteinElement, submitButtonElement);
    expectError("Carbs is required");

    fillInputAndSubmit(carbsElement, submitButtonElement);
    expectError("Fat is required");

    fillInputAndSubmit(fatElement, submitButtonElement);
    expectError("Access is required");

    // TODO: make these last two optional
    fillInputAndSubmit(accessElement, submitButtonElement);
    expectError("Description is required");

    fillInputAndSubmit(descriptionElement, submitButtonElement);
    expectError("Image URL is required");
  });

  it("should addFood if form data is valid", () => {
    const validatorSpy = jest
      .spyOn(AddFoodValidator, "validate")
      .mockReturnValueOnce(true);

    render(<FoodDialog showDialog={true} />);

    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fillAllInputsAndSubmit(submitButtonElement);

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
    render(<FoodDialog showDialog={true} />);
    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fireEvent.click(submitButtonElement);

    expectError("Name is required");

    fillAllInputsAndSubmit(submitButtonElement);

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

    const setShowDialogMock = jest.fn();
    render(<FoodDialog showDialog={true} setShowDialog={setShowDialogMock} />);

    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fillAllInputsAndSubmit(submitButtonElement);

    expectNoError();
    expect(setShowDialogMock).toHaveBeenCalledWith(false);
    expect(clientSpy).toHaveBeenCalledWith(
      testPayload,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should setError to Something went wrong, if addFood call fails", () => {
    clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
      failHandler("test");
    });

    render(<FoodDialog showDialog={true} />);

    const servingMetricElement = screen.getByLabelText(/Serving Metric/i);
    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    expect(servingMetricElement).toBeInTheDocument();

    fillAllInputsAndSubmit(submitButtonElement);
    expectError("Something went wrong");

    expect(clientSpy).toHaveBeenCalledWith(
      testPayload,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should stop displaying when close button pressed", () => {
    const setShowDialogMock = jest.fn();
    render(<FoodDialog showDialog={true} setShowDialog={setShowDialogMock} />);

    const closeButtonElement = screen.getByRole("button", {
      name: /Close/i,
    });

    fireEvent.click(closeButtonElement);

    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });

  it("should stop displaying after add food call", () => {
    clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
      successHandler();
    });

    const setShowDialogMock = jest.fn();
    render(<FoodDialog showDialog={true} setShowDialog={setShowDialogMock} />);

    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fillAllInputsAndSubmit(submitButtonElement);

    expect(setShowDialogMock).toHaveBeenCalledWith(false);
  });

  it("should displaying after add food call", () => {
    clientSpy.mockImplementationOnce((state, successHandler, failHandler) => {
      failHandler();
    });

    const setShowDialogMock = jest.fn();
    render(<FoodDialog showDialog={true} setShowDialog={setShowDialogMock} />);

    const submitButtonElement = screen.getByRole("button", {
      name: /Add/i,
    });

    fillAllInputsAndSubmit(submitButtonElement);

    expect(setShowDialogMock).not.toHaveBeenCalledWith(false);
  });
});

function fillInputAndSubmit(inputElement, submitButtonElement) {
  fillInput(inputElement);
  fireEvent.click(submitButtonElement);
}

async function expectError(error) {
  const errorElement = await screen.findByTestId("form-error");
  expect(errorElement).not.toHaveTextContent(error);
}

function expectNoError() {
  const errorElement = screen.queryByTestId("form-error");
  expect(errorElement).not.toBeInTheDocument();
}

function fillInput(inputElement) {
  fireEvent.change(inputElement, { target: { value: "test" } });
}

function fillAllInputsAndSubmit(submitButtonElement) {
  getInputs().forEach((input) => {
    fillInput(input);
  });
  fireEvent.click(submitButtonElement);
}

function getInputs() {
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
