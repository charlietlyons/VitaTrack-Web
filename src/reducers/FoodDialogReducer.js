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
} from "../components/common/constants";

const FoodDialogReducer = (prev, action) => {
  switch (action.type) {
    case UPDATE:
      return action.payload;
    case FOOD_NAME:
      return {
        ...prev,
        name: action.payload,
      };
    case SERVING_SIZE:
      return {
        ...prev,
        servingSize: action.payload,
      };
    case SERVING_METRIC:
      return {
        ...prev,
        servingUnit: action.payload,
      };
    case CALORIES:
      return {
        ...prev,
        calories: action.payload,
      };
    case PROTEIN:
      return {
        ...prev,
        protein: action.payload,
      };
    case CARBS:
      return {
        ...prev,
        carbs: action.payload,
      };
    case FAT:
      return {
        ...prev,
        fat: action.payload,
      };
    case ACCESS:
      return {
        ...prev,
        access: action.payload,
      };
    case DESCRIPTION:
      return {
        ...prev,
        description: action.payload,
      };
    case IMAGE_URL:
      return {
        ...prev,
        imageUrl: action.payload,
      };
    default:
      return prev;
  }
};

export default FoodDialogReducer;
