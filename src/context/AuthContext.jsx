import React, { createContext, useState, useEffect } from 'react';
import BackendClient from '../client/BackendClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        user,
        isLoggedIn,
        setUser,
        setIsLoggedIn
    }

    useEffect(() => {
        BackendClient.verifyToken(localStorage.getItem("token"), setIsLoggedIn);
    }, [setIsLoggedIn]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };