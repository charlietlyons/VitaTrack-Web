import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Autocomplete, Container, FormGroup } from "@mui/material";
import { StyledTextField } from "../common/Inputs";
import { DialogContainer, FormContainer } from "../common/Containers";
import BackendClient from "../../client/BackendClient";
import FoodDialog from "../FoodDialog/FoodDialog";
import useEnterButtonSubmit from "../../hooks/useEnterButtonSubmit";
import AddIntakeValidator from "../../validators/AddIntakeValidator";
import { FOOD, INTAKE } from "../common/constants";

// TODO: object is too big, refactor
const IntakeDialog = (props) => {
  const { intakeId, showDialog, setShowDialog, refreshIntakes } = props;
  const isUpdate = useRef(intakeId ? true : false);
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFoodData, setSelectedFoodData] = useState(null);

  useEffect(() => {
    getFoodOptionsData();
  }, [getFoodOptionsData, isUpdate]);

  useEffect(() => {
    if (isUpdate.current && foodOptions.length > 0) {
      loadInputsWithIntakeData();
    }
  }, [foodOptions, loadInputsWithIntakeData, isUpdate]);

  const getFoodOptionsData = useCallback(async () => {
    const foodOptionsData = await BackendClient.getFoodOptions();
    setFoodOptions(foodOptionsData);
  }, [setFoodOptions]);

  const loadInputsWithIntakeData = useCallback(async () => {
    const response = await BackendClient.getIntakeById(intakeId);

    if (response) {
      setFood(response.name);
      setQuantity(response.quantity);
      setSelectedFoodData(
        foodOptions.find((option) => option.name === response.name)
      );
    } else {
      setError("Could not get intake. Try again later.");
    }
  }, [
    setError,
    setFood,
    setQuantity,
    intakeId,
    foodOptions,
    setSelectedFoodData,
    isUpdate,
  ]);

  const foodChangeHandler = useCallback(
    (event, newValue) => {
      setFood(newValue);
      setSelectedFoodData(
        foodOptions.find((option) => option.name === newValue)
      );
    },
    [setFood, foodOptions, setSelectedFoodData]
  );

  const quantityChangeHandler = useCallback(
    (event) => {
      setQuantity(event.target.value);
    },
    [setQuantity]
  );

  const addFoodCloseHandler = useCallback(() => {
    getFoodOptionsData();
    setShowFoodDialog(false);
  }, [setShowFoodDialog, getFoodOptionsData]);

  const deleteFoodHandler = useCallback(async () => {
    if (selectedFoodData) {
      const response = await BackendClient.delete(FOOD, selectedFoodData._id);

      if (response) {
        setFood("");
        setSelectedFoodData(null);
      } else {
        setError("Could not delete food. Try again later.");
      }
    } else {
      setError("Food is required");
    }
  }, [selectedFoodData, setError, setFood, setSelectedFoodData]);

  const submitHandler = useCallback(async () => {
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
        ? await BackendClient.update(INTAKE, formData)
        : await BackendClient.addIntake(formData);

      if (!result) {
        setError("Could not submit intake. Try again later.");
      } else {
        refreshIntakes();
        setShowDialog(false);
      }
    }
  }, [
    food,
    quantity,
    setError,
    setShowDialog,
    refreshIntakes,
    intakeId,
    foodOptions,
    selectedFoodData,
  ]);

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
          <FormGroup>
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
            ></Autocomplete>
            <Button onClick={() => setShowFoodDialog(true)}>Edit</Button>
            <Button onClick={() => deleteFoodHandler()}>Delete</Button>
          </FormGroup>,
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
                  onClick={() => setShowFoodDialog(true)}
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
      {showFoodDialog && (
        <FoodDialog
          foodData={selectedFoodData}
          showDialog={showFoodDialog}
          addFoodCloseHandler={addFoodCloseHandler}
        ></FoodDialog>
      )}
    </DialogContainer>
  );
};

export default IntakeDialog;
