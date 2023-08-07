import axios from "axios";

const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

const BackendClient = {
  login: (username, password, loginSuccessHandler, errorHandler) => {
    axios
      .post(
        `${url}/verify-user`,
        { user: username, password: password },
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
