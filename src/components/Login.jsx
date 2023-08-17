import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import BackendClient from "../client/BackendClient";
import { Heading1 } from "./common/Headings";
import { StyledTextField } from "./common/Inputs";
import { FormContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = authContext;

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      BackendClient.login(username, password, setIsLoggedIn, setError);
    },
    [username, password, setIsLoggedIn, setError]
  );


  const usernameChangeHandler = useCallback(
    (e) => {
      e.preventDefault();
      setUsername(e.target.value);
      if (e.keyCode === 13) {
        submitHandler();
      }
    },
    [username, setUsername, submitHandler]
  );

  const passwordChangeHandler = useCallback(
    (e) => {
      e.preventDefault();
      setPassword(e.target.value);
      if (e.keyCode === 13) {
        submitHandler();
      }
    },
    [password, setPassword, submitHandler]
  );

  const submitOnEnterHandler = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        submitHandler(e);
      }
    },
    [submitHandler]
  );

  return (
    <>
      {!isLoggedIn ? (
        <FormContainer
          title={!isLoggedIn ? <Heading1>Login</Heading1> : <></>}
          formFields={[
            <StyledTextField
              id="email"
              label="Email Address"
              onChange={usernameChangeHandler}
              onKeyDown={submitOnEnterHandler}
            ></StyledTextField>,
            <StyledTextField
              id="password"
              label="Password"
              type="password"
              onChange={passwordChangeHandler}
              onKeyDown={submitOnEnterHandler}
            ></StyledTextField>,
          ]}
          submitButton={
            <Button variant="contained" onClick={submitHandler}>
              Login
            </Button>
          }
          error={error}
        />
      ) : (
        <Navigate to="/vitatrack/daily" />
      )}
    </>
  );
};

export default Login;
