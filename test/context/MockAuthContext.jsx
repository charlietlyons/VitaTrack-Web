import React, { useState } from "react";
import { AuthContext } from "../../src/context/AuthContext";

export function MockAuthContextProvider({ children, isLoggedIn=false }) {
    const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);

    return <AuthContext.Provider value={{ isLoggedIn: isLoggedInState, setIsLoggedIn: setIsLoggedInState}}>{children}</AuthContext.Provider>;
}