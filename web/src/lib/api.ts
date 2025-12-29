import axios, { AxiosInstance, AxiosError } from 'axios';

// API base URL - defaults to localhost:5000, can be overridden with env variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Types
export interface Device {
  id: string;
  name: string;
  riskScore: number;
  lastActive: string;
  isActive: boolean;
  type?: string;
  osVersion?: string;
  batteryLevel?: number;
  connectionType?: string;
  owner?: string;
  totalScreenTime?: string;
}

export interface Token {
  id: string;
  token: string;
  isActive: boolean;
  hasDeviceConnected: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDevices: number;
  totalScreenTime: string;
  averageRiskScore: number;
}

export interface DeviceDetail {
  device: {
    id: string;
    name: string;
    type: string;
    riskScore: number;
    lastActive: string;
    totalScreenTime: string;
    osVersion: string;
    batteryLevel: number;
    isActive: boolean;
    connectionType: string;
    owner: string;
  };
  blockedContent: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  activityLogs: Array<{
    time: string;
    action: string;
    riskLevel: 'low' | 'medium' | 'high';
    details: string;
  }>;
  timeUsage: Array<{
    app: string;
    category: string;
    minutes: number;
    percentage: number;
  }>;
}

// API functions

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Token API
export const tokenAPI = {
  getAll: async (): Promise<Token[]> => {
    const response = await api.get('/api/token');
    return response.data;
  },
  getById: async (id: string): Promise<Token> => {
    const response = await api.get(`/api/token/${id}`);
    return response.data;
  },
  create: async (expiryInDays: number): Promise<Token> => {
    const response = await api.post('/api/token', { expiryInDays });
    return response.data;
  },
  update: async (id: string, data: { expiryInDays?: number; isActive?: boolean }): Promise<Token> => {
    const response = await api.put(`/api/token/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/token/${id}`);
  },
};

// Device API
export const deviceAPI = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get('/api/device');
    return response.data;
  },
  getById: async (id: string): Promise<Device> => {
    const response = await api.get(`/api/device/${id}`);
    return response.data;
  },
  getDetails: async (id: string): Promise<DeviceDetail> => {
    const response = await api.get(`/api/device/${id}/details`);
    return response.data;
  },
  create: async (data: {
    name: string;
    type: string;
    tokenId: string;
    osVersion?: string;
    connectionType?: string;
    owner?: string;
  }): Promise<Device> => {
    const response = await api.post('/api/device', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Device>): Promise<Device> => {
    const response = await api.put(`/api/device/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/device/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },
  getDevices: async (): Promise<Device[]> => {
    const response = await api.get('/api/dashboard/devices');
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;

