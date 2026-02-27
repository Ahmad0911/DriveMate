import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Calendar, Star, ChevronRight, Menu, X, User, 
  Heart, Filter, Clock, Shield, DollarSign, Phone, Mail, Car, 
  CheckCircle, ChevronDown, CreditCard, Users, Battery, Fuel, 
  Settings, Bell, LogOut, Home, Briefcase, Map, Camera, Upload,
  Lock, Key, Eye, EyeOff, AlertCircle, MessageSquare, HelpCircle,
  Package, TrendingUp, BarChart, Users as UsersIcon, FileText,
  ShieldCheck, Globe, Smartphone, Wifi, Music, Thermometer,
  Zap, Droplets, Wind, Sun, Moon, Smartphone as PhoneIcon,
  Download  // ADD THIS
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  verified: boolean;
  phone?: string;
  location?: string;
  profileImage?: string;
  memberSince: string;
  preferredPayment?: string;
  notifications: Notification[];
  settings: UserSettings;
}

interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  privacyMode: boolean;
  language: string;
  currency: string;
}

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'system' | 'promotion' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface Owner {
  name: string;
  initials: string;
  rating: number;
  reviews: number;
  responseTime: string;
  joinedDate: string;
  languages: string[];
}

interface Car {
  id: number;
  name: string;
  type: string;
  images: {
    front: string;
    back: string;
    side: string;
    interior: string;
    dashboard: string;
  };
  price: number;
  location: string;
  rating: number;
  reviews: number;
  transmission: string;
  seats: number;
  verified: boolean;
  instantBook: boolean;
  electric?: boolean;
  features?: string[];
  owner?: Owner;
  specifications: {
    year: number;
    fuelType: string;
    engine: string;
    mileage: string;
    color: string;
    registration: string;
  };
  availability: {
    available: boolean;
    nextAvailable?: string;
  };
}

interface Trip {
  id: number;
  carName: string;
  carImage: string;
  date: string;
  total: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'active';
  pickupLocation: string;
  dropoffLocation: string;
  confirmationCode: string;
}

interface AdminStats {
  totalCars: number;
  totalUsers: number;
  totalBookings: number;
  revenue: number;
  pendingVerifications: number;
}

// Auth Modal Component with Google Sign-in
const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleGoogleSignIn = () => {
    // Simulate Google OAuth
    const googleUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      initials: 'GU',
      verified: true,
      phone: '+234 800 000 0000',
      location: 'Lagos, Nigeria',
      memberSince: new Date().toISOString().split('T')[0],
      notifications: [],
      settings: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false,
        twoFactorAuth: false,
        privacyMode: false,
        language: 'en',
        currency: 'NGN'
      }
    };
    
    localStorage.setItem('token', 'google-demo-token-123');
    localStorage.setItem('user', JSON.stringify(googleUser));
    onLogin(googleUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      id: 'user_' + Date.now(),
      name: isSignUp ? name : 'Premium User',
      email,
      initials: isSignUp ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'PU',
      verified: true,
      phone: isSignUp ? phone : '+234 800 000 0000',
      location: 'Lagos, Nigeria',
      memberSince: new Date().toISOString().split('T')[0],
      notifications: [],
      settings: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false,
        twoFactorAuth: false,
        privacyMode: false,
        language: 'en',
        currency: 'NGN'
      }
    };
    
    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(userData));
    onLogin(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isSignUp ? 'Join our premium car rental community' : 'Continue to your account'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-6 flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="+234 800 000 0000"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors pr-12"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters with letters and numbers
              </p>
            )}
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-green-600 hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Car Listing Form with Image Upload
const CarListingForm: React.FC<{
  user: User | null;
  onClose: () => void;
  onSubmit: (car: Car) => void;
}> = ({ user, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Executive Sedan',
    price: '',
    location: '',
    transmission: 'Automatic',
    seats: '5',
    instantBook: true,
    electric: false,
    year: new Date().getFullYear().toString(),
    fuelType: 'Petrol',
    engine: '',
    mileage: '',
    color: '',
    registration: '',
    description: ''
  });

  const [images, setImages] = useState({
    front: '',
    back: '',
    side: '',
    interior: '',
    dashboard: ''
  });

  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (type: keyof typeof images, file: File) => {
    setUploading(type);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setImages(prev => ({ ...prev, [type]: url }));
    setUploading(null);
  };

  const handleCapture = async (type: keyof typeof images) => {
    // Simulate camera capture
    const mockImages = {
      front: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
      side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    };
    
    setUploading(type);
    await new Promise(resolve => setTimeout(resolve, 800));
    setImages(prev => ({ ...prev, [type]: mockImages[type] }));
    setUploading(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCar: Car = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      images: {
        front: images.front || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        back: images.back || 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
        side: images.side || 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
        interior: images.interior || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        dashboard: images.dashboard || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
      },
      price: parseInt(formData.price),
      location: formData.location,
      rating: 5.0,
      reviews: 0,
      transmission: formData.transmission,
      seats: parseInt(formData.seats),
      verified: false,
      instantBook: formData.instantBook,
      electric: formData.electric,
      features: formData.electric ? ['Electric Vehicle', 'Fast Charging', 'Regenerative Braking'] : ['Air Conditioning', 'Bluetooth', 'Navigation'],
      owner: {
        name: user?.name || 'You',
        initials: user?.initials || 'YO',
        rating: 5.0,
        reviews: 0,
        responseTime: 'Under 1 hour',
        joinedDate: new Date().toISOString().split('T')[0],
        languages: ['English', 'Yoruba']
      },
      specifications: {
        year: parseInt(formData.year),
        fuelType: formData.fuelType,
        engine: formData.engine,
        mileage: formData.mileage,
        color: formData.color,
        registration: formData.registration
      },
      availability: {
        available: true,
        nextAvailable: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      }
    };

    onSubmit(newCar);
  };

  const ImageUploadSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Car Photos</h3>
      <p className="text-gray-600 mb-6">Upload clear photos of your car from all angles</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { type: 'front' as const, label: 'Front View', desc: 'Clear front view of the car' },
          { type: 'back' as const, label: 'Rear View', desc: 'Clear rear view including plate' },
          { type: 'side' as const, label: 'Side View', desc: 'Side profile showing condition' },
          { type: 'interior' as const, label: 'Interior', desc: 'Front seats and dashboard' },
          { type: 'dashboard' as const, label: 'Dashboard', desc: 'Instrument cluster and controls' }
        ].map(({ type, label, desc }) => (
          <div key={type} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors group">
              {images[type] ? (
                <div className="relative w-full h-full">
                  <img
                    src={images[type]}
                    alt={label}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(prev => ({ ...prev, [type]: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {uploading === type ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mb-2 group-hover:text-green-500" />
                      <p className="text-sm text-gray-500 text-center">{desc}</p>
                      <div className="flex space-x-2 mt-3">
                        <label className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 cursor-pointer">
                          <Upload className="w-3 h-3 inline mr-1" />
                          Upload
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(type, e.target.files[0])}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleCapture(type)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                        >
                          <Camera className="w-3 h-3 inline mr-1" />
                          Capture
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CarDetailsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Car Name & Model *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="Toyota Camry 2023"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Car Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          required
        >
          <option value="Executive Sedan">Executive Sedan</option>
          <option value="Luxury SUV">Luxury SUV</option>
          <option value="Family SUV">Family SUV</option>
          <option value="Premium Pickup">Premium Pickup</option>
          <option value="Economy Car">Economy Car</option>
          <option value="Sports Car">Sports Car</option>
          <option value="Electric Vehicle">Electric Vehicle</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Price (₦) *
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="35000"
          required
          min="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <select
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          required
        >
          <option value="">Select a city</option>
          {NIGERIAN_CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year *
        </label>
        <select
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          required
        >
          {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Type *
        </label>
        <select
          value={formData.fuelType}
          onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          required
        >
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Engine Capacity *
        </label>
        <input
          type="text"
          value={formData.engine}
          onChange={(e) => setFormData({...formData, engine: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="2.0L, 4-cylinder"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mileage (km) *
        </label>
        <input
          type="text"
          value={formData.mileage}
          onChange={(e) => setFormData({...formData, mileage: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="45,000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color *
        </label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({...formData, color: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="Pearl White"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registration Number *
        </label>
        <input
          type="text"
          value={formData.registration}
          onChange={(e) => setFormData({...formData, registration: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="ABC-123-XX"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          rows={3}
          placeholder="Describe your car's features, condition, and any special notes..."
        />
      </div>
    </div>
  );

  const AdditionalFeaturesSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission *
          </label>
          <select
            value={formData.transmission}
            onChange={(e) => setFormData({...formData, transmission: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            required
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Seats *
          </label>
          <select
            value={formData.seats}
            onChange={(e) => setFormData({...formData, seats: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            required
          >
            <option value="2">2 seats</option>
            <option value="4">4 seats</option>
            <option value="5">5 seats</option>
            <option value="7">7 seats</option>
            <option value="8">8+ seats</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="electric"
            checked={formData.electric}
            onChange={(e) => setFormData({...formData, electric: e.target.checked})}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="electric" className="text-sm text-gray-700">
            This is an electric vehicle
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="instantBook"
            checked={formData.instantBook}
            onChange={(e) => setFormData({...formData, instantBook: e.target.checked})}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="instantBook" className="text-sm text-gray-700">
            Enable instant booking (Recommended)
          </label>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-semibold text-green-800 mb-2">📈 Earnings Estimate</h4>
        <p className="text-green-700 text-sm">
          Based on similar cars in {formData.location}, you could earn approximately{' '}
          <span className="font-bold">₦{parseInt(formData.price || '0') * 20} monthly</span>.
        </p>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Photos', component: <ImageUploadSection /> },
    { number: 2, title: 'Details', component: <CarDetailsSection /> },
    { number: 3, title: 'Features', component: <AdditionalFeaturesSection /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List Your Car</h2>
              <p className="text-gray-600 mt-1">Earn money by sharing your car with trusted renters</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepItem.number 
                      ? 'bg-green-600 text-white' 
                      : step > stepItem.number 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > stepItem.number ? <CheckCircle className="w-4 h-4" /> : stepItem.number}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step === stepItem.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {steps[step - 1].component}

          <div className="pt-8 border-t border-gray-100 mt-8">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step < steps.length ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  List Your Car
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel: React.FC<{
  user: User | null;
  onClose: () => void;
  stats: AdminStats;
  cars: Car[];
  trips: Trip[];
}> = ({ user, onClose, stats, cars, trips }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex space-x-1 mt-6 p-1 bg-gray-100 rounded-lg">
            {['dashboard', 'cars', 'bookings', 'users', 'reports', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Cars</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCars}</p>
                    </div>
                    <Car className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-blue-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <UsersIcon className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+8% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Bookings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-purple-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-purple-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+15% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">₦{stats.revenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-amber-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+20% from last month</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {trips.slice(0, 5).map(trip => (
                      <div key={trip.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img src={trip.carImage} alt={trip.carName} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">{trip.carName}</p>
                            <p className="text-sm text-gray-500">{trip.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{trip.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            trip.status === 'active' ? 'bg-green-100 text-green-800' :
                            trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Pending Verifications</h3>
                  <div className="space-y-4">
                    {cars.filter(c => !c.verified).slice(0, 3).map(car => (
                      <div key={car.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img src={car.images.front} alt={car.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">{car.name}</p>
                            <p className="text-sm text-gray-500">{car.location}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                            Verify
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {cars.filter(c => !c.verified).length === 0 && (
                      <p className="text-center text-gray-500 py-8">No pending verifications</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">System Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Maintenance Mode
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input type="checkbox" id="maintenance" className="sr-only" />
                        <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                      </div>
                      <span className="text-sm text-gray-600">Enable maintenance mode</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      defaultValue="15"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>5%</span>
                      <span className="font-medium">15%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-approval Threshold
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>₦0 - ₦50,000 (Manual Review)</option>
                      <option>₦50,001 - ₦200,000 (Auto-approve)</option>
                      <option>All amounts (Auto-approve)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Profile & Settings Component
const ProfileSettings: React.FC<{
  user: User | null;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}> = ({ user, onClose, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    profileImage: user?.profileImage || ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.settings?.twoFactorAuth || false);

  const handleProfileUpdate = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...profileData,
        initials: profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      onUpdateUser(updatedUser);
      alert('Profile updated successfully');
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (user) {
      const updatedUser = {
        ...user,
        settings: {
          ...user.settings,
          twoFactorAuth: !twoFactorEnabled
        }
      };
      onUpdateUser(updatedUser);
      alert(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-1">
            {['profile', 'security', 'notifications', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.profileImage ? (
                      <img src={profileData.profileImage} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      user?.initials || 'PU'
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <select
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select location</option>
                        {NIGERIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Account Status</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{user?.memberSince || '2024-01-01'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verification Status</p>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium text-gray-900">Premium Member</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Password & Security</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                        placeholder="Enter current password"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                        placeholder="Enter new password"
                      />
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                        placeholder="Confirm new password"
                      />
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handlePasswordChange}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      checked={twoFactorEnabled}
                      onChange={handleTwoFactorToggle}
                      className="sr-only"
                    />
                    <label
                      htmlFor="twoFactor"
                      className={`block w-14 h-8 rounded-full cursor-pointer transition-colors ${
                        twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`dot absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'left-7' : 'left-1'
                      }`}></div>
                    </label>
                  </div>
                </div>
                {twoFactorEnabled && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when signing in.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-red-700 mb-6">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Delete Account</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      Delete Account
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Logout from all devices</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Sign out from all devices where you're currently signed in
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Logout All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your bookings and account</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="block w-14 h-8 bg-green-600 rounded-full"></div>
                      <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="block w-14 h-8 bg-green-600 rounded-full"></div>
                      <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive promotions and special offers</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="block w-14 h-8 bg-gray-300 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Booking Reminders</p>
                      <p className="text-sm text-gray-600">Reminders about upcoming bookings</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="block w-14 h-8 bg-green-600 rounded-full"></div>
                      <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Recent Notifications</h3>
                <div className="space-y-3">
                  {user?.notifications?.slice(0, 5).map(notification => (
                    <div key={notification.id} className={`p-4 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      </div>
                      {!notification.read && (
                        <div className="flex justify-end mt-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>West Africa Time (UTC+1)</option>
                      <option>GMT (UTC+0)</option>
                      <option>Central European Time (UTC+1)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Nigerian Naira (₦)</option>
                      <option>US Dollar ($)</option>
                      <option>Euro (€)</option>
                      <option>British Pound (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Profile Visibility</p>
                      <p className="text-sm text-gray-600">Control who can see your profile</p>
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Public</option>
                      <option>Only verified users</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Activity Sharing</p>
                      <p className="text-sm text-gray-600">Share your activity with other users</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="block w-14 h-8 bg-gray-300 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Data Collection</p>
                      <p className="text-sm text-gray-600">Allow anonymous data collection for improvements</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="block w-14 h-8 bg-green-600 rounded-full"></div>
                      <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Header Component
const Header: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  user: User | null;
  onAuthModalOpen: () => void;
  onListCarClick: () => void;
  onLogout: () => void;
  onProfileSettingsOpen: () => void;
  notifications: Notification[];
  isAdmin?: boolean;           // ADD THIS
  onAdminPanelOpen?: () => void;  // ADD THIS
}> = ({ 
  activeTab, 
  setActiveTab, 
  menuOpen, 
  setMenuOpen, 
  user,
  onAuthModalOpen,
  onListCarClick,
  onLogout,
  onProfileSettingsOpen,
  notifications,
  isAdmin,              // ADD THIS
  onAdminPanelOpen     // ADD THIS
}) => {
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Car className="w-10 h-10 text-green-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent tracking-tight">
                NaijaDrive Pro
              </span>
              <div className="flex items-center space-x-1 mt-[-4px]">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Premium Service</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex space-x-1">
            {['rent', 'trips', 'list'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all duration-200 rounded-lg ${
                  activeTab === tab
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab === 'rent' && 'Rent a Car'}
                {tab === 'list' && 'List Your Car'}
                {tab === 'trips' && 'My Trips'}
              </button>
            ))}
          </nav>

               <div className="hidden lg:flex items-center space-x-4">
  {user ? (
    <div className="flex items-center space-x-4">
      {/* ADD THIS ADMIN BUTTON */}
      {isAdmin && onAdminPanelOpen && (
        <button
          onClick={onAdminPanelOpen}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
      )}
      {/* END OF ADMIN BUTTON */}
      
      <div className="relative group">
        <button className="relative p-2.5 text-gray-600 hover:text-green-600 transition-colors hover:bg-green-50 rounded-xl">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">{unreadNotifications} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map(notification => (
                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'booking' ? 'bg-green-100' :
                              notification.type === 'security' ? 'bg-red-100' :
                              notification.type === 'promotion' ? 'bg-purple-100' :
                              'bg-blue-100'
                            }`}>
                              {notification.type === 'booking' && <Calendar className="w-4 h-4" />}
                              {notification.type === 'security' && <Shield className="w-4 h-4" />}
                              {notification.type === 'promotion' && <DollarSign className="w-4 h-4" />}
                              {notification.type === 'system' && <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <button className="text-sm text-green-600 hover:text-green-700 w-full text-center py-2">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={onProfileSettingsOpen}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile & Settings</span>
                      </button>
                      <a href="#" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <CreditCard className="w-4 h-4" />
                        <span>Payment Methods</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Shield className="w-4 h-4" />
                        <span>Security</span>
                      </a>
                      <div className="border-t my-1"></div>
                      <button 
                        onClick={onLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onAuthModalOpen}
                  className="px-5 py-2.5 text-gray-700 font-medium hover:text-green-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button 
                  onClick={onAuthModalOpen}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md hover:shadow-green-500/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

// Enhanced Car Card Component
const CarCard: React.FC<{
  car: Car;
  isFavorite: boolean;
  onToggleFavorite: (carId: number) => void;
  onSelect: (car: Car) => void;
}> = ({ car, isFavorite, onToggleFavorite, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200"
      onClick={() => onSelect(car)}
    >
      <div className="relative h-64 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
        )}
        <img
          src={car.images.front}
          alt={car.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(car.id);
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          />
        </button>
        
        {car.instantBook && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 backdrop-blur-sm z-10">
            <Clock className="w-3 h-3" />
            <span>INSTANT BOOK</span>
          </div>
        )}
        
        {!car.availability.available && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg backdrop-blur-sm z-10">
            UNAVAILABLE
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">{car.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                <Car className="w-3 h-3" />
                <span>{car.type}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                <Users className="w-3 h-3" />
                <span>{car.seats} seats</span>
              </div>
              {car.electric && (
                <div className="flex items-center space-x-1 text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                  <Zap className="w-3 h-3" />
                  <span>Electric</span>
                </div>
              )}
            </div>
          </div>
          {car.verified && (
            <div className="relative group" title="Verified & Verified">
              <Shield className="w-6 h-6 text-green-600" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Verified Vehicle
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900">{car.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({car.reviews} reviews)</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {car.location}
          </div>
        </div>

        <div className="pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">₦{car.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">/day</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {car.availability.available ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Available now</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-gray-500">Available {car.availability.nextAvailable}</span>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(car);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!car.availability.available}
            >
              <span>Select</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Car Detail Modal
const CarDetailModal: React.FC<{
  car: Car;
  onClose: () => void;
  onBook: () => void;
}> = ({ car, onClose, onBook }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [selectedImage, setSelectedImage] = useState<string>(car.images.front);
  const [bookingDates, setBookingDates] = useState({
    pickup: new Date().toISOString().split('T')[0],
    return: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const imageTypes = [
    { key: 'front', label: 'Front View' },
    { key: 'back', label: 'Rear View' },
    { key: 'side', label: 'Side View' },
    { key: 'interior', label: 'Interior' },
    { key: 'dashboard', label: 'Dashboard' }
  ];

  const calculateTotal = () => {
    const pickupDate = new Date(bookingDates.pickup);
    const returnDate = new Date(bookingDates.return);
    const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.price;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <Map className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
          {/* Left Column - Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedImage}
                alt={car.name}
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {imageTypes.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedImage(car.images[key as keyof typeof car.images])}
                  className={`relative aspect-square rounded-xl overflow-hidden group ${
                    selectedImage === car.images[key as keyof typeof car.images] 
                      ? 'ring-2 ring-green-500' 
                      : 'hover:ring-2 hover:ring-green-300'
                  }`}
                  title={label}
                >
                  <img
                    src={car.images[key as keyof typeof car.images]}
                    alt={label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {car.electric && (
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        ELECTRIC
                      </div>
                    )}
                    <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      PREMIUM
                    </div>
                    {car.instantBook && (
                      <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        INSTANT BOOK
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{car.name}</h2>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{car.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({car.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{car.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    ₦{car.price.toLocaleString()}<span className="text-gray-500 text-lg">/day</span>
                  </div>
                  <div className="text-sm text-gray-500">Includes insurance & fees</div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-1 mb-8 p-1 bg-gray-100 rounded-xl">
                {['overview', 'specs', 'features', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
                      selectedTab === tab
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Calendar */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Select Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.pickup}
                    onChange={(e) => setBookingDates({...bookingDates, pickup: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.return}
                    onChange={(e) => setBookingDates({...bookingDates, return: e.target.value})}
                    min={bookingDates.pickup}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Estimated total for {Math.ceil((new Date(bookingDates.return).getTime() - new Date(bookingDates.pickup).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₦{calculateTotal().toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Daily rate</p>
                    <p className="font-medium text-gray-900">₦{car.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Car className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Transmission</span>
                    </div>
                    <p className="text-gray-700">{car.transmission}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Capacity</span>
                    </div>
                    <p className="text-gray-700">{car.seats} passengers</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      {car.electric ? <Battery className="w-5 h-5 text-green-600" /> : <Fuel className="w-5 h-5 text-green-600" />}
                      <span className="font-semibold text-gray-900">{car.electric ? 'Range' : 'Fuel'}</span>
                    </div>
                    <p className="text-gray-700">{car.electric ? '350 km (full charge)' : car.specifications.fuelType}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Status</span>
                    </div>
                    <p className="text-gray-700">{car.availability.available ? 'Available Now' : `Available from ${car.availability.nextAvailable}`}</p>
                  </div>
                </div>

                {/* Included Features */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-100 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-green-600" />
                    Everything Included
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Insurance coverage', '24/7 Roadside assistance', 'Free cancellation', 'Unlimited mileage', 'No hidden fees', 'Contactless pickup'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Info */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="font-bold text-gray-900 mb-4">Meet Your Host</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {car.owner?.initials || 'JS'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{car.owner?.name || 'John Smith'}</p>
                          <p className="text-sm text-gray-500">Superhost • {car.owner?.rating.toFixed(1)} ⭐ ({car.owner?.reviews} reviews)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Response time</p>
                          <p className="font-semibold text-gray-900">{car.owner?.responseTime || 'Under 1 hour'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium text-gray-900">{car.specifications.year}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Engine</p>
                    <p className="font-medium text-gray-900">{car.specifications.engine}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-medium text-gray-900">{car.specifications.mileage} km</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-medium text-gray-900">{car.specifications.color}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Registration</p>
                    <p className="font-medium text-gray-900">{car.specifications.registration}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium text-gray-900">{car.specifications.fuelType}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-8 mt-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>Message Host</span>
                </button>
                <button 
                  onClick={onBook}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Book This Car</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nigerian Cities Data
const NIGERIAN_CITIES = [
  'Abuja (FCT)', 'Lagos', 'Ibadan', 'Port Harcourt', 'Kano', 'Benin City',
  'Ilorin', 'Abeokuta', 'Jos', 'Enugu', 'Owerri', 'Calabar', 'Uyo',
  'Warri', 'Kaduna', 'Maiduguri', 'Sokoto', 'Akure', 'Ado-Ekiti', 'Asaba'
];

// Main Enhanced Component
const AdminDashboard = AdminPanel;
const DriveMatePro: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('rent');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = user?.email?.includes('admin') || user?.email === 'admin@naijadrive.ng';

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Toyota Camry has been confirmed',
      timestamp: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on your next booking',
      timestamp: '2 hours ago',
      read: true
    },
    {
      id: '3',
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from Lagos, Nigeria',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      message: 'New features available in your dashboard',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const [adminStats] = useState<AdminStats>({
    totalCars: 156,
    totalUsers: 2450,
    totalBookings: 892,
    revenue: 15600000,
    pendingVerifications: 12
  });

  // Mock data
  const nigerianCars: Car[] = [
    {
      id: 1,
      name: 'Toyota Camry 2023',
      type: 'Executive Sedan',
      images: {
        front: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
        side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
        interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
      },
      price: 35000,
      location: 'Lagos, VI',
      rating: 4.9,
      reviews: 128,
      transmission: 'Automatic',
      seats: 5,
      verified: true,
      instantBook: true,
      electric: false,
      features: ['Bluetooth', 'Navigation', 'Leather Seats', 'Sunroof'],
      owner: {
        name: 'Adebayo Williams',
        initials: 'AW',
        rating: 4.9,
        reviews: 245,
        responseTime: 'Under 1 hour',
        joinedDate: '2022-03-15',
        languages: ['English', 'Yoruba']
      },
      specifications: {
        year: 2023,
        fuelType: 'Petrol',
        engine: '2.5L 4-cylinder',
        mileage: '15,000',
        color: 'Pearl White',
        registration: 'LAG-123-AB'
      },
      availability: {
        available: true,
        nextAvailable: new Date().toISOString().split('T')[0]
      }
    },
    // Add more cars with the new structure...
  ];

  useEffect(() => {
    setSearchResults(nigerianCars);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully');
  };

  const handleListCarClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setListingModalOpen(true);
    }
  };

  const handleCarSubmit = (car: Car) => {
    setSearchResults(prev => [car, ...prev]);
    setListingModalOpen(false);
    alert('Car listed successfully! Pending verification.');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const toggleFavorite = (carId: number) => {
    setFavorites(prev => 
      prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]
    );
  };

  const handleBookCar = (car: Car) => {
    alert(`Booking ${car.name} for ₦${car.price.toLocaleString()}/day`);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  user={user}
  onAuthModalOpen={() => setAuthModalOpen(true)}
  onListCarClick={handleListCarClick}
  onLogout={handleLogout}
  onProfileSettingsOpen={() => setProfileModalOpen(true)}
  notifications={notifications}
  isAdmin={isAdmin}                              // ADD THIS
  onAdminPanelOpen={() => setAdminPanelOpen(true)}  // ADD THIS
/>

      {activeTab === 'rent' && (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">5,000+ verified cars across Nigeria</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  Premium Car Rentals
                  <span className="block text-green-300">Across Nigeria</span>
                </h1>
                <p className="text-xl text-green-200 mb-12 max-w-2xl">
                  Experience luxury, safety, and convenience with our verified fleet of premium vehicles.
                </p>
              </div>
            </div>
          </div>

          {/* Available Cars Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Premium Fleet</h2>
                <p className="text-gray-600 mt-2">{searchResults.length} verified cars available nationwide</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                </button>
                <select className="px-5 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Most Popular</option>
                </select>
                {isAdmin && (
                  <button
                    onClick={() => setAdminPanelOpen(true)}
                    className="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    isFavorite={favorites.includes(car.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={setSelectedCar}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'trips' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Trips</h1>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                <p className="text-gray-700">You have no upcoming trips. Start by booking a car!</p>
                <button 
                  onClick={() => setActiveTab('rent')}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Browse Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Car</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Earn up to ₦500,000 monthly by sharing your car with verified renters. 
              We handle insurance, verification, and payments.
            </p>
            <button
              onClick={handleListCarClick}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
            >
              Start Listing Now
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fully Insured</h3>
                <p className="text-gray-600">Comprehensive insurance coverage for peace of mind</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Guanteed Earnings</h3>
                <p className="text-gray-600">Competitive pricing and guaranteed monthly earnings</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Verified Renters</h3>
                <p className="text-gray-600">All renters are verified and reviewed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {listingModalOpen && (
        <CarListingForm
          user={user}
          onClose={() => setListingModalOpen(false)}
          onSubmit={handleCarSubmit}
        />
      )}

      {profileModalOpen && user && (
        <ProfileSettings
          user={user}
          onClose={() => setProfileModalOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {adminPanelOpen && isAdmin && (
        <AdminPanel
          user={user}
          onClose={() => setAdminPanelOpen(false)}
          stats={adminStats}
          cars={searchResults}
          trips={[]}
        />
      )}

      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onBook={() => handleBookCar(selectedCar)}
        />
      )}

      {adminPanelOpen && isAdmin && (
  <AdminDashboard
    user={user}
    onClose={() => setAdminPanelOpen(false)}
    stats={adminStats}
    cars={searchResults}
    trips={[]}
  />
)}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Car className="w-10 h-10 text-green-400" />
                <span className="text-2xl font-bold">NaijaDrive Pro</span>
              </div>
              <p className="text-gray-400 mb-6">
                Nigeria's premier car rental platform. Premium vehicles, verified hosts, unparalleled service.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© 2024 NaijaDrive Pro. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400">🇳🇬 Made for Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DriveMatePro;