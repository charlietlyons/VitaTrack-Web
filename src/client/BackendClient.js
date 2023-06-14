const BackendClient = {
  login: (username, password, loginSuccessHandler, loginFailureHandler) => {
    fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        localStorage.setItem("token", data.token);
        loginSuccessHandler(true);
      });
  },

  verifyToken: (token, callback) => {
    fetch("http://localhost:3000/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
