import React from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from '../../src/components/Sidebar/Sidebar'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { MockAuthContextProvider } from '../../test/context/MockAuthContext'

describe('Sidebar', () => {
    it('should render registration and login buttons on sidebar if isLoggedIn is false', () => {
        render(
            <MockAuthContextProvider isLoggedIn={false}>
                <BrowserRouter>    
                    <Sidebar />
                </BrowserRouter>
            </MockAuthContextProvider>
        );

        const loginButton = screen.getByRole('button', { name: /Login/i });
        const registerButton = screen.getByRole('button', { name: /Register/i });
        const logoutButton = screen.queryByRole('button', { name: /Logout/i });
        const accountButton = screen.queryByRole('button', { name: /Account/i });

        expect(loginButton).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
        expect(logoutButton).not.toBeInTheDocument();
        expect(accountButton).not.toBeInTheDocument();
    });

    it('should render logout and account buttons on sidebar if isLoggedIn is true', () => {
        render(
            <MockAuthContextProvider isLoggedIn={true}>
                <BrowserRouter>    
                    <Sidebar />
                </BrowserRouter>
            </MockAuthContextProvider>
        );

        const loginButton = screen.queryByRole('button', { name: /Login/i });
        const registerButton = screen.queryByRole('button', { name: /Register/i });
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        const accountButton = screen.getByRole('button', { name: /Account/i });

        expect(loginButton).not.toBeInTheDocument();
        expect(registerButton).not.toBeInTheDocument();
        expect(logoutButton).toBeInTheDocument();
        expect(accountButton).toBeInTheDocument();
    });
})