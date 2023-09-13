import { useCallback } from "react";

export default function useReducerChangeHandler(dispatch) {
  const changeHandler = useCallback((e) => {
    dispatch({ type: e.target.id, payload: e.target.value });
  }, []);
  return changeHandler;
}
