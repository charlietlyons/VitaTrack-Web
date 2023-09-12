import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import BackendClient from "../client/BackendClient";
import { Heading1 } from "./common/Headings";
import { StyledTextField } from "./common/Inputs";
import { FormContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = authContext;

  const submitHandler = useCallback(() => {
    BackendClient.login(email, password, setIsLoggedIn, setError);
  }, [email, password, setIsLoggedIn, setError]);

  const enterToSubmitHandler = useCallback((e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  });

  const emailChangeHandler = useCallback(
    (e) => {
      e.preventDefault();
      setEmail(e.target.value);
    },
    [email, setEmail]
  );

  const passwordChangeHandler = useCallback(
    (e) => {
      e.preventDefault();
      setPassword(e.target.value);
    },
    [password, setPassword]
  );

  return (
    <>
      {!isLoggedIn ? (
        <FormContainer
          title={!isLoggedIn && <Heading1>Login</Heading1>}
          formFields={[
            <StyledTextField
              id="email"
              label="Email Address"
              onKeyDown={enterToSubmitHandler}
              onChange={emailChangeHandler}
            ></StyledTextField>,
            <StyledTextField
              id="password"
              label="Password"
              type="password"
              onKeyDown={enterToSubmitHandler}
              onChange={passwordChangeHandler}
            ></StyledTextField>,
          ]}
          buttons={[
            <Button variant="contained" onClick={submitHandler}>
              Login
            </Button>,
          ]}
          error={error}
        />
      ) : (
        <Navigate to="/vitatrack/daily" />
      )}
    </>
  );
};

export default Login;
