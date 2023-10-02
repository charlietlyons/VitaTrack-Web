import React, { useCallback, useContext, useEffect, useState } from "react";
import { PageContainer } from "./common/Containers";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import IntakeDialog from "./IntakeDialog/IntakeDialog";
import FoodLog from "./FoodLog/FoodLog";
import Login from "./Login";
import BackendClient from "../client/BackendClient";

const DailyStats = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showAddIntakeForm, setShowAddIntakeForm] = useState(false);
  const [intakes, setIntakes] = useState([]);
  const [error, setError] = useState(null);

  const refreshIntakes = useCallback(() => {
    BackendClient.getIntakes(
      (data) => {
        setIntakes(data);
      },
      (error) => {
        setError(error);
      }
    );
  }, [setIntakes, setError]);

  useEffect(() => {
    refreshIntakes();
  }, [refreshIntakes]);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Daily Stats</h1>
      {/* TODO: Make this a floating button */}
      <Button variant="contained" onClick={() => setShowAddIntakeForm(true)}>
        Add Intake
      </Button>
      <FoodLog
        intakes={intakes}
        error={error}
        setError={setError}
        refreshIntakes={refreshIntakes}
      />
      <IntakeDialog
        intakeId={false}
        showDialog={showAddIntakeForm}
        setShowDialog={setShowAddIntakeForm}
        refreshIntakes={refreshIntakes}
      />
    </PageContainer>
  ) : (
    <Login />
  );
};

export default DailyStats;
