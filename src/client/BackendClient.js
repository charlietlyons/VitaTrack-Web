import axios from "axios";

const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

const BackendClient = {
  login: (email, password, loginSuccessHandler, errorHandler) => {
    axios
      .post(
        `${url}/verify-user`,
        { email: email, password: password },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            loginSuccessHandler(true);
            errorHandler("");
          }
        } else {
          errorHandler(
            "There was an error reaching the server. Please try again later."
          );
        }
      })
      .catch((error) => {
        errorHandler("Invalid credentials");
      });
  },

  register: (formData, registerSuccessHandler, registerFailureHandler) => {
    axios
      .post(`${url}/register-user`, formData, {
        headers: headers,
      })
      .then((response) => {
        if (response.status === 200) {
          registerSuccessHandler();
        }
        registerFailureHandler("An error occurred. Please try again later.");
      })
      .catch((error) => {
        registerFailureHandler("Registration failed. Email already in use.");
      });
  },

  accountDetails: (successHandler, failureHandler) => {
    axios
      .get(`${url}/account-details`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        successHandler(response.data);
      })
      .catch((error) => {
        failureHandler(error);
      });
  },

  addIntake(intake, successHandler, failureHandler) {
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
      .then(successHandler)
      .catch((error) => failureHandler(error));
  },

  getIntakes(successHandler, failureHandler) {
    axios.get(`${url}/intake`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        date: new Date().toJSON().slice(0, 10)
      }
    }).then(successHandler).catch(failureHandler);
  },

  verifyToken: (token, callback) => {
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
      })
      .catch((error) => {
        callback(false);
      });
  },
};

export default BackendClient;
