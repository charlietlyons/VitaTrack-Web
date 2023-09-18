import React, { useContext, useState } from "react";
import { PageContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import IntakeDialog from "./IntakeDialog/IntakeDialog";
import FoodLog from "./FoodLog/FoodLog";
import Login from "./Login";

const DailyStats = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showAddIntakeForm, setShowAddIntakeForm] = useState(false);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Daily Stats</h1>
      {/* TODO: Make this a floating button */}
      <Button variant="contained" onClick={() => setShowAddIntakeForm(true)}>
        Add Intake
      </Button>
      <FoodLog />
      <IntakeDialog
        showDialog={showAddIntakeForm}
        setShowDialog={setShowAddIntakeForm}
      />
    </PageContainer>
  ) : (
    <Login />
  );
};

export default DailyStats;
