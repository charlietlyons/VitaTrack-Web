import { DialogContainer, FormContainer } from "../../common/Containers";
import React, { useState, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import BackendClient from "../../../client/BackendClient";
import UpdatePasswordValidator from "../../../validators/UpdatePasswordValidator";

const UpdatePasswordDialog = (props) => {
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
      if (response) {
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
        id="update-password-form"
        formFields={[
          <TextField
            id="new-password"
            value={password}
            label="Password"
            inputProps={{ "data-testid": "password" }}
            onChange={(event) => setPassword(event.target.value)}
          />,
          <TextField
            id="confirm-password"
            value={passwordConfirmation}
            label="Confirm Password"
            inputProps={{ "data-testid": "passwordConfirmation" }}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />,
        ]}
        error={error}
        buttons={[
          <Button id="cancel-button" variant="contained" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>,
          <Button id="submit-password-button" variant="contained" onClick={submitHandler}>
            Submit
          </Button>,
        ]}
      />
    </DialogContainer>
  );
};

export default UpdatePasswordDialog;
