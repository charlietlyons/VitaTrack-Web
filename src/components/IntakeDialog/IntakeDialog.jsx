import React, { useState, useCallback } from "react";
import { Dialog, DialogTitle, Button, Autocomplete } from "@mui/material";
import { StyledTextField } from "../common/Inputs";
import { FormContainer } from "../common/Containers";
import BackendClient from "../../client/BackendClient";

const IntakeDialog = (props) => {
    const { showForm, setShowForm } = props;
    const [food, setFood] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");  

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

    return (
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
              }/>
        </Dialog>
    );
}

export default IntakeDialog;