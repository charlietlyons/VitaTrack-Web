import UpdatePasswordValidator from "../../src/validators/UpdatePasswordValidator";

describe("UpdatePasswordValidator", () => {
  it("should return false and setError to Password is required", () => {
    const form = {
      password: "",
      passwordConfirmation: "",
    };
    const setError = jest.fn();

    const result = UpdatePasswordValidator.validate(form, setError);

    expect(result).toBe(false);
    expect(setError).toHaveBeenCalledWith("Password is required.");
  });

  it("should return false and setError to Password confirmation is required", () => {
    const form = {
      password: "test",
      passwordConfirmation: "",
    };
    const setError = jest.fn();

    const result = UpdatePasswordValidator.validate(form, setError);

    expect(result).toBe(false);
    expect(setError).toHaveBeenCalledWith("Password confirmation is required.");
  });

  it("should return false and setError to Passwords don't match", () => {
    const form = {
      password: "test",
      passwordConfirmation: "test1",
    };
    const setError = jest.fn();

    const result = UpdatePasswordValidator.validate(form, setError);

    expect(result).toBe(false);
    expect(setError).toHaveBeenCalledWith("Passwords do not match.");
  });

  it("should return true if valid", () => {
    const form = {
      password: "test",
      passwordConfirmation: "test",
    };
    const setError = jest.fn();

    const result = UpdatePasswordValidator.validate(form, setError);

    expect(result).toBe(true);
    expect(setError).toHaveBeenCalledWith("");
  });
});
