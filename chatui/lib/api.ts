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
    const token = Cookies.get("refreshToken"); 

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
  (error) => {
    const errorMessage = getErrorMessage(error);
    console.error("API Error:", errorMessage);
    return Promise.reject(error); 
  }
);

export default api;