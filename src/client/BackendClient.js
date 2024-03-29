import axios from "axios";

const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

// TODO: convert to class/hook and use async/await instead
// TODO: convert specific methods to general ones
// TODO: Divide into smaller clients based on their domain
const BackendClient = {
  login: async (email, password, errorSetter) => {
    try {
      const response = await axios.post(
        `${url}/verify-user`,
        { email: email, password: password },
        {
          headers: headers,
        }
      );
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        errorSetter("");
        return true;
      } else {
        errorSetter("An error occurred trying to login. Try again later.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorSetter("Credentials provided are invalid.");
      } else {
        errorSetter("There was an error communicating with the server.");
      }
    }
    return false;
  },

  register: async (
    formData,
    registerSuccessHandler,
    registerFailureHandler
  ) => {
    try {
      const response = await axios.post(`${url}/register-user`, formData, {
        headers: headers,
      });
      if (response.status === 200) {
        registerSuccessHandler();
      } else {
        registerFailureHandler("An error occurred. Please try again later.");
      }
    } catch (error) {
      registerFailureHandler("An error occurred. Please try again later.");
    }
  },

  getAccountDetails: async () => {
    try {
      const response = await axios.get(`${url}/account-details`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  },

  async sendForgotPasswordEmail(email) {
    try {
      const response = await axios.post(
        `${url}/forgot-password`,
        {
          email: email,
        },
        {
          headers: headers,
        }
      );

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  async updatePassword(newPassword) {
    try {
      const response = await axios.post(
        `${url}/update-password`,
        {
          password: newPassword,
        },
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  async addIntake(intake) {
    try {
      const response = await axios.post(
        `${url}/intake`,
        { ...intake },
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response;
    } catch (error) {
      return false;
    }
  },

  getIntakes(successHandler, failureHandler) {
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
      .catch((error) => {
        failureHandler("Something went wrong. Network error.");
      });
  },

  async getIntakeById(intakeId) {
    try {
      const response = await axios.get(`${url}/intake/${intakeId}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (err) {
      return false;
    }
  },

  async update(endpoint, formData) {
    try {
      const response = await axios.patch(`${url}/${endpoint}?`, formData, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response;
    } catch (error) {
      return false;
    }
  },

  async delete(endpoint, id) {
    try {
      const response = await axios.delete(`${url}/${endpoint}/${id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response;
    } catch (error) {
      return false;
    }
  },

  async getFoodOptions() {
    try {
      const response = await axios.get(`${url}/food`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      return [];
    }
  },

  addFood(body, successHandler, failureHandler) {
    axios
      .post(
        `${url}/food`,
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
  },

  post: async (endpoint, formData) => {
    try {
      return await axios.post(`${url}/${endpoint}`, formData, {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      return false;
    }
  },
};

export default BackendClient;
