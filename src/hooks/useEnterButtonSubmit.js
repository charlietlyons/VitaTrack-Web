import { useCallback } from "react";

function useEnterButtonSubmit(submitHandler) {
  const submitOnEnter = useCallback(
    (event) => {
      return event.keyCode === 13 && submitHandler();
    },
    [event, submitHandler]
  );
  return submitOnEnter;
}

export default useEnterButtonSubmit;
