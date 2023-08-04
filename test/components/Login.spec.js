import { screen, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import Login from '../../src/components/Login';
import React from 'react';

describe('Login', () => {
    beforeEach(() => {
        render(<Login />);
    });

    it('should render login text and inputs', () => {        
        const loginHeaderElement = screen.getByRole('heading', {level: 1})
        const submitButtonElement = screen.getByRole('button', {
            name: /Login/i
        });
        const emailInputElement = screen.getByLabelText('Email Address');
        const passwordInputElement = screen.getByLabelText('Password');
        
        expect(loginHeaderElement).toHaveTextContent("Login");
        expect(submitButtonElement).toBeInTheDocument();
        expect(emailInputElement).toBeInTheDocument();
        expect(passwordInputElement).toBeInTheDocument();

    });

    it('should display Logged In component when isLoggedIn is true', () => {
        const emailInputElement = screen.getByLabelText('Email Address');
        const passwordInputElement = screen.getByLabelText('Password');
        const submitButtonElement = screen.getByRole('button', {
            name: /Login/i
        });

        // TODO: Change this so that it works with stub server then remove setTimeout
        emailInputElement.value = 'test';
        passwordInputElement.value = 'password';
        submitButtonElement.click();

        setTimeout(() => {
            const loggedInHeaderElement = screen.findByRole('heading', {level: 1});
            expect(loggedInHeaderElement).toHaveTextContent('Logged In');
        }, 2000);

        
    });
})