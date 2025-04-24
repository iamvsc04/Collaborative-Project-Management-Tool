import axios from "axios";
import { store } from "../store";
import { refreshToken } from "../store/slices/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code;

      if (errorCode === "TOKEN_EXPIRED") {
        originalRequest._retry = true;

        try {
          const { refreshToken: storedRefreshToken } = store.getState().auth;

          if (!storedRefreshToken) {
            throw new Error("No refresh token available");
          }

          const result = await store.dispatch(refreshToken()).unwrap();

          if (!result?.token) {
            throw new Error("Token refresh failed");
          }

          originalRequest.headers.Authorization = `Bearer ${result.token}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          if (window.location.pathname !== "/login") {
            store.dispatch({ type: "auth/logout" });
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else if (errorCode === "INVALID_TOKEN") {
        if (window.location.pathname !== "/login") {
          store.dispatch({ type: "auth/logout" });
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
