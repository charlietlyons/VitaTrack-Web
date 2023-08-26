import RegisterFormReducer from "../../src/reducers/RegisterFormReducer";

describe("RegisterFormReducer", () => {
  it("should return the initial state", () => {
    const initialState = {
      first: "",
      last: "",
      email: "farms",
      password: "",
      passwordConfirmation: "",
      phone: "",
    };

    expect(
      RegisterFormReducer(initialState, {
        payload: "pepperridge",
        type: "noting",
      })
    ).toEqual(initialState);
  });
});
