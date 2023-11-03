import React, { useContext, useEffect, useState } from "react";
import BackendClient from "../client/BackendClient";
import { PageContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import UpdatePasswordDialog from "./dialogs/UpdatePasswordDialog/UpdatePasswordDialog";
import { Button, Typography } from "@mui/material";
import { useCallback } from "react";

const AccountDetails = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [accountDetails, setAccountDetails] = useState({});
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] =
    useState(false);

  useEffect(() => {
    getAccountDetails();
  }, [setAccountDetails]);

  const getAccountDetails = useCallback(async () => {
    const data = await BackendClient.getAccountDetails();
    setAccountDetails(data);
  }, [setAccountDetails]);

  return isLoggedIn ? (
    <PageContainer>
      <Typography variant="h3">Account Details</Typography>
      {showUpdatePasswordDialog && (
        <UpdatePasswordDialog
          showDialog={showUpdatePasswordDialog}
          setShowDialog={setShowUpdatePasswordDialog}
        />
      )}
      { Object.keys(accountDetails).length > 0 ? (
        <>
          <Typography variant="body1">Phone: {accountDetails.phone}</Typography>
          <Typography variant="body1">Email: {accountDetails.email}</Typography>
          <Typography variant="body1">
            First Name: {accountDetails.first}
          </Typography>
          <Typography variant="body1">Last Name: {accountDetails.last}</Typography>
          <Button
            id="change-password-button"
            variant="outlined"
            onClick={() => setShowUpdatePasswordDialog(true)}
          >
            Change Password
          </Button> 
        </>
      ) : <output id="account-details-error">Could not retrieve account details.</output>}
    </PageContainer>
  ) : (
    <Login />
  );
};

export default AccountDetails;
