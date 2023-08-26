import React, { useState } from "react";
import { AuthContext } from "../../src/context/AuthContext";

export function MockAuthContextProvider(props) {
  const { children, isLoggedIn } = props;
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedInState, setIsLoggedIn: setIsLoggedInState }}
    >
      {children}
    </AuthContext.Provider>
  );
}
