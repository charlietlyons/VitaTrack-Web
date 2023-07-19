const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

const BackendClient = {
  login: (username, password, loginSuccessHandler, loginFailureHandler) => {
    fetch(`${url}/verify-user`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ user: username, password: password }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          loginFailureHandler("Invalid username or password");
        }
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("token", data?.token);
          loginSuccessHandler(true);
        }
      });
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
    fetch(`${url}/verify-token`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ token: token }),
    }).then((response) => {
      if (response.status === 200) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },
};

export default BackendClient;
