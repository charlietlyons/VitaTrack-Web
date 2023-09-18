import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodLog from "../../src/components/FoodLog/FoodLog";
import BackendClient from "../../src/client/BackendClient";

describe("FoodLog", () => {
  beforeEach(() => {
    clientSpy = jest.spyOn(BackendClient, "getIntakes");
  });

  it("should setIntakes if getIntakes is successful", async () => {
    clientSpy.mockImplementation((successHandler, failureHandler) => {
      successHandler([
        {
          name: "test",
          quantity: "test",
          calories: "test",
          protein: "test",
          carbs: "test",
          fat: "test",
        },
      ]);
    });
    render(<FoodLog />);

    const intakeElement = await screen.findByTestId("intake-0");
    expect(intakeElement).toBeInTheDocument();
  });

  it("should log error if getIntakes is unsuccessful", async () => {
    clientSpy.mockImplementation((successHandler, failureHandler) => {
      failureHandler("Something went wrong.");
    });

    render(<FoodLog />);

    const errorElement = await screen.findByTestId("error");

    expect(errorElement).toHaveTextContent("Something went wrong.");
  });
});
