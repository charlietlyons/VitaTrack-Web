import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodLog from "../../src/components/FoodLog/FoodLog";
import userEvent from "@testing-library/user-event";
import BackendClient from "../../src/client/BackendClient";

describe("FoodLog", () => {
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
      />
    );

    const intakeElement = await screen.findByTestId("intake-0");
    expect(intakeElement).toBeInTheDocument();
  });

  it("should show error if error", async () => {
    render(<FoodLog intakes={[]} error={"bad news chief"} />);

    const errorElement = await screen.findByTestId("error");

    expect(errorElement).toHaveTextContent("bad news chief");
  });

  it("should remove intake when delete is successful", async () => {
    const setErrorMock = jest.fn();

    const deleteIntakeMock = jest.fn().mockReturnValue(true);
    BackendClient.deleteIntake = deleteIntakeMock;

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
      />
    );

    const deleteButton = await screen.findByTestId("intake-delete-0");
    await userEvent.click(deleteButton);

    expect(deleteIntakeMock).toHaveBeenCalled();
    expect(setErrorMock).not.toHaveBeenCalled();
  });

  it("should set error when delete is unsuccessful", async () => {
    const setErrorMock = jest.fn();

    const deleteIntakeMock = jest.fn().mockReturnValue(false);
    BackendClient.deleteIntake = deleteIntakeMock;

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
      />
    );

    const deleteButton = await screen.findByTestId("intake-delete-0");
    await userEvent.click(deleteButton);

    expect(deleteIntakeMock).toHaveBeenCalled();
    expect(setErrorMock).toHaveBeenCalled();
  });
});
