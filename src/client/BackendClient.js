import axios from "axios";

const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};

// TODO: convert to class/hook and use async/await instead
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
      } else if (response.status === 401) {
        errorSetter("Credentials provided are invalid.");
      }
    } catch (error) {
      errorSetter(error.message);
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
        registerFailureHandler("User already exists");
      }
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

  async getFoodById(foodId) {
    try {
      const response = await axios.get(`${url}/food/${foodId}`, {
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

  addFood(body, successHandler, failureHandler) {
    try {
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
    } catch (error) {
      failureHandler(error);
    }
  },

  post: async (endpoint, formData) => {
    try {
      const response = await axios.post(`${url}/${endpoint}`, formData, {
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
};

export default BackendClient;
