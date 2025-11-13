import axiosInstance from './axios';

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

// Clients API
export const clientsAPI = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/clients', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await axiosInstance.post('/clients', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axiosInstance.put(`/clients/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axiosInstance.delete(`/clients/${id}`);
    return response.data;
  }
};

// Sales API
export const salesAPI = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/sales', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`/sales/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await axiosInstance.post('/sales', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axiosInstance.put(`/sales/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axiosInstance.delete(`/sales/${id}`);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getSummary: async (params = {}) => {
    const response = await axiosInstance.get('/reports/summary', { params });
    return response.data;
  },
  
  exportReport: async (params = {}) => {
    const response = await axiosInstance.get('/reports/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  getTopClients: async (params = {}) => {
    const response = await axiosInstance.get('/reports/top-clients', { params });
    return response.data;
  },

  getTrends: async () => {
    const response = await axiosInstance.get('/reports/trends');
    return response.data;
  },

  getSalesByIndustry: async () => {
    const response = await axiosInstance.get('/reports/by-industry');
    return response.data;
  }
};
