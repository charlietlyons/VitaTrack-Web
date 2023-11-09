import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DailyStats from "../../src/components/DailyStats";
import React from "react";
import "@testing-library/jest-dom";
import { MockAuthContextProvider } from "../context/MockAuthContext";
import BackendClient from "../../src/client/BackendClient";

describe("DailyStats", () => {
  beforeEach(() => {
    BackendClient.getIntakes = jest.fn().mockImplementation((success, fail) => {
      success([
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
  });

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

  it("should set intakes on page load", () => {
    act(() => {
      render(
        <MockAuthContextProvider isLoggedIn={true}>
          <DailyStats />
        </MockAuthContextProvider>
      );
    });

    const intakeElement = screen.getByTestId("intake-0");
    expect(intakeElement).toBeInTheDocument();
  });
});
