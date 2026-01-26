import React, { useState, useRef } from 'react';
import {
  Upload, Camera, Car, Users, Fuel, Settings, Calendar,
  MapPin, DollarSign, CheckCircle, X, AlertCircle
} from 'lucide-react';

const CarListingForm = ({ user, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  // Nigerian states and cities
  const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'Federal Capital Territory', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const CAR_BRANDS = [
    'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Lexus', 'Audi',
    'Nissan', 'Ford', 'Volkswagen', 'Hyundai', 'Kia', 'Peugeot',
    'Mitsubishi', 'Mazda', 'Suzuki', 'Chery', 'Jaguar', 'Land Rover',
    'Range Rover', 'Porsche', 'Volvo', 'Jeep', 'Subaru', 'Infiniti'
  ];

  const CAR_MODELS = {
    'Toyota': ['Corolla', 'Camry', 'Highlander', 'Prado', 'Hilux', 'Rav4', 'Sienna', 'Avalon'],
    'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'HR-V', 'Odyssey'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'GLA', 'G-Wagon'],
    'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X6'],
    'Nissan': ['Almera', 'X-Trail', 'Pathfinder', 'Navara', 'Murano', 'Altima'],
  };

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleType: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCapacity: '',
    color: '',
    mileage: '',
    
    // Step 2: Details & Features
    seats: 5,
    features: [],
    description: '',
    
    // Step 3: Location & Pricing
    state: 'Lagos',
    city: '',
    exactLocation: '',
    dailyPrice: '',
    weeklyDiscount: 10,
    monthlyDiscount: 20,
    minimumRentalDays: 1,
    instantBook: true,
    
    // Step 4: Images
    images: {
      front: null,
      back: null,
      left: null,
      right: null,
      interior1: null,
      interior2: null,
      dashboard: null,
      engine: null,
    },
    
    // Step 5: Owner Info
    ownerName: user?.name || '',
    ownerPhone: user?.phone || '',
    ownerEmail: user?.email || '',
    availableFrom: '',
    availableTo: '',
    termsAccepted: false,
  });

  // Image upload handler
  const handleImageUpload = (position, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [position]: {
              file,
              preview: e.target.result,
              name: `${position}_${Date.now()}`
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.brand) newErrors.brand = 'Please select car brand';
      if (!formData.model) newErrors.model = 'Please enter car model';
      if (!formData.year || formData.year < 2000) newErrors.year = 'Please enter valid year';
      if (!formData.vehicleType) newErrors.vehicleType = 'Please select vehicle type';
      if (!formData.color) newErrors.color = 'Please enter car color';
    }
    
    if (step === 2) {
      if (formData.seats < 1) newErrors.seats = 'Please enter valid number of seats';
      if (!formData.description || formData.description.length < 50) {
        newErrors.description = 'Please provide detailed description (min. 50 characters)';
      }
    }
    
    if (step === 3) {
      if (!formData.dailyPrice || formData.dailyPrice < 1000) {
        newErrors.dailyPrice = 'Please enter valid daily price (min. ₦1,000)';
      }
      if (!formData.city) newErrors.city = 'Please enter city';
      if (!formData.exactLocation) newErrors.exactLocation = 'Please enter exact location';
    }
    
    if (step === 4) {
      const requiredImages = ['front', 'back', 'interior1'];
      requiredImages.forEach(img => {
        if (!formData.images[img]) newErrors.images = 'Please upload at least front, back and one interior image';
      });
    }
    
    if (step === 5) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
      if (!formData.availableFrom) newErrors.availableFrom = 'Please select availability start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // Final submission
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          Object.keys(formData.images).forEach(imgKey => {
            if (formData.images[imgKey]) {
              formDataToSend.append(`images[${imgKey}]`, formData.images[imgKey].file);
            }
          });
        } else if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cars/list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('Car listed successfully!');
        onSubmit && onSubmit(result.car);
        onClose && onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to list car');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Brand *
          </label>
          <select
            value={formData.brand}
            onChange={(e) => {
              setFormData({...formData, brand: e.target.value, model: ''});
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Brand</option>
            {CAR_BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model *
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Camry 2023"
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            min="2000"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type *
          </label>
          <select
            value={formData.vehicleType}
            onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Pickup Truck">Pickup Truck</option>
            <option value="Minivan">Minivan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Convertible">Convertible</option>
            <option value="Luxury">Luxury</option>
            <option value="Electric">Electric</option>
          </select>
          {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission *
          </label>
          <select
            value={formData.transmission}
            onChange={(e) => setFormData({...formData, transmission: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type *
          </label>
          <select
            value={formData.fuelType}
            onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engine Capacity (cc) *
          </label>
          <input
            type="number"
            min="800"
            max="8000"
            value={formData.engineCapacity}
            onChange={(e) => setFormData({...formData, engineCapacity: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 2000"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Black, White, Red"
          />
          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Mileage (km) *
        </label>
        <input
          type="number"
          min="0"
          value={formData.mileage}
          onChange={(e) => setFormData({...formData, mileage: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g., 50000"
        />
      </div>
    </div>
  );

  // Step 2: Features & Description
  const renderStep2 = () => {
    const availableFeatures = [
      'Air Conditioning', 'Power Steering', 'Power Windows', 'Power Door Locks',
      'Leather Seats', 'Sunroof/Moonroof', 'Navigation System', 'Bluetooth',
      'Apple CarPlay/Android Auto', 'Backup Camera', 'Parking Sensors',
      'Cruise Control', 'Keyless Entry', 'Push Button Start', 'Heated Seats',
      'Cooled Seats', 'Third Row Seating', 'Alloy Wheels', 'Roof Rack',
      'Towing Package', '4WD/AWD', 'Anti-lock Brakes', 'Airbags',
      'Stability Control', 'Blind Spot Monitor', 'Lane Departure Warning'
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Features & Description</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Seats *
          </label>
          <select
            value={formData.seats}
            onChange={(e) => setFormData({...formData, seats: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {[2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'seat' : 'seats'}</option>
            ))}
          </select>
          {errors.seats && <p className="text-red-500 text-sm mt-1">{errors.seats}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Features (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
            {availableFeatures.map(feature => (
              <label key={feature} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, features: [...formData.features, feature]});
                    } else {
                      setFormData({...formData, features: formData.features.filter(f => f !== feature)});
                    }
                  }}
                  className="rounded text-green-600"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
            <span className="text-gray-500 text-sm font-normal"> (Min. 50 characters)</span>
          </label>
          <textarea
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe your car's condition, special features, any dents or scratches, maintenance history, and anything else renters should know..."
          />
          <div className="flex justify-between mt-1">
            <span className={`text-sm ${formData.description.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
              {formData.description.length}/50 characters
            </span>
            <span className="text-gray-500 text-sm">
              {formData.description.length >= 50 ? '✓ Good description' : 'More details needed'}
            </span>
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>
    );
  };

  // Step 3: Location & Pricing
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Location & Pricing</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {NIGERIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City/Town *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Victoria Island, GRA, Bodija"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exact Location/Address *
          <span className="text-gray-500 text-sm font-normal"> (Will be shown to confirmed renters only)</span>
        </label>
        <input
          type="text"
          value={formData.exactLocation}
          onChange={(e) => setFormData({...formData, exactLocation: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g., 123 Allen Avenue, Ikeja"
        />
        {errors.exactLocation && <p className="text-red-500 text-sm mt-1">{errors.exactLocation}</p>}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Pricing Information</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Rental Price (₦) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                min="1000"
                step="500"
                value={formData.dailyPrice}
                onChange={(e) => setFormData({...formData, dailyPrice: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 25000"
              />
            </div>
            {errors.dailyPrice && <p className="text-red-500 text-sm mt-1">{errors.dailyPrice}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Discount %
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.weeklyDiscount}
                onChange={(e) => setFormData({...formData, weeklyDiscount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Weekly price: ₦{(formData.dailyPrice * 7 * (100 - formData.weeklyDiscount) / 100).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Discount %
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.monthlyDiscount}
                onChange={(e) => setFormData({...formData, monthlyDiscount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Monthly price: ₦{(formData.dailyPrice * 30 * (100 - formData.monthlyDiscount) / 100).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rental Days
            </label>
            <select
              value={formData.minimumRentalDays}
              onChange={(e) => setFormData({...formData, minimumRentalDays: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(days => (
                <option key={days} value={days}>{days} {days === 1 ? 'day' : 'days'}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.instantBook}
              onChange={(e) => setFormData({...formData, instantBook: e.target.checked})}
              className="rounded text-green-600"
            />
            <span className="text-gray-700">
              Enable Instant Book (Renters can book without your approval)
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  // Step 4: Photos
  const renderStep4 = () => {
    const imagePositions = [
      { key: 'front', label: 'Front View', required: true, description: 'Clear front view of the car' },
      { key: 'back', label: 'Back View', required: true, description: 'Clear back view showing taillights' },
      { key: 'left', label: 'Left Side', required: false, description: 'Driver side view' },
      { key: 'right', label: 'Right Side', required: false, description: 'Passenger side view' },
      { key: 'interior1', label: 'Interior Front', required: true, description: 'Front seats and dashboard' },
      { key: 'interior2', label: 'Interior Back', required: false, description: 'Back seats view' },
      { key: 'dashboard', label: 'Dashboard', required: false, description: 'Close-up of dashboard' },
      { key: 'engine', label: 'Engine Bay', required: false, description: 'Clean engine compartment' },
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Car Photos</h3>
        <p className="text-gray-600 mb-6">
          High-quality photos increase booking chances by up to 40%. 
          At least 3 photos are required (Front, Back, and Interior).
        </p>

        {errors.images && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.images}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePositions.map(({ key, label, required, description }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <div
                className={`relative h-40 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer group ${
                  formData.images[key] 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
                onClick={() => fileInputRefs.current[key]?.click()}
              >
                {formData.images[key] ? (
                  <>
                    <img
                      src={formData.images[key].preview}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Change Photo</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({
                          ...prev,
                          images: { ...prev.images, [key]: null }
                        }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">{description}</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={el => fileInputRefs.current[key] = el}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(key, e.target.files[0])}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-bold text-yellow-800 mb-2">📸 Photo Tips</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Use good lighting (outdoor daylight is best)</li>
            <li>• Clean the car before taking photos</li>
            <li>• Show all angles and any existing damages</li>
            <li>• Take interior photos with doors open</li>
            <li>• Photos should be clear and not blurry</li>
          </ul>
        </div>
      </div>
    );
  };

  // Step 5: Final Details
  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Final Details & Agreement</h3>
      
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Owner Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+234 800 000 0000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available From *
          </label>
          <input
            type="date"
            value={formData.availableFrom}
            onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          {errors.availableFrom && <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available To (Optional)
          </label>
          <input
            type="date"
            value={formData.availableTo}
            onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-60 overflow-y-auto">
        <h4 className="font-bold text-gray-900 mb-4">Terms & Conditions</h4>
        <div className="text-sm text-gray-600 space-y-3">
          <p><strong>1. Vehicle Condition:</strong> You certify that the vehicle is in good mechanical condition, has valid insurance, and passes all required inspections.</p>
          <p><strong>2. Rental Agreement:</strong> NaijaDrive will provide a standard rental agreement that you must accept for each booking.</p>
          <p><strong>3. Insurance:</strong> Your car must have comprehensive insurance. NaijaDrive provides supplemental insurance during rental periods.</p>
          <p><strong>4. Pricing:</strong> You set your own prices, but NaijaDrive charges a 15% commission on completed bookings.</p>
          <p><strong>5. Payments:</strong> Payments are processed through NaijaDrive and released to you 24 hours after successful car return.</p>
          <p><strong>6. Cancellations:</strong> You may cancel bookings with 24 hours notice. Excessive cancellations may result in penalties.</p>
          <p><strong>7. Maintenance:</strong> You are responsible for regular maintenance and repairs.</p>
          <p><strong>8. Verification:</strong> You authorize NaijaDrive to verify your identity, driving record, and vehicle documents.</p>
          <p><strong>9. Taxes:</strong> You are responsible for any applicable taxes on your earnings.</p>
        </div>
      </div>

      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
          className="mt-1 rounded text-green-600"
        />
        <div>
          <span className="text-gray-700">
            I have read and agree to the NaijaDrive Terms & Conditions, Privacy Policy, and Host Agreement. *
          </span>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
          )}
        </div>
      </label>
    </div>
  );

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List Your Car</h2>
              <p className="text-gray-600">Step {step} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${step >= 1 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                1. Basic Info
              </span>
              <span className={`text-sm ${step >= 2 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                2. Features
              </span>
              <span className={`text-sm ${step >= 3 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                3. Pricing
              </span>
              <span className={`text-sm ${step >= 4 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                4. Photos
              </span>
              <span className={`text-sm ${step >= 5 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                5. Finalize
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>
            
            <div className="flex space-x-4">
              {step < 5 ? (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Listing Your Car...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>List My Car</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarListingForm;