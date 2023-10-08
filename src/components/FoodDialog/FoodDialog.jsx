import React, {
  useState,
  useRef,
  useReducer,
  useCallback,
  useEffect,
} from "react";
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
  UPDATE,
  FOOD,
  CLEAR,
} from "../common/constants";
import useEnterButtonSubmit from "../../hooks/useEnterButtonSubmit";
import BackendClient from "../../client/BackendClient";
import AddFoodValidator from "../../validators/AddFoodValidator";

const FoodDialog = (props) => {
  const [state, dispatch] = useReducer(FoodDialogReducer, {
    name: "",
    servingSize: "",
    servingUnit: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    access: "",
    description: "",
    imageUrl: "",
  });
  const { showDialog, addFoodCloseHandler, foodData } = props;
  const isUpdate = useRef(foodData ? true : false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExistingFoodData();
  }, [loadExistingFoodData]);

  const loadExistingFoodData = useCallback(async () => {
    if (isUpdate.current) {
      dispatch({
        type: UPDATE,
        payload: foodData,
      });
    }
  }, [dispatch, foodData, isUpdate]);

  const addHandler = useCallback(() => {
    BackendClient.addFood(
      state,
      () => {
        dispatch({
          type: CLEAR,
          payload: {},
        });
        addFoodCloseHandler();
      },
      (err) => {
        setError("Something went wrong: ", err);
      }
    );
  }, [addFoodCloseHandler, setError, state]);

  const updateHandler = useCallback(async () => {
    const response = BackendClient.update(FOOD, state);

    if (response) {
      dispatch({
        type: CLEAR,
        payload: {},
      });
      addFoodCloseHandler();
    } else {
      setError("Something went wrong.");
    }
  }, [state, setError, addFoodCloseHandler]);

  const submitHandler = useCallback(() => {
    if (AddFoodValidator.validate(state, setError)) {
      setError("");
      if (isUpdate.current) {
        updateHandler();
      } else {
        addHandler();
      }
    }
  }, [state, setError, updateHandler, addHandler]);

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
            value={state.servingUnit}
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
            {isUpdate.current ? "Update" : "Add"}
          </Button>,
          <Button variant="outlined" onClick={addFoodCloseHandler} fullWidth>
            Close
          </Button>,
        ]}
        error={error}
      ></FormContainer>
    </DialogContainer>
  );
};

export default FoodDialog;
