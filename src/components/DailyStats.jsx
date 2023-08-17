import React, { useContext, useState } from "react";
import { PageContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import IntakeDialog from "./IntakeDialog/IntakeDialog";
import FoodLog from "./FoodLog/FoodLog";
import Login from "./Login";

const DailyStats = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Daily Stats</h1>
      {/* TODO: Make this a floating button */}
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Add Intake
      </Button>
      <FoodLog />
      <IntakeDialog showForm={showForm} setShowForm={setShowForm} />
    </PageContainer>
  ) : (
    <Login />
  );
};

export default DailyStats;
