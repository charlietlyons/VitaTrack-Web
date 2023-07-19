import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_CONFIRM_PASSWORD,
  SET_PHONE,
  SET_FIRST,
  SET_LAST,
} from "../components/common/constants";

const RegisterFormReducer = (state, action) => {
  switch (action.type) {
    case SET_FIRST:
      return { ...state, first: action.payload };
    case SET_LAST:
      return { ...state, last: action.payload };
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case SET_CONFIRM_PASSWORD:
      return { ...state, passwordConfirmation: action.payload };
    case SET_PHONE:
      return { ...state, phone: action.payload };
    default:
      return state;
  }
};

export default RegisterFormReducer;
