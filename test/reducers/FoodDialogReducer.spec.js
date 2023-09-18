import FoodDialogReducer from "../../src/reducers/FoodDialogReducer";
import { PROTEIN } from "../../src/components/common/constants";

describe("FoodDialogReducer", () => {
  const initialState = {
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
  };

  it("should set state based on action.type", () => {
    expect(
      FoodDialogReducer(initialState, {
        type: PROTEIN,
        payload: "test",
      })
    ).toEqual({
      name: "",
      servingSize: "",
      servingMetric: "",
      calories: "",
      protein: "test",
      carbs: "",
      fat: "",
      access: "",
      description: "",
      imageUrl: "",
    });
  });

  it("should return previous state if action.type is invalid", () => {
    expect(FoodDialogReducer(initialState, { type: "noting" })).toEqual(
      initialState
    );
  });
});
