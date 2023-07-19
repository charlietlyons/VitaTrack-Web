import React, { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import BackendClient from "../client/BackendClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

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

  return !isLoggedIn ? (
    <div>
      <TextField
        id="email"
        label="Email Address"
        onChange={usernameChangeHandler}
        onKeyDown={submitOnEnterHandler}
      ></TextField>
      <TextField
        id="password"
        label="Password"
        type="password"
        onChange={passwordChangeHandler}
        onKeyDown={submitOnEnterHandler}
      ></TextField>
      <Button variant="contained" onClick={submitHandler}>
        Login
      </Button>
      {error ? <output>{error}</output> : <></>}
    </div>
  ) : (
    <div>
      <h1>Logged in</h1>
    </div>
  );
};

export default Login;
