import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attach token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('bf_refresh_token');
      
      if (!refreshToken) {
        // No hay refresh token, redirigir a login
        isRefreshing = false;
        localStorage.removeItem('bf_token');
        localStorage.removeItem('bf_refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Intentar refrescar el token
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        
        // Guardar nuevo access token
        localStorage.setItem('bf_token', accessToken);
        
        // Actualizar header de la petición original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Procesar cola de peticiones fallidas
        processQueue(null, accessToken);
        
        isRefreshing = false;
        
        // Reintentar la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token inválido o expirado
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Limpiar tokens
        localStorage.removeItem('bf_token');
        localStorage.removeItem('bf_refresh_token');
        
        // Mostrar notificación
        const event = new CustomEvent('auth:expired', {
          detail: { message: 'Sesión expirada. Por favor inicia sesión nuevamente.' }
        });
        window.dispatchEvent(event);
        
        // Redirigir a login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
