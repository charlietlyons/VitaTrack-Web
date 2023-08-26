import { screen, render, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Login from "../../src/components/Login";
import React from "react";
import { MockAuthContextProvider } from "../../test/context/MockAuthContext";
import BackendClient from "../../src/client/BackendClient";
import { BrowserRouter } from "react-router-dom";
import { waitFor } from "@testing-library/dom";

describe("Login", () => {
  describe("isLoggedIn is true", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      render(
        <MockAuthContextProvider isLoggedIn={false}>
          <Login />
        </MockAuthContextProvider>
      );
    });

    it("should render login text and inputs", () => {
      const loginHeaderElement = screen.getByRole("heading", { level: 1 });
      const submitButtonElement = screen.getByRole("button", {
        name: /Login/i,
      });
      const emailInputElement = screen.getByLabelText("Email Address");
      const passwordInputElement = screen.getByLabelText("Password");

      expect(loginHeaderElement).toHaveTextContent("Login");
      expect(submitButtonElement).toBeInTheDocument();
      expect(emailInputElement).toBeInTheDocument();
      expect(passwordInputElement).toBeInTheDocument();
    });

    it("should attempt login on submit", () => {
      const emailInputElement = screen.getByLabelText("Email Address");
      const passwordInputElement = screen.getByLabelText("Password");
      const submitButtonElement = screen.getByRole("button", {
        name: /Login/i,
      });

      const clientSpy = jest.spyOn(BackendClient, "login");

      fireEvent.change(emailInputElement, { target: { value: "test" } });
      fireEvent.change(passwordInputElement, { target: { value: "password" } });
      fireEvent.click(submitButtonElement);

      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it("should attempt to login if pressing enter in input box", () => {
      const emailInputElement = screen.getByLabelText("Email Address");
      const passwordInputElement = screen.getByLabelText("Password");

      const clientSpy = jest.spyOn(BackendClient, "login");

      fireEvent.change(emailInputElement, { target: { value: "test" } });
      fireEvent.change(passwordInputElement, { target: { value: "password" } });
      fireEvent.keyDown(emailInputElement, {
        key: "Enter",
        code: 13,
        charCode: 13,
      });

      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it("should attempt to login if pressing enter in input box", () => {
      const emailInputElement = screen.getByLabelText("Email Address");
      const passwordInputElement = screen.getByLabelText("Password");

      const clientSpy = jest.spyOn(BackendClient, "login");

      fireEvent.change(emailInputElement, { target: { value: "test" } });
      fireEvent.change(passwordInputElement, { target: { value: "password" } });
      fireEvent.keyDown(passwordInputElement, { keyCode: 13 });

      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it("should not attempt submit if keydown is not enter", () => {
      const emailInputElement = screen.getByLabelText("Email Address");
      const passwordInputElement = screen.getByLabelText("Password");

      const clientSpy = jest.spyOn(BackendClient, "login");

      fireEvent.change(emailInputElement, { target: { value: "test" } });
      fireEvent.change(passwordInputElement, { target: { value: "password" } });
      fireEvent.keyDown(passwordInputElement, { keyCode: 7 });
      fireEvent.keyDown(emailInputElement, { keyCode: 7 });

      expect(clientSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("isLoggedIn is false", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      render(
        <BrowserRouter>
          <MockAuthContextProvider isLoggedIn={true}>
            <Login />
          </MockAuthContextProvider>
        </BrowserRouter>
      );
    });
    it("should navigate to daily log when isLoggedIn", async () => {
      const emailInputElement = screen.queryByLabelText("Email Address");
      const passwordInputElement = screen.queryByLabelText("Password");

      expect(window.location.pathname).toBe("/vitatrack/daily");
      expect(emailInputElement).not.toBeInTheDocument();
      expect(passwordInputElement).not.toBeInTheDocument();
    });
  });
});
