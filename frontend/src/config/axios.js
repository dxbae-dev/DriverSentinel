// src/config/axios.js
import axios from "axios";

// Creamos la instancia apuntando al servidor de Node.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor: Antes de mandar cualquier petición, le inyectamos el Token
api.interceptors.request.use(
  (config) => {
    // Leemos el localStorage donde Zustand guardará el estado
    const authStorage = localStorage.getItem("ds-auth-storage");

    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
