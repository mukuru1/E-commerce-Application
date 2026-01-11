import axios from "axios";

const BASE_URL = "https://dummyjson.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add Authorization header automatically if token exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
