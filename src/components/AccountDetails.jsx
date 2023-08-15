import React, { useContext, useEffect, useState } from "react";
import BackendClient from "../client/BackendClient";
import { PageContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { RedirectToLogin } from "./common/Redirects"; 

const AccountDetails = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState({});

  useEffect(() => {
    BackendClient.accountDetails(setAccountDetails, () => {});
  }, [setAccountDetails]);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Account Details</h1>
      <p>Phone: {accountDetails.phone}</p>
      <p>Email: {accountDetails.email}</p>
      <p>First Name: {accountDetails.first}</p>
      <p>Last Name: {accountDetails.last}</p>
    </PageContainer>
  ) : (
    <RedirectToLogin />
  );
};

export default AccountDetails;
