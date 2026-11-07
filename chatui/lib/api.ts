import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { getErrorMessage } from "./errorcatch";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response?.status !== 401) {
      const errorMessage = getErrorMessage(error);
      console.error("API Error:", errorMessage);

      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      console.error("Already retried. Redirecting to login.");

      Cookies.remove("accessToken");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log("========== FRONTEND REFRESH START ==========");

      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Refresh response received:", refreshResponse.status);

      const newAccessToken =
        refreshResponse.data?.data?.accessToken;

      console.log(
        "New access token received:",
        !!newAccessToken
      );

      console.log(
        "New access token length:",
        newAccessToken?.length
      );

      if (!newAccessToken) {
        throw new Error("New access token was not received");
      }

      // Save new token
      Cookies.set("accessToken", newAccessToken, {
        expires: 2 / 1440, // testing only
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      console.log(
        "New token saved in cookie:",
        !!Cookies.get("accessToken")
      );

      // Update original request
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      console.log(
        "Retry Authorization set:",
        !!originalRequest.headers.Authorization
      );

      console.log("========== RETRY ORIGINAL REQUEST ==========");

      return api(originalRequest);

    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      Cookies.remove("accessToken");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;