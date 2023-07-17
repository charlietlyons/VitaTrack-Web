import React, { useCallback, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Button } from "@mui/material";
import { Heading1 } from "./common/Headings";
import { StyledTextField } from "./common/Inputs";
import RegisterFormReducer from "../reducers/RegisterFormReducer";
import BackendClient from "../client/BackendClient";

import {
  SET_FIRST,
  SET_LAST,
  SET_EMAIL,
  SET_PASSWORD,
  SET_CONFIRM_PASSWORD,
  SET_PHONE,
} from "../components/common/constants";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(RegisterFormReducer, {
    first: "",
    last: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    phone: "",
  });

  const { password, passwordConfirmation } = formData;

  const formChangeHandler = useCallback((e) => {
    e.preventDefault();
    dispatch({ type: e.target.id, payload: e.target.value });
  }, []);

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      // add phone, email validation
      console.log(formData.password + ":" + formData.passwordConfirmation);
      if (password !== passwordConfirmation) {
        setError("Passwords do not match");
      } else {
        setError("");
        const body = {
          first: formData.first,
          last: formData.last,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };
        localStorage.setItem("token", "");
        BackendClient.register(body, () => navigate("/login"), setError);
      }
    },
    [formData]
  );

  const submitOnEnterHandler = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        console.log("submit");
        submitHandler(e);
      }
    },
    [formData]
  );

  return (
    <Paper
      sx={{
        display: "flex",
        margin: "auto",
        width: "50%",
        flexDirection: "column",
      }}
    >
      <Heading1>Register</Heading1>
      <StyledTextField
        id={SET_FIRST}
        label="First Name"
        value={formData.first}
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
        width="50%"
      ></StyledTextField>
      <StyledTextField
        id={SET_LAST}
        label="Last Name"
        value={formData.last}
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
      ></StyledTextField>
      <StyledTextField
        id={SET_PASSWORD}
        value={formData.password}
        label="Password"
        type="password"
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
      ></StyledTextField>
      <StyledTextField
        id={SET_CONFIRM_PASSWORD}
        value={formData.passwordConfirmation}
        label="Password Confirmation"
        type="password"
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
      ></StyledTextField>
      <StyledTextField
        id={SET_PHONE}
        label="Phone"
        pattern="^\+?(\d{1,3})?[-. (]?\d{3}[-. )]?\d{3}[-. ]?\d{4}$"
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
      ></StyledTextField>
      <StyledTextField
        id={SET_EMAIL}
        label="Email Address"
        pattern="^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$"
        onChange={(event) => formChangeHandler(event)}
        onKeyDown={submitOnEnterHandler}
      ></StyledTextField>
      <Button variant="contained" onClick={submitHandler}>
        Login
      </Button>
      {error ? <output>{error}</output> : <></>}
    </Paper>
  );
};

export default Register;
