import React from "react";
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Layout from "../../src/components/Layout";

describe("Layout", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        );
    });
    
    it("should render sidebar with components if open is true", () => {
        const floatingButton = screen.getByTitle("sidebar-button");
        fireEvent.click(floatingButton);

        const loginButton = screen.queryByRole("button", { name: /Login/i });
        const registerButton = screen.queryByRole("button", { name: /Register/i });

        expect(loginButton).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
    });

    it("should render floating > button when open is false", () => {
        const loginButton = screen.queryByRole("button", { name: /Login/i });
        const registerButton = screen.queryByRole("button", { name: /Register/i });
        const floatingButton = screen.getByTitle("sidebar-button");

        expect(floatingButton).toBeInTheDocument();
        expect(loginButton).not.toBeInTheDocument();
        expect(registerButton).not.toBeInTheDocument();
    });
});