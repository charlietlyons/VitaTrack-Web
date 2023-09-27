import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodLog from "../../src/components/FoodLog/FoodLog";

describe("FoodLog", () => {
  it("should show intakes if not error", async () => {
    render(<FoodLog intakes={[{
          name: "test",
          quantity: "test",
          calories: "test",
          protein: "test",
          carbs: "test",
          fat: "test",
        }]} error={null}/>);

    const intakeElement = await screen.findByTestId("intake-0");
    expect(intakeElement).toBeInTheDocument();
  });

  it("should show error if error", async () => {
    render(<FoodLog intakes={[]} error={"bad news chief"}/>);

    const errorElement = await screen.findByTestId("error");

    expect(errorElement).toHaveTextContent("bad news chief");
  });
});
