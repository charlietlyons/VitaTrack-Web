import axios from "axios";

const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

// TODO: convert to class and use async/await instead
const BackendClient = {
  login: (email, password, loginSuccessHandler, errorHandler) => {
    try {
      axios
        .post(
          `${url}/verify-user`,
          { email: email, password: password },
          {
            headers: headers,
          }
        )
        .then((response) => {
          if (response.status === 200 && response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            loginSuccessHandler(true);
            errorHandler("");
          } else if (response.status === 401) {
            errorHandler("Invalid Credentials");
          }
        })
        .catch(() => {
          errorHandler(
            "There was an issue verifying your account. Please try again later."
          );
        });
    } catch (error) {
      errorHandler(error.message);
    }
  },

  register: (formData, registerSuccessHandler, registerFailureHandler) => {
    try {
      axios
        .post(`${url}/register-user`, formData, {
          headers: headers,
        })
        .then((response) => {
          if (response.status === 200) {
            registerSuccessHandler();
          } else {
            registerFailureHandler("User already exists");
          }
        });
    } catch (error) {
      registerFailureHandler("An error occurred. Please try again later.");
    }
  },

  accountDetails: (successHandler, failureHandler) => {
    try {
      axios
        .get(`${url}/account-details`, {
          headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          successHandler(response.data);
        });
    } catch (error) {
      failureHandler(error);
    }
  },

  addIntake(intake, successHandler, failureHandler) {
    try {
      axios
        .post(
          `${url}/add-intake`,
          { ...intake },
          {
            headers: {
              ...headers,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(successHandler);
    } catch (error) {
      failureHandler(error);
    }
  },

  getIntakes(successHandler, failureHandler) {
    try {
      axios
        .get(`${url}/intake`, {
          headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            date: new Date().toJSON().slice(0, 10),
          },
        })
        .then((response) => {
          successHandler(response.data);
        })
        .catch(() => {
          failureHandler("Something went wrong.");
        });
    } catch (error) {
      failureHandler("Something went wrong.");
    }
  },

  addFood(body, successHandler, failureHandler) {
    try {
      axios
        .post(
          `${url}/add-food`,
          { ...body },
          {
            headers: {
              ...headers,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(successHandler)
        .catch(failureHandler);
    } catch (error) {
      failureHandler(error);
    }
  },

  verifyToken: (token, callback) => {
    try {
      axios
        .post(
          `${url}/verify-token`,
          { token: token },
          {
            headers: headers,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            callback(true);
          } else {
            callback(false);
          }
        });
    } catch (error) {
      callback(false);
    }
  },
};

export default BackendClient;
