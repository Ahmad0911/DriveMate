import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'owner' | 'admin';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface ICar {
  _id: string;
  owner: string; // User ID
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  seats: number;
  pricePerDay: number;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  features: string[];
  availability: boolean;
  status: 'available' | 'booked' | 'maintenance';
  rating?: number;
  createdAt: Date;
}

export interface IBooking {
  _id: string;
  user: string; // User ID
  car: string; // Car ID
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  pickupLocation?: string;
  dropoffLocation?: string;
  createdAt: Date;
}

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUser;
}