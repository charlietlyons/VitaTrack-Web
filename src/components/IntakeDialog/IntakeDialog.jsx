import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Autocomplete, Container } from "@mui/material";
import { StyledTextField } from "../common/Inputs";
import { DialogContainer, FormContainer } from "../common/Containers";
import BackendClient from "../../client/BackendClient";
import FoodDialog from "../FoodDialog/FoodDialog";
import useEnterButtonSubmit from "../../hooks/useEnterButtonSubmit";
import AddIntakeValidator from "../../validators/AddIntakeValidator";

// TODO: object is too big, refactor
const IntakeDialog = (props) => {
  const { intakeId, showDialog, setShowDialog, refreshIntakes } = props;
  const isUpdate = useRef(intakeId ? true : false);
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {
    setupDialog();
  }, [setupDialog]);

  const setupDialog = useCallback(async () => {
    getFoodOptionsData();
    loadInputsWithIntakeData();
  }, [getFoodOptionsData, loadInputsWithIntakeData]);

  const loadInputsWithIntakeData = useCallback(async () => {
    if (isUpdate.current) {
      const response = await BackendClient.getIntakeById(intakeId);

      if (response) {
        setFood(response.name);
        setQuantity(response.quantity);
      } else {
        setError("Could not get intake. Try again later.");
      }
    }
  }, [setError, setFood, setQuantity, intakeId]);

  const getFoodOptionsData = useCallback(async () => {
    const foodOptionsData = await BackendClient.getFoodOptions();
    setFoodOptions(foodOptionsData);
  }, [setFoodOptions]);

  const foodChangeHandler = useCallback(
    (event, newValue) => {
      setFood(newValue);
    },
    [setFood]
  );

  const quantityChangeHandler = useCallback(
    (event) => {
      setQuantity(event.target.value);
    },
    [setQuantity]
  );

  const addFoodCloseHandler = useCallback(() => {
    getFoodOptionsData();
    setShowAddFoodDialog(false);
  }, [setShowAddFoodDialog]);

  const submitHandler = useCallback(() => {
    const selectedFoodData = foodOptions.find((option) => option.name === food);
    if (!selectedFoodData) {
      setError("Food is required");
      return;
    }

    const formData = {
      id: intakeId,
      foodId: selectedFoodData._id,
      quantity: quantity,
    };
    const isValid = AddIntakeValidator.validate(formData, setError);

    if (isValid) {
      const result = isUpdate.current
        ? BackendClient.updateIntake(formData)
        : BackendClient.addIntake(formData);

      if (!result) {
        setError("Could not submit intake. Try again later.");
      } else {
        refreshIntakes();
        setShowDialog(false);
      }
    }
  }, [food, quantity, setError, setShowDialog, refreshIntakes, intakeId]);

  const submitOnEnter = useEnterButtonSubmit(submitHandler);
  return (
    <DialogContainer
      title={isUpdate.current ? "Edit Intake" : "Add Intake"}
      showDialog={showDialog}
      size="md"
    >
      <FormContainer
        size={12}
        error={error}
        formFields={[
          <Autocomplete
            id="food"
            value={food}
            data-testid="food-input"
            options={foodOptions.map((option) => option.name)}
            sx={{ width: 300 }}
            onChange={foodChangeHandler}
            onKeyDown={submitOnEnter}
            renderInput={(params) => (
              <StyledTextField {...params} label="Food" />
            )}
          ></Autocomplete>,
          <StyledTextField
            id="quantity"
            label="Quantity"
            value={quantity}
            data-testid="quantity-input"
            type="number"
            onChange={quantityChangeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
        ]}
        buttons={
          isUpdate.current
            ? [
                <Button variant="contained" onClick={submitHandler} fullWidth>
                  Update
                </Button>,
                <Button
                  variant="outlined"
                  onClick={() => setShowDialog(false)}
                  fullWidth
                >
                  Cancel
                </Button>,
              ]
            : [
                <Button
                  variant="outlined"
                  onClick={() => setShowAddFoodDialog(true)}
                  fullWidth
                >
                  Add Food
                </Button>,
                <Button variant="contained" onClick={submitHandler} fullWidth>
                  Submit
                </Button>,
                <Button
                  variant="outlined"
                  onClick={() => setShowDialog(false)}
                  fullWidth
                >
                  Cancel
                </Button>,
              ]
        }
      />
      <FoodDialog
        showDialog={showAddFoodDialog}
        addFoodCloseHandler={addFoodCloseHandler}
      ></FoodDialog>
    </DialogContainer>
  );
};

export default IntakeDialog;
