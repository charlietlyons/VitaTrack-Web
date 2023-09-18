import {
  EMAIL,
  PASSWORD,
  CONFIRM_PASSWORD,
  PHONE,
  FIRST,
  LAST,
} from "../components/common/constants";

const RegisterFormReducer = (state, action) => {
  switch (action.type) {
    case FIRST:
      return { ...state, first: action.payload };
    case LAST:
      return { ...state, last: action.payload };
    case EMAIL:
      return { ...state, email: action.payload };
    case PASSWORD:
      return { ...state, password: action.payload };
    case CONFIRM_PASSWORD:
      return { ...state, passwordConfirmation: action.payload };
    case PHONE:
      return { ...state, phone: action.payload };
    default:
      return state;
  }
};

export default RegisterFormReducer;
