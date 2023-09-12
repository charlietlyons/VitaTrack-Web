import React, { useState } from "react";
import { DialogContainer } from "../common/Containers";
import { Button } from "@mui/material";

const FoodDialog = (props) => {
  const { showDialog, setShowDialog } = props;
  const [error, setError] = useState("");

  return (
    <DialogContainer title="Add Food" showDialog={showDialog}>
      <Button variant="outlined" onClick={() => setShowDialog(false)} fullWidth>
        Close
      </Button>
    </DialogContainer>
  );
};

export default FoodDialog;
