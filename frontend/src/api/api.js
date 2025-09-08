import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // para enviar cookies automáticamente
});

// Flag para evitar múltiples refresh en paralelo
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response, // caso normal
  async (error) => {
    const originalRequest = error.config;

    // Si fue un 401 y no estamos intentando refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Esperar a que termine otro refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh"); // refrescar cookies/token
        processQueue(null);
        return api(originalRequest); // reintentar petición original
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
