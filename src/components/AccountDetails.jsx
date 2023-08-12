import React, { useEffect, useState } from "react";
import BackendClient from "../client/BackendClient";
import { PageContainer } from "./common/Containers";

const AccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState({});

  useEffect(() => {
    BackendClient.accountDetails(setAccountDetails, () => {});
  }, [setAccountDetails]);

  return (
    <PageContainer>
      <h1>Account Details</h1>
      <p>Phone: {accountDetails.phone}</p>
      <p>Email: {accountDetails.email}</p>
      <p>First Name: {accountDetails.first}</p>
      <p>Last Name: {accountDetails.last}</p>
    </PageContainer>
  );
};

export default AccountDetails;
