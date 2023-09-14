import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import DailyStats from "../../src/components/DailyStats";
import React from "react";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../context/MockAuthContext";

describe("DailyStats", () => {
  it("should display login page if isLoggedIn is false", () => {
    render(
      <MockAuthContextProvider isLoggedIn={false}>
        <DailyStats />
      </MockAuthContextProvider>
    );

    const loginElement = screen.getByRole("heading", { level: 1 });

    expect(loginElement).toHaveTextContent("Login");
  });

  it("should display dailystats page if isLoggedIn is true", () => {
    render(
      <MockAuthContextProvider isLoggedIn={true}>
        <DailyStats />
      </MockAuthContextProvider>
    );

    const dailyElement = screen.getByRole("heading", { level: 1 });

    expect(dailyElement).toHaveTextContent("Daily Stats");
  });

  it("should display intake dialog if add intake button is press", () => {
    render(
      <MockAuthContextProvider isLoggedIn={true}>
        <DailyStats />
      </MockAuthContextProvider>
    );

    const addIntakeButton = screen.getByText(/Add Intake/i);
    fireEvent.click(addIntakeButton);

    const foodInput = screen.getByLabelText(/Food/i);
    expect(foodInput).toBeInTheDocument();
  });
});
