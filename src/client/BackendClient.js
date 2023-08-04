const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

const BackendClient = {
  login: (username, password, loginSuccessHandler, errorHandler) => {
    try {
      fetch(`${url}/verify-user`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ user: username, password: password }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            errorHandler(
              "There was an error reaching the server. Please try again later."
            );
          }
        })
        .then((data) => {
          if (data && data.token) {
            localStorage.setItem("token", data.token);
            loginSuccessHandler(true);
            errorHandler("");
          }
        });
    } catch (e) {
      errorHandler("Invalid username or password");
    }
  },

  register: (formData, registerSuccessHandler, registerFailureHandler) => {
    fetch(`${url}/register-user`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    }).then((response) => {
      if (response.status === 200) {
        registerSuccessHandler();
      } else {
        registerFailureHandler("Unable to register user");
      }
    });
  },

  verifyToken: (token, callback) => {
    try {
      fetch(`${url}/verify-token`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ token: token }),
      })
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
    } catch (e) {
      callback(false);
    }
  },
};

export default BackendClient;
