import AddFoodValidator from "../../src/validators/AddFoodValidator";

describe("checkForEmpties", () => {
  it("should return true if any input is empty", () => {
    const setErrorMock = jest.fn();

    const result = AddFoodValidator.validate(
      {
        name: "test",
        servingSize: "test",
        servingMetric: "test",
        calories: "test",
        protein: "test",
        carbs: "test",
        fat: "test",
        access: "test",
        description: "test",
        imageUrl: "test",
      },
      setErrorMock
    );

    expect(result).toBe(true);
    expect(setErrorMock).not.toHaveBeenCalled();
  });

  it("should return false if any inputs are not filled", () => {
    const setErrorMock = jest.fn();

    expect(
      AddFoodValidator.validate(
        {
          name: "",
          servingSize: "",
          servingMetric: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          access: "",
          description: "",
          imageUrl: "",
        },
        setErrorMock
      )
    ).toBe(false);
    expect(setErrorMock).toHaveBeenCalled();
  });
});
