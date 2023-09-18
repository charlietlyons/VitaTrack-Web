import React, { useState, useReducer, useCallback } from "react";
import { DialogContainer, FormContainer } from "../common/Containers";
import { Button } from "@mui/material";
import { StyledTextField } from "../common/Inputs";
import FoodDialogReducer from "../../reducers/FoodDialogReducer";
import useReducerChangeHandler from "../../hooks/useReducerChangeHandler";
import {
  FOOD_NAME,
  SERVING_SIZE,
  SERVING_METRIC,
  CALORIES,
  PROTEIN,
  CARBS,
  FAT,
  ACCESS,
  DESCRIPTION,
  IMAGE_URL,
} from "../common/constants";
import useEnterButtonSubmit from "../../hooks/useEnterButtonSubmit";
import BackendClient from "../../client/BackendClient";
import AddFoodValidator from "../../validators/AddFoodValidator";

const FoodDialog = (props) => {
  const [state, dispatch] = useReducer(FoodDialogReducer, {
    name: "",
    servingSize: "",
    servingMetric: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    access: "",
    description: "",
    imageUrl: "",
  });
  const { showDialog, setShowDialog } = props;
  const [error, setError] = useState("");
  const submitHandler = useCallback(() => {
    if (AddFoodValidator.validate(state, setError)) {
      setError("");
      BackendClient.addFood(
        state,
        () => {
          setShowDialog(false);
        },
        (err) => {
          setError("Something went wrong: ", err);
        }
      );
    }
  }, [setShowDialog, state, setError]);

  const changeHandler = useReducerChangeHandler(dispatch);
  const submitOnEnter = useEnterButtonSubmit(submitHandler);

  return (
    <DialogContainer title="Add Food" showDialog={showDialog}>
      <FormContainer
        formFields={[
          <StyledTextField
            id={FOOD_NAME}
            label="Name"
            value={state.name}
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={SERVING_SIZE}
            label="Serving Size"
            value={state.servingSize}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={SERVING_METRIC}
            label="Serving Metric"
            value={state.servingMetric}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={CALORIES}
            label="Calories"
            value={state.calories}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={PROTEIN}
            label="Protein"
            value={state.protein}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={CARBS}
            label="Carbs"
            value={state.carbs}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={FAT}
            label="Fat"
            value={state.fat}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={ACCESS}
            label="Access"
            value={state.access}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={DESCRIPTION}
            label="Description"
            value={state.description}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
          <StyledTextField
            id={IMAGE_URL}
            label="Image URL"
            value={state.imageUrl}
            // type="number"
            onChange={changeHandler}
            onKeyDown={submitOnEnter}
          ></StyledTextField>,
        ]}
        buttons={[
          <Button variant="contained" onClick={submitHandler} fullWidth>
            Add
          </Button>,
          <Button
            variant="outlined"
            onClick={() => setShowDialog(false)}
            fullWidth
          >
            Close
          </Button>,
        ]}
        error={error}
      ></FormContainer>
    </DialogContainer>
  );
};

export default FoodDialog;
