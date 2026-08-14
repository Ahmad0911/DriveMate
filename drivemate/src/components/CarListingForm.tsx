import React, { useState } from 'react';
import { Camera, CheckCircle, X, AlertCircle } from 'lucide-react';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono2 { font-family: 'JetBrains Mono', monospace; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const CAR_BRANDS = [
  'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Lexus', 'Audi', 'Nissan', 'Ford', 'Volkswagen',
  'Hyundai', 'Kia', 'Peugeot', 'Mitsubishi', 'Mazda', 'Suzuki', 'Chery', 'Jaguar', 'Land Rover',
  'Range Rover', 'Porsche', 'Volvo', 'Jeep', 'Subaru', 'Infiniti'
];

const STEP_LABELS = ['Basic info', 'Features', 'Pricing', 'Photos', 'Finalize'];

const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>
);
const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none font-body transition-colors";
const FieldError = ({ children }) => children ? <p className="text-rose-500 text-xs mt-1 font-body">{children}</p> : null;

export default function CarListingForm({ user, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', message }
  const fileInputRefs = React.useRef({});

  const [formData, setFormData] = useState({
    brand: '', model: '', year: new Date().getFullYear(), vehicleType: '',
    transmission: 'Automatic', fuelType: 'Petrol', engineCapacity: '', color: '', mileage: '',
    seats: 5, features: [], description: '',
    state: 'Lagos', city: '', exactLocation: '', dailyPrice: '', weeklyDiscount: 10,
    monthlyDiscount: 20, minimumRentalDays: 1, instantBook: true,
    images: { front: null, back: null, left: null, right: null, interior1: null, interior2: null, dashboard: null, engine: null },
    ownerName: user?.name || '', ownerPhone: user?.phone || '', ownerEmail: user?.email || '',
    availableFrom: '', availableTo: '', termsAccepted: false
  });

  const handleImageUpload = (position, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, images: { ...prev.images, [position]: { file, preview: e.target.result, name: `${position}_${Date.now()}` } } }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.brand) e.brand = 'Please select a car brand';
      if (!formData.model) e.model = 'Please enter the car model';
      if (!formData.year || formData.year < 2000) e.year = 'Please enter a valid year';
      if (!formData.vehicleType) e.vehicleType = 'Please select a vehicle type';
      if (!formData.color) e.color = 'Please enter the car color';
    }
    if (step === 2) {
      if (formData.seats < 1) e.seats = 'Please enter a valid number of seats';
      if (!formData.description || formData.description.length < 50) e.description = 'Please provide a detailed description (min. 50 characters)';
    }
    if (step === 3) {
      if (!formData.dailyPrice || formData.dailyPrice < 1000) e.dailyPrice = 'Please enter a valid daily price (min. ₦1,000)';
      if (!formData.city) e.city = 'Please enter a city';
      if (!formData.exactLocation) e.exactLocation = 'Please enter the exact location';
    }
    if (step === 4) {
      const required = ['front', 'back', 'interior1'];
      if (required.some(img => !formData.images[img])) e.images = 'Please upload at least front, back, and one interior image';
    }
    if (step === 5) {
      if (!formData.termsAccepted) e.termsAccepted = 'You must accept the terms';
      if (!formData.availableFrom) e.availableFrom = 'Please select an availability start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 5) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setBanner(null);
    try {
      const body = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          Object.keys(formData.images).forEach(imgKey => {
            if (formData.images[imgKey]) body.append(`images[${imgKey}]`, formData.images[imgKey].file);
          });
        } else if (key === 'features') {
          body.append(key, JSON.stringify(formData[key]));
        } else {
          body.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cars/list', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body
      });

      if (response.ok) {
        const result = await response.json();
        setBanner({ type: 'success', message: 'Car listed successfully! It will appear once reviewed.' });
        setTimeout(() => { onSubmit && onSubmit(result.car); onClose && onClose(); }, 1200);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to list car');
      }
    } catch (error) {
      setBanner({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-bold text-slate-900">Basic information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Car brand *</FieldLabel>
          <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })} className={inputCls}>
            <option value="">Select brand</option>
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <FieldError>{errors.brand}</FieldError>
        </div>
        <div>
          <FieldLabel>Model *</FieldLabel>
          <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className={inputCls} placeholder="e.g., Camry 2023" />
          <FieldError>{errors.model}</FieldError>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Year *</FieldLabel>
          <input type="number" min="2000" max={new Date().getFullYear() + 1} value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className={inputCls} />
          <FieldError>{errors.year}</FieldError>
        </div>
        <div>
          <FieldLabel>Vehicle type *</FieldLabel>
          <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className={inputCls}>
            <option value="">Select type</option>
            {['Sedan', 'SUV', 'Pickup Truck', 'Minivan', 'Hatchback', 'Convertible', 'Luxury', 'Electric'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <FieldError>{errors.vehicleType}</FieldError>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Transmission *</FieldLabel>
          <select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className={inputCls}>
            {['Automatic', 'Manual', 'Semi-Automatic'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Fuel type *</FieldLabel>
          <select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className={inputCls}>
            {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Engine capacity (cc) *</FieldLabel>
          <input type="number" min="800" max="8000" value={formData.engineCapacity} onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })} className={inputCls} placeholder="e.g., 2000" />
        </div>
        <div>
          <FieldLabel>Color *</FieldLabel>
          <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className={inputCls} placeholder="e.g., Black, White, Red" />
          <FieldError>{errors.color}</FieldError>
        </div>
      </div>
      <div>
        <FieldLabel>Current mileage (km) *</FieldLabel>
        <input type="number" min="0" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className={inputCls} placeholder="e.g., 50000" />
      </div>
    </div>
  );

  const renderStep2 = () => {
    const availableFeatures = [
      'Air Conditioning', 'Power Steering', 'Power Windows', 'Power Door Locks', 'Leather Seats',
      'Sunroof/Moonroof', 'Navigation System', 'Bluetooth', 'Apple CarPlay/Android Auto',
      'Backup Camera', 'Parking Sensors', 'Cruise Control', 'Keyless Entry', 'Push Button Start',
      'Heated Seats', 'Cooled Seats', 'Third Row Seating', 'Alloy Wheels', 'Roof Rack',
      'Towing Package', '4WD/AWD', 'Anti-lock Brakes', 'Airbags', 'Stability Control',
      'Blind Spot Monitor', 'Lane Departure Warning'
    ];
    return (
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-slate-900">Features & description</h3>
        <div>
          <FieldLabel>Number of seats *</FieldLabel>
          <select value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} className={inputCls}>
            {[2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => <option key={n} value={n}>{n} seats</option>)}
          </select>
          <FieldError>{errors.seats}</FieldError>
        </div>
        <div>
          <FieldLabel>Features (select all that apply)</FieldLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-3 border border-slate-200 rounded-lg">
            {availableFeatures.map(f => (
              <label key={f} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded text-sm font-body">
                <input
                  type="checkbox"
                  checked={formData.features.includes(f)}
                  onChange={(e) => setFormData(p => ({ ...p, features: e.target.checked ? [...p.features, f] : p.features.filter(x => x !== f) }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">{f}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Detailed description * <span className="text-slate-400 font-normal">(min. 50 characters)</span></FieldLabel>
          <textarea
            rows={5} value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={inputCls}
            placeholder="Describe your car's condition, special features, any dents or scratches, maintenance history…"
          />
          <div className="flex justify-between mt-1 font-mono2 text-xs">
            <span className={formData.description.length < 50 ? 'text-rose-500' : 'text-emerald-600'}>{formData.description.length}/50</span>
            <span className="text-slate-400">{formData.description.length >= 50 ? '✓ Good description' : 'More detail needed'}</span>
          </div>
          <FieldError>{errors.description}</FieldError>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-bold text-slate-900">Location & pricing</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>State *</FieldLabel>
          <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputCls}>
            {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>City/town *</FieldLabel>
          <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputCls} placeholder="e.g., Victoria Island, GRA" />
          <FieldError>{errors.city}</FieldError>
        </div>
      </div>
      <div>
        <FieldLabel>Exact location/address * <span className="text-slate-400 font-normal">(shown to confirmed renters only)</span></FieldLabel>
        <input type="text" value={formData.exactLocation} onChange={(e) => setFormData({ ...formData, exactLocation: e.target.value })} className={inputCls} placeholder="e.g., 123 Allen Avenue, Ikeja" />
        <FieldError>{errors.exactLocation}</FieldError>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6 space-y-4">
        <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Pricing</h4>
        <div>
          <FieldLabel>Daily rental price (₦) *</FieldLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono2">₦</span>
            <input type="number" min="1000" step="500" value={formData.dailyPrice} onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })} className={`${inputCls} pl-8`} placeholder="e.g., 25000" />
          </div>
          <FieldError>{errors.dailyPrice}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Weekly discount %</FieldLabel>
            <input type="number" min="0" max="50" value={formData.weeklyDiscount} onChange={(e) => setFormData({ ...formData, weeklyDiscount: e.target.value })} className={inputCls} />
            <p className="text-xs text-slate-500 mt-1 font-mono2">₦{((formData.dailyPrice || 0) * 7 * (100 - formData.weeklyDiscount) / 100).toLocaleString()}/wk</p>
          </div>
          <div>
            <FieldLabel>Monthly discount %</FieldLabel>
            <input type="number" min="0" max="50" value={formData.monthlyDiscount} onChange={(e) => setFormData({ ...formData, monthlyDiscount: e.target.value })} className={inputCls} />
            <p className="text-xs text-slate-500 mt-1 font-mono2">₦{((formData.dailyPrice || 0) * 30 * (100 - formData.monthlyDiscount) / 100).toLocaleString()}/mo</p>
          </div>
        </div>
        <div>
          <FieldLabel>Minimum rental days</FieldLabel>
          <select value={formData.minimumRentalDays} onChange={(e) => setFormData({ ...formData, minimumRentalDays: e.target.value })} className={inputCls}>
            {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(d => <option key={d} value={d}>{d} {d === 1 ? 'day' : 'days'}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm font-body">
          <input type="checkbox" checked={formData.instantBook} onChange={(e) => setFormData({ ...formData, instantBook: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500" />
          <span className="text-slate-700">Enable instant book (renters can book without your approval)</span>
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const imagePositions = [
      { key: 'front', label: 'Front view', required: true, description: 'Clear front view of the car' },
      { key: 'back', label: 'Back view', required: true, description: 'Clear back view showing taillights' },
      { key: 'left', label: 'Left side', required: false, description: 'Driver side view' },
      { key: 'right', label: 'Right side', required: false, description: 'Passenger side view' },
      { key: 'interior1', label: 'Interior front', required: true, description: 'Front seats and dashboard' },
      { key: 'interior2', label: 'Interior back', required: false, description: 'Back seats view' },
      { key: 'dashboard', label: 'Dashboard', required: false, description: 'Close-up of dashboard' },
      { key: 'engine', label: 'Engine bay', required: false, description: 'Clean engine compartment' }
    ];
    return (
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-slate-900">Car photos</h3>
        <p className="text-slate-600 text-sm font-body">High-quality photos increase booking chances by up to 40%. At least 3 photos are required (front, back, interior).</p>

        {errors.images && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-lg flex items-center gap-2 text-sm font-body">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.images}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePositions.map(({ key, label, required, description }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">{label} {required && <span className="text-rose-500">*</span>}</label>
              <div
                className={`relative h-36 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer group ${formData.images[key] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
                onClick={() => fileInputRefs.current[key]?.click()}
              >
                {formData.images[key] ? (
                  <>
                    <img src={formData.images[key].preview} alt={label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Change photo</span>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFormData(p => ({ ...p, images: { ...p.images, [key]: null } })); }} className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-3">
                    <Camera className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs text-slate-500 text-center font-body">{description}</span>
                  </div>
                )}
                <input type="file" ref={el => (fileInputRefs.current[key] = el)} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(key, e.target.files[0])} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-display font-bold text-amber-800 mb-2 text-sm">Photo tips</h4>
          <ul className="text-sm text-amber-700 space-y-1 font-body list-disc list-inside">
            <li>Use good lighting (outdoor daylight is best)</li>
            <li>Clean the car before taking photos</li>
            <li>Show all angles and any existing damage</li>
            <li>Photos should be clear, not blurry</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-bold text-slate-900">Final details & agreement</h3>

      <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6 space-y-4">
        <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Owner information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Full name *</FieldLabel>
            <input type="text" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className={inputCls} required />
          </div>
          <div>
            <FieldLabel>Phone number *</FieldLabel>
            <input type="tel" value={formData.ownerPhone} onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })} className={inputCls} placeholder="+234 800 000 0000" required />
          </div>
        </div>
        <div>
          <FieldLabel>Email address *</FieldLabel>
          <input type="email" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} className={inputCls} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Available from *</FieldLabel>
          <input type="date" value={formData.availableFrom} onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })} className={inputCls} required />
          <FieldError>{errors.availableFrom}</FieldError>
        </div>
        <div>
          <FieldLabel>Available to (optional)</FieldLabel>
          <input type="date" value={formData.availableTo} onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-h-52 overflow-y-auto text-sm text-slate-600 space-y-2.5 font-body">
        <h4 className="font-display font-bold text-slate-900 text-sm mb-1">Terms & conditions</h4>
        <p><strong>Vehicle condition:</strong> the car is in good mechanical condition, insured, and passes required inspections.</p>
        <p><strong>Commission:</strong> NaijaDrive charges a 15% commission on completed bookings.</p>
        <p><strong>Payments:</strong> released to you 24 hours after successful car return.</p>
        <p><strong>Cancellations:</strong> 24 hours' notice required; excessive cancellations may incur penalties.</p>
        <p><strong>Verification:</strong> you authorize NaijaDrive to verify your identity, driving record, and vehicle documents.</p>
      </div>

      <label className="flex items-start gap-3">
        <input type="checkbox" checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
        <div>
          <span className="text-sm text-slate-700 font-body">I agree to the NaijaDrive Terms & Conditions, Privacy Policy, and Host Agreement. *</span>
          <FieldError>{errors.termsAccepted}</FieldError>
        </div>
      </label>
    </div>
  );

  const progress = (step / 5) * 100;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body">
      <GlobalStyle />
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">List your car</h2>
              <p className="text-slate-500 text-sm font-mono2">Step {step} of 5</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-6 pb-4">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {STEP_LABELS.map((label, i) => (
                <span key={label} className={`text-xs font-body ${step >= i + 1 ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>{i + 1}. {label}</span>
              ))}
            </div>
          </div>
        </div>

        {banner && (
          <div className={`mx-6 mt-4 p-3.5 rounded-lg flex items-center gap-2.5 text-sm font-body ${banner.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
            {banner.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {banner.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          <div className="flex justify-between pt-8 border-t border-slate-100 mt-8">
            <div>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                  ← Back
                </button>
              )}
            </div>
            {step < 5 ? (
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-display font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
                Continue →
              </button>
            ) : (
              <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-display font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Listing your car…</> : <><CheckCircle className="w-4 h-4" />List my car</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}