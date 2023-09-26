import axios from "axios";
import BackendClient from "../../src/client/BackendClient";

jest.mock("axios");

describe("BackendClient", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("login", () => {
    let errorSetterSpy = jest.fn();

    beforeEach(() => {
      errorSetterSpy = jest.fn();
    });

    it("should return success with true and error with empty string if token returned", async () => {
      axios.post.mockResolvedValue({ status: 200, data: { token: "token" } });

      await BackendClient.login("username", "password", errorSetterSpy);

      expect(errorSetterSpy).toHaveBeenCalledWith("");
    });

    it("should return anything if token NOT returned", async () => {
      axios.post.mockResolvedValue({ status: 200, data: {} });

      await BackendClient.login("username", "password", errorSetterSpy);
      expect(errorSetterSpy).not.toHaveBeenCalled();
    });

    it("should set error if not 200", async () => {
      axios.post.mockResolvedValue({ status: 401, data: {} });

      await BackendClient.login("username", "password", errorSetterSpy);

      expect(errorSetterSpy).toHaveBeenCalledWith(
        "Credentials provided are invalid."
      );
    });

    it("should display issue verifying if axios errors", async () => {
      axios.post.mockImplementation(() => {
        return Promise.reject(new Error("error time"));
      });
      BackendClient.login("username", "password", errorSetterSpy);

      await new Promise((res) => setTimeout(res, 10));

      expect(errorSetterSpy).toHaveBeenCalledWith("error time");
    });

    it("should set error if call errors", async () => {
      const setErrorSpy = jest.fn();

      axios.post.mockImplementation(() => {
        throw Error("error");
      });

      await BackendClient.login("username", "password", setErrorSpy);

      await new Promise((res) => setTimeout(res, 10));

      expect(setErrorSpy).toHaveBeenCalledWith("error");
    });

    it("should throw error if no response", async () => {
      axios.post.mockResolvedValue(undefined);

      await BackendClient.login("username", "password", errorSetterSpy);

      expect(errorSetterSpy).toHaveBeenCalledWith(
        "There was an issue verifying your account. Please try again later."
      );
    });
  });

  describe("register", () => {
    it("should call successHandler if status is 200", async () => {
      const mockSuccessHandler = jest.fn();
      const mockErrorHandler = jest.fn();

      axios.post.mockResolvedValue({ status: 200 });

      await BackendClient.register(
        { formData: "username" },
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalled();
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it("should call errorHandler with user already taken", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();

      axios.post.mockResolvedValue({ status: 401, data: {} });

      await BackendClient.register(
        { formData: "username" },
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).not.toHaveBeenCalledWith(true);
      expect(mockFailureHandler).toHaveBeenCalledWith("User already exists");
    });

    it("should return error if call errors", async () => {
      const mockSuccessHandler = jest.fn();
      const mockErrorHandler = jest.fn();
      axios.post.mockImplementation(() => {
        throw Error("error");
      });
      await BackendClient.register(
        { formData: "username" },
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockErrorHandler).toHaveBeenCalledWith(
        "An error occurred. Please try again later."
      );
      expect(mockSuccessHandler).not.toHaveBeenCalledWith(true);
    });
  });

  describe("accountDetails", () => {
    it("should call successHandler if response exists", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const bigData = "dangerous";

      axios.get.mockResolvedValue({ status: 200, data: bigData });
      localStorage.setItem("token", "token");

      await BackendClient.accountDetails(
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalledWith(bigData);
      expect(mockFailureHandler).not.toHaveBeenCalled();
    });

    it("should call errorHandler if error", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const error = new Error("error");

      axios.get.mockImplementation(() => {
        throw error;
      });
      await BackendClient.accountDetails(
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).not.toHaveBeenCalledWith(true);
      expect(mockFailureHandler).toHaveBeenCalledWith(error);
    });
  });

  describe("addIntake", () => {
    it("should call successHandler if response exists", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const response = { status: 200 };

      axios.post.mockResolvedValue(response);

      await BackendClient.addIntake(
        { intake: "someIntake" },
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalled();
      expect(mockFailureHandler).not.toHaveBeenCalled();
    });

    it("should call errorHandler if error", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const error = new Error("bad time.com");

      axios.post.mockImplementation(() => {
        throw error;
      });

      await BackendClient.addIntake(
        { intake: "someIntake" },
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockFailureHandler).toHaveBeenCalledWith(error);
    });
  });

  describe("getIntakes", () => {
    it("should call successHandler if response exists", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const response = { status: 200 };

      axios.get.mockResolvedValue(response);

      await BackendClient.getIntakes(mockSuccessHandler, mockFailureHandler);

      expect(mockSuccessHandler).toHaveBeenCalled();
      expect(mockFailureHandler).not.toHaveBeenCalled();
    });

    it("should call failureHandler when axios request fails", async () => {
      const successHandler = jest.fn();
      const failureHandler = jest.fn();

      axios.get.mockImplementation(() => {
        return Promise.reject(new Error("Network Error"));
      });

      await BackendClient.getIntakes(successHandler, failureHandler);

      await new Promise((res) => setTimeout(res, 10));

      expect(failureHandler).toHaveBeenCalledWith("Something went wrong.");
      expect(successHandler).not.toHaveBeenCalled();
    });

    it("should call errorHandler if error", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const error = new Error("bad time.com");

      axios.get.mockImplementation(() => {
        throw error;
      });

      await BackendClient.getIntakes(mockSuccessHandler, mockFailureHandler);

      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockFailureHandler).toHaveBeenCalled();
    });
  });

  describe("addFood", () => {
    it("should call successHandler if response exists", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      const response = { status: 200 };

      axios.post.mockResolvedValue(response);

      await BackendClient.addFood(
        { food: "someFood" },
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalled();
      expect(mockFailureHandler).not.toHaveBeenCalled();
    });

    it("should call failHandler when axios errors", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      axios.post.mockRejectedValue(new Error("error"));

      await BackendClient.addFood(
        { food: "someFood" },
        mockSuccessHandler,
        mockFailureHandler
      );

      await new Promise((res) => setTimeout(res, 10));

      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockFailureHandler).toHaveBeenCalled();
    });

    it("should call failHandler when a general error occurs", async () => {
      const mockSuccessHandler = jest.fn();
      const mockFailureHandler = jest.fn();
      axios.post.mockImplementation(() => {
        throw new Error("error");
      });

      await BackendClient.addFood(
        { food: "someFood" },
        mockSuccessHandler,
        mockFailureHandler
      );

      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockFailureHandler).toHaveBeenCalled();
    });
  });

  describe("getFoodOptions", () => {
    it("should call return response data if response exists", async () => {
      axios.get.mockReturnValue({ data: [{ _id: "id", name: "name" }] });

      const options = await BackendClient.getFoodOptions();

      await new Promise((res) => setTimeout(res, 10));

      expect(options).toEqual([{ _id: "id", name: "name" }]);
    });

    it("should return an empty arraw when axios errors", async () => {
      axios.get.mockRejectedValue(new Error("error"));

      const options = await BackendClient.getFoodOptions();

      await new Promise((res) => setTimeout(res, 10));

      expect(options).toEqual([]);
    });
  });

  describe("verifyToken", () => {
    it("should call callback with true if response is 200", async () => {
      const callbackMock = jest.fn();
      const response = { status: 200 };

      axios.post.mockResolvedValue(response);

      await BackendClient.verifyToken("token", callbackMock);

      expect(callbackMock).toHaveBeenCalledWith(true);
    });

    it("should call callback with false if response is not 200", async () => {
      const callbackMock = jest.fn();
      const response = { status: 401 };

      axios.post.mockResolvedValue(response);

      await BackendClient.verifyToken("token", callbackMock);

      expect(callbackMock).toHaveBeenCalledWith(false);
    });

    it("should call callback with false if error", async () => {
      const callbackMock = jest.fn();
      const error = new Error("bad time.com");

      axios.post.mockImplementation(() => {
        throw error;
      });

      await BackendClient.verifyToken("token", callbackMock);

      expect(callbackMock).toHaveBeenCalledWith(false);
    });
  });
});
