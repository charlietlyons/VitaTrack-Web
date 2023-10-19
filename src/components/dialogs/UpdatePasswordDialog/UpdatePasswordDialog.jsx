import { DialogContainer, FormContainer } from "../../common/Containers";
import React, { useState, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import BackendClient from "../../../client/BackendClient";
import UpdatePasswordValidator from "../../../validators/UpdatePasswordValidator";

const ForgotPasswordDialog = (props) => {
  const { showDialog, setShowDialog } = props;

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const submitHandler = useCallback(async () => {
    if (
      UpdatePasswordValidator.validate(
        { password, passwordConfirmation },
        setError
      )
    ) {
      const response = await BackendClient.updatePassword(password);
      if (response && response.status === 200) {
        setShowDialog(false);
      } else {
        setError("An error occurred.");
      }
    }
  }, [setError, setShowDialog, password, passwordConfirmation]);

  return (
    <DialogContainer
      title="Update Password"
      subtitle="Enter your new password."
      showDialog={showDialog}
    >
      <FormContainer
        formFields={[
          <TextField
            value={password}
            label="Password"
            inputProps={{ "data-testid": "password" }}
            onChange={(event) => setPassword(event.target.value)}
          />,
          <TextField
            value={passwordConfirmation}
            label="Confirm Password"
            inputProps={{ "data-testid": "passwordConfirmation" }}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
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
