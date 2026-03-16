import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-3-production-7c6c.up.railway.app/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;