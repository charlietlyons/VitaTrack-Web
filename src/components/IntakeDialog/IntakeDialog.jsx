import React, { useState, useCallback, useEffect } from "react";
import { Button, Autocomplete } from "@mui/material";
import { StyledTextField } from "../common/Inputs";
import { DialogContainer, FormContainer } from "../common/Containers";
import BackendClient from "../../client/BackendClient";
import FoodDialog from "../FoodDialog/FoodDialog";
import useEnterButtonSubmit from "../../hooks/useEnterButtonSubmit";
import AddIntakeValidator from "../../validators/AddIntakeValidator";

const IntakeDialog = (props) => {
  const { showDialog, setShowDialog } = props;
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {
    async function getData() {
      const foodOptionsData = await BackendClient.getFoodOptions();
      const foodNames = await foodOptionsData.map((option) => ({
        label: option.name,
        id: option._id,
      }));
      setFoodOptions(foodNames);
    }

    getData();
  }, [setFoodOptions]);

  const submitHandler = useCallback(() => {
    const formData = {
      foodId: food,
      quantity: quantity,
    };

    if (AddIntakeValidator.validate(formData, setError))
      // TODO: form validation
      BackendClient.addIntake(
        formData,
        () => {
          setFood("");
          setQuantity("");
          setShowDialog(false);
        },
        (error) => {
          setError("Something went wrong: ", error);
        }
      );
  }, [setShowDialog, setError, food, quantity]);

  const submitOnEnter = useEnterButtonSubmit(submitHandler);

  const foodChangeHandler = useCallback(
    (event, newValue) => {
      if (newValue) {
        setFood(newValue.id);
      } else {
        setFood("");
      }
    },
    [setFood]
  );

  const quantityChangeHandler = useCallback(
    (event) => {
      setQuantity(event.target.value);
    },
    [setQuantity]
  );

  return (
    <DialogContainer title="Add Intake" showDialog={showDialog} size="md">
      <FormContainer
        size={12}
        error={error}
        formFields={[
          <Autocomplete
            id="food"
            data-testid="food-input"
            options={foodOptions}
            getOptionLabel={(option) => option.label}
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
        buttons={[
          <Button variant="contained" onClick={submitHandler} fullWidth>
            Submit
          </Button>,
          <Button
            variant="outlined"
            onClick={() => setShowAddFoodDialog(true)}
            fullWidth
          >
            Add Food
          </Button>,
          <Button
            variant="outlined"
            onClick={() => setShowDialog(false)}
            fullWidth
          >
            Cancel
          </Button>,
        ]}
      />
      <FoodDialog
        showDialog={showAddFoodDialog}
        setShowDialog={setShowAddFoodDialog}
      ></FoodDialog>
    </DialogContainer>
  );
};

export default IntakeDialog;
