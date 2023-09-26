// TODO: extract this function to a useValidator hook that you make later, cool thanks
export function setErrorAndReturnFalse(error, setError) {
  setError(error);
  return false;
}
