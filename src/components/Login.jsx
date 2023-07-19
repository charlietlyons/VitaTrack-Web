import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import BackendClient from "../client/BackendClient";
import { Heading1 } from "./common/Headings";
import { StyledTextField } from "./common/Inputs";
import { StyledPaper } from "./common/Containers";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      BackendClient.login(username, password, setIsLoggedIn, setError);
    },
    [username, password, setIsLoggedIn]
  );

  const submitOnEnterHandler = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        submitHandler(e);
      }
    },
    [submitHandler]
  );

  useEffect(() => {
    BackendClient.verifyToken(localStorage.getItem("token"), setIsLoggedIn);
  }, [setIsLoggedIn]);

  return (
    <StyledPaper>
      { !isLoggedIn ? (
      <>
        <Heading1>Login</Heading1>
        <StyledTextField
          id="email"
          label="Email Address"
          onChange={usernameChangeHandler}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>
        <StyledTextField
          id="password"
          label="Password"
          type="password"
          onChange={passwordChangeHandler}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>
        <Button variant="contained" onClick={submitHandler}>
          Login
        </Button>
      </>
      ) : (
        <>
          <Heading1>Logged in</Heading1>
          <Button onClick={() => {
            localStorage.removeItem("token")
            navigate("/")
          }}>Logout</Button>
        </>
      )}
      {error ? <output>{error}</output> : <></>}
    </StyledPaper>
  )
};

export default Login;
