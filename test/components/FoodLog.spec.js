import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodLog from "../../src/components/FoodLog/FoodLog";
import userEvent from "@testing-library/user-event";
import BackendClient from "../../src/client/BackendClient";

describe("FoodLog", () => {
  let refreshIntakesMock, setErrorMock;

  beforeEach(() => {
    refreshIntakesMock = jest.fn();
    setErrorMock = jest.fn();
  });

  it("should show intakes if not error", async () => {
    render(
      <FoodLog
        intakes={[
          {
            name: "test",
            quantity: "test",
            calories: "test",
            protein: "test",
            carbs: "test",
            fat: "test",
          },
        ]}
        error={null}
        setError={setErrorMock}
        refreshIntakes={refreshIntakesMock}
      />
    );

    const intakeElement = await screen.findByTestId("intake-0");
    expect(intakeElement).toBeInTheDocument();
  });

  it("should show error if error", async () => {
    render(
      <FoodLog
        intakes={[]}
        error={"bad news chief"}
        setError={setErrorMock}
        refreshIntakes={refreshIntakesMock}
      />
    );

    const errorElement = await screen.findByTestId("error");

    expect(errorElement).toHaveTextContent("bad news chief");
  });

  it("should remove intake when delete is successful", async () => {
    const deleteMock = jest.fn().mockReturnValue(true);
    BackendClient.delete = deleteMock;

    render(
      <FoodLog
        intakes={[
          {
            name: "test",
            quantity: "test",
            calories: "test",
            protein: "test",
            carbs: "test",
            fat: "test",
          },
        ]}
        error={null}
        setError={setErrorMock}
        refreshIntakes={refreshIntakesMock}
      />
    );

    const deleteButton = await screen.findByTestId("intake-delete-0");
    await userEvent.click(deleteButton);

    expect(deleteMock).toHaveBeenCalled();
    expect(setErrorMock).not.toHaveBeenCalled();
  });

  it("should set error when delete is unsuccessful", async () => {
    const deleteMock = jest.fn().mockReturnValue(false);
    BackendClient.delete = deleteMock;

    render(
      <FoodLog
        intakes={[
          {
            name: "test",
            quantity: "test",
            calories: "test",
            protein: "test",
            carbs: "test",
            fat: "test",
          },
        ]}
        error={null}
        setError={setErrorMock}
        refreshIntakes={refreshIntakesMock}
      />
    );

    const deleteButton = await screen.findByTestId("intake-delete-0");
    await userEvent.click(deleteButton);

    expect(deleteMock).toHaveBeenCalled();
    expect(setErrorMock).toHaveBeenCalled();
  });

  it("should show update dialog when clicking pencil", async () => {
    render(
      <FoodLog
        intakes={[
          {
            _id: "test",
            name: "test",
            quantity: "test",
            calories: "test",
            protein: "test",
            carbs: "test",
            fat: "test",
          },
        ]}
        error={null}
        setError={setErrorMock}
        refreshIntakes={refreshIntakesMock}
      />
    );

    const editButton = await screen.findByTestId("intake-edit-0");
    await userEvent.click(editButton);

    const updateDialog = await screen.findByTestId("food-input");
    expect(updateDialog).toBeInTheDocument();
  });
});
