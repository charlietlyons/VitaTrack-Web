const AddFoodValidator = {
  validate: (state, setError) => {
    function setErrorAndReturnFalse(error) {
      setError(error);
      return false;
    }

    // TODO: extract to a hook that can be reused
    if (state.name === "") {
      return setErrorAndReturnFalse("Name is required");
    } else if (state.servingSize === "") {
      return setErrorAndReturnFalse("Serving Size is required");
    } else if (state.servingMetric === "") {
      return setErrorAndReturnFalse("Serving Metric is required");
    } else if (state.calories === "") {
      return setErrorAndReturnFalse("Calories is required");
    } else if (state.protein === "") {
      return setErrorAndReturnFalse("Protein is required");
    } else if (state.carbs === "") {
      return setErrorAndReturnFalse("Carbs is required");
    } else if (state.fat === "") {
      return setErrorAndReturnFalse("Fat is required");
    } else if (state.access === "") {
      return setErrorAndReturnFalse("Access is required");
    } else if (state.description === "") {
      return setErrorAndReturnFalse("Description is required");
    } else if (state.imageUrl === "") {
      return setErrorAndReturnFalse("Image URL is required");
    }
    return true;
  },
};

export default AddFoodValidator;
