import axios from "axios";
import Cookies from "js-cookie";
import { getErrorMessage } from "./errorcatch";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;
        Cookies.set("accessToken", newAccessToken, { 
          expires: 15 / 1440, 
          secure: process.env.NODE_ENV === "production", 
          sameSite: "lax" 
        });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        Cookies.remove("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = getErrorMessage(error);
    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export default api;