import AddFoodValidator from "../../src/validators/AddFoodValidator";
import AddIntakeValidator from "../../src/validators/AddIntakeValidator";

describe("checkForEmpties", () => {
  it("should return true if any input is empty", () => {
    const setErrorMock = jest.fn();

    const result = AddIntakeValidator.validate(
      {
        foodId: "test",
        quantity: "test",
      },
      setErrorMock
    );

    expect(result).toBe(true);
    expect(setErrorMock).not.toHaveBeenCalled();
  });

  // it("should return false if foodinput is empty", () => {
  //   const setErrorMock = jest.fn();

  //   expect(
  //     AddIntakeValidator.validate(
  //       {
  //         foodId: "",
  //         quantity: "1",
  //       },
  //       setErrorMock
  //     )
  //   ).toBe(false);
  //   expect(setErrorMock).toHaveBeenCalled();
  // });

  it("should return false if quantity is empty", () => {
    const setErrorMock = jest.fn();

    expect(
      AddIntakeValidator.validate(
        {
          foodId: "some",
          quantity: "",
        },
        setErrorMock
      )
    ).toBe(false);
    expect(setErrorMock).toHaveBeenCalled();
  });
});
