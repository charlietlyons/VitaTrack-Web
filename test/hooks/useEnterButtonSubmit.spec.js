import useEnterButtonSubmit from "../../src/hooks/useEnterButtonSubmit";
import { renderHook, act } from "@testing-library/react";

describe("useEnterButtonSubmit", () => {
  it("should call submitHandler if keyCode is 13", () => {
    const submitHandler = jest.fn();
    // TODO: renderHook calls render which is deprecated in React 18, please remove
    const { result } = renderHook(() => useEnterButtonSubmit(submitHandler));
    act(() => {
      result.current({ keyCode: 13 });
    });
    expect(submitHandler).toHaveBeenCalled();
  });
});
