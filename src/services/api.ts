import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  getAuthToken,
  clearAuthToken,
  getImpersonateToken,
} from "@/src/utils/authToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const skipAuthFor = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/reset-password",
      "/api/auth/forgot-password",
    ];
    const isSkippedEndpoint = skipAuthFor.some((path) =>
      config.url?.includes(path),
    );
    if (!isSkippedEndpoint) {
      let token: string | null = getImpersonateToken() || getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (
      config.data &&
      typeof window !== "undefined" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    } else if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
