import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import FoodDialog from "../../src/components/FoodDialog/FoodDialog";

describe("FoodDialog", () => {
  it("should display error if any input is empty", () => {
    render(<FoodDialog />);

    const loginElement = screen.getByRole("heading", { level: 1 });

    expect(loginElement).toHaveTextContent("Login");
  });

    it("should setError to empty and send addFood request if inputs not empty", () => {});

    it("should setShowDialog to false if addFood call is successful", () => {});

    it("should setError to Something went wrong, if addFood call fails", () => {});

    it("should stop displaying when close button pressed", () => {});

    it("should set errors if a certain input is empty", () => {});
});
