import React from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from '../../src/components/Sidebar/Sidebar'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

describe('Sidebar', () => {
    // TODO: Write tests for Sidebar component

    beforeEach(() => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );
    });

    it('should render sidebar text and inputs', () => {
        const loginButton = screen.getByRole('button', { name: /Login/i });
        const registerButton = screen.getByRole('button', { name: /Register/i });

        expect(loginButton).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
    });
})