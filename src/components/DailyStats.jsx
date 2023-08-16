import React, { useContext, useState, useCallback } from "react";
import { FormContainer, PageContainer } from "./common/Containers";
import { RedirectToLogin } from "./common/Redirects";
import { AuthContext } from "../context/AuthContext";
import { Button, Dialog, DialogTitle, Autocomplete } from "@mui/material";
import { StyledTextField } from "./common/Inputs";
import BackendClient from "../client/BackendClient";

const DailyStats = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const foodChangeHandler = useCallback(
    (event, newValue) => {
      setFood(newValue);
    },
    [food, setFood]
  );

  const quantityChangeHandler = useCallback(
    (event) => {
      setQuantity(event.target.value);
    },
    [setQuantity]
  );

  const submitHandler = useCallback(() => {
    // TODO: form validation
    BackendClient.addIntake(
      {
        foodId: food,
        quantity: quantity,
      },
      () => {
        setShowForm(false);
      },
      (error) => {
        setError("Something went wrong: ", error);
      }
    );
  }, [setShowForm, setError, food, quantity]);

  return isLoggedIn ? (
    <PageContainer>
      <h1>Daily Stats</h1>
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Add Intake
      </Button>
      <Dialog open={showForm}>
        <DialogTitle>Add Intake</DialogTitle>
        <FormContainer
          size={12}
          error={error}
          formFields={[
            <Autocomplete
              id="food"
              options={["Banana", "Apple", "Orange"]}
              value={food}
              sx={{ width: 300 }}
              onChange={foodChangeHandler}
              renderInput={(params) => (
                <StyledTextField {...params} label="Food" />
              )}
            ></Autocomplete>,
            <StyledTextField
              id="quantity"
              label="Quantity"
              value={quantity}
              type="number"
              onChange={quantityChangeHandler}
              onKeyDown={(e) => e.keyCode === 13 && submitHandler()}
            ></StyledTextField>,
          ]}
          submitButton={
            <Button variant="contained" onClick={submitHandler}>
              Submit
            </Button>
          }
        ></FormContainer>
      </Dialog>
    </PageContainer>
  ) : (
    <RedirectToLogin />
  );
};

export default DailyStats;
