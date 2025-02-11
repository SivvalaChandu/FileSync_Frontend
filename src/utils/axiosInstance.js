import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // Required for sending/receiving cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const newAccessToken =
      response.headers["Authorization"] || response.headers["authorization"];
    if (newAccessToken && !localStorage.getItem("access_token")) {
      localStorage.setItem("access_token", newAccessToken);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("access_token");
      if (!window.location.pathname.includes("/sign")) {
        window.location.href = "/sign";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
