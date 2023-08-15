import React, { useContext } from "react";
import { PageContainer } from "./common/Containers";
import { RedirectToLogin } from "./common/Redirects";
import { AuthContext } from "../context/AuthContext";

const DailyStats = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Daily Stats</h1>
    </PageContainer>
  ) : (
    <RedirectToLogin />
  );
};

export default DailyStats;
