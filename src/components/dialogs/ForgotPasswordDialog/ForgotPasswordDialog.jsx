import { DialogContainer, FormContainer } from "../../common/Containers";
import React, { useState, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import BackendClient from "../../../client/BackendClient";

const ForgotPasswordDialog = (props) => {
  const { showDialog, setShowDialog } = props;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submitHandler = useCallback(async () => {
    const response = await BackendClient.sendForgotPasswordEmail(email);
    if (response) {
      setShowDialog(false);
    } else {
      setError("An error occurred.");
    }
  }, [setError, setShowDialog, email]);

  return (
    <DialogContainer
      title="Forgot Password"
      subtitle="Enter your email to receive a reset password link."
      showDialog={showDialog}
    >
      <FormContainer
        id="forgot-password-form"
        formFields={[
          <TextField
            value={email}
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
          />,
        ]}
        error={error}
        buttons={[
          <Button variant="contained" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>,
          <Button variant="contained" onClick={submitHandler}>
            Submit
          </Button>,
        ]}
      />
    </DialogContainer>
  );
};

export default ForgotPasswordDialog;
