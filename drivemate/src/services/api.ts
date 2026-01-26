// src/services/api.ts
import axios from 'axios';

// Base API URL - change this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (formData: FormData) => {
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  becomeHost: async () => {
    const response = await api.post('/auth/become-host');
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// ==================== CAR API ====================
export const carAPI = {
  searchCars: async (params?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    transmission?: string;
    fuelType?: string;
    seats?: number;
  }) => {
    const response = await api.get('/cars', { params });
    return response.data;
  },

  getCar: async (id: string) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  createCar: async (carData: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color?: string;
    transmission: string;
    fuelType: string;
    seats: number;
    doors?: number;
    features?: string[];
    dailyPrice: number;
    location: string;
    description?: string;
    instantBook?: boolean;
    minimumRentDays?: number;
    maximumRentDays?: number;
  }) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  getMyCars: async () => {
    const response = await api.get('/cars/my/list');
    return response.data;
  },

  updateCar: async (id: string, carData: any) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  uploadCarImages: async (carId: string, formData: FormData) => {
    const response = await api.post(`/cars/${carId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  toggleFavorite: async (carId: string) => {
    const response = await api.post(`/cars/${carId}/favorite`);
    return response.data;
  },
};

// ==================== BOOKING API ====================
export const bookingAPI = {
  calculatePrice: async (params: {
    carId: string;
    startDate: string;
    endDate: string;
  }) => {
    const response = await api.get('/bookings/calculate-price', { params });
    return response.data;
  },

  createBooking: async (bookingData: {
    car: string;
    startDate: string;
    endDate: string;
    pickUpLocation?: string;
    dropOffLocation?: string;
    specialRequests?: string;
  }) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  getHostBookings: async () => {
    const response = await api.get('/bookings/host');
    return response.data;
  },
};

// ==================== HELPER FUNCTIONS ====================
export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.error || error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;