import React, { useCallback, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Heading1 } from "./common/Headings";
import { StyledTextField } from "./common/Inputs";
import { FormContainer } from "./common/Containers";
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
      if (
        formData.first === "" ||
        formData.last === "" ||
        formData.email === "" ||
        formData.password === "" ||
        formData.passwordConfirmation === "" ||
        formData.phone === ""
      ) {
        setError("Form is incomplete");
      } else if (password !== passwordConfirmation) {
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
        BackendClient.register(
          body,
          () => navigate("/vitatrack/login"),
          setError
        );
      }
    },
    [formData]
  );

  const submitOnEnterHandler = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        submitHandler(e);
      }
    },
    [formData]
  );

  return (
    <FormContainer
      title={<Heading1>Register</Heading1>}
      formFields={[
        <StyledTextField
          id={SET_FIRST}
          label="First Name"
          value={formData.first}
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
        <StyledTextField
          id={SET_LAST}
          label="Last Name"
          value={formData.last}
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
        <StyledTextField
          id={SET_PASSWORD}
          value={formData.password}
          label="Password"
          type="password"
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
        <StyledTextField
          id={SET_CONFIRM_PASSWORD}
          value={formData.passwordConfirmation}
          label="Confirm Password"
          type="password"
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
        <StyledTextField
          id={SET_PHONE}
          label="Phone"
          pattern="^\+?(\d{1,3})?[-. (]?\d{3}[-. )]?\d{3}[-. ]?\d{4}$"
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
        <StyledTextField
          id={SET_EMAIL}
          label="Email Address"
          pattern="^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$"
          onChange={(event) => formChangeHandler(event)}
          onKeyDown={submitOnEnterHandler}
        ></StyledTextField>,
      ]}
      buttons={[
        <Button variant="contained" onClick={submitHandler}>
          Register
        </Button>,
      ]}
      error={error}
    />
  );
};

export default Register;
