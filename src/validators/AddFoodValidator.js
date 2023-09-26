import { setErrorAndReturnFalse } from "../components/common/util/setErrorAndReturn";

const AddFoodValidator = {
  validate: (state, setError) => {
    if (state.name === "") {
      return setErrorAndReturnFalse("Name is required", setError);
    } else if (state.servingSize === "") {
      return setErrorAndReturnFalse("Serving Size is required", setError);
    } else if (state.servingMetric === "") {
      return setErrorAndReturnFalse("Serving Metric is required", setError);
    } else if (state.calories === "") {
      return setErrorAndReturnFalse("Calories is required", setError);
    } else if (state.protein === "") {
      return setErrorAndReturnFalse("Protein is required", setError);
    } else if (state.carbs === "") {
      return setErrorAndReturnFalse("Carbs is required", setError);
    } else if (state.fat === "") {
      return setErrorAndReturnFalse("Fat is required", setError);
    } else if (state.access === "") {
      return setErrorAndReturnFalse("Access is required", setError);
    } else if (state.description === "") {
      return setErrorAndReturnFalse("Description is required", setError);
    } else if (state.imageUrl === "") {
      return setErrorAndReturnFalse("Image URL is required", setError);
    }
    return true;
  },
};

export default AddFoodValidator;
