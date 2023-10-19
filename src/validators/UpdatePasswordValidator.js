const UpdatePasswordValidator = {
  validate: (form, setError) => {
    const password = form.password;
    const passwordConfirmation = form.passwordConfirmation;

    if (!password) {
      setError("Password is required.");
      return false;
    }

    if (!passwordConfirmation) {
      setError("Password confirmation is required.");
      return false;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  },
};

export default UpdatePasswordValidator;
