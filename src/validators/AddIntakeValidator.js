import { setErrorAndReturnFalse } from "../components/common/util/setErrorAndReturn";

const AddIntakeValidator = {
  validate: (state, setError) => {
    if (state.foodId === "") {
      return setErrorAndReturnFalse("Food is required", setError);
    } else if (state.quantity === "") {
      return setErrorAndReturnFalse("Quantity is required", setError);
    }
    return true;
  },
};

export default AddIntakeValidator;
