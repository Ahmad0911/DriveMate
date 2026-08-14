import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Star, ChevronRight, Menu, X, User, Heart, Filter, Clock, Shield,
  DollarSign, Mail, Car, CheckCircle, ChevronDown, CreditCard, Users, Battery, Fuel,
  Bell, LogOut, Map, Camera, Lock, Key, Eye, EyeOff, AlertCircle, Zap, ShieldCheck
} from 'lucide-react';
import AuthModal from './AuthModal';
import CarListingForm from './CarListingForm';
import LandingPage from './LandingPage';

/* Same type system as AdminDashboard / AuthModal / CarListingForm — this is what
   ties the whole product (public site + admin) into one visual family. */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono2 { font-family: 'JetBrains Mono', monospace; }
    .font-body { font-family: 'Inter', sans-serif; }
    @keyframes slideIn { from{opacity:0; transform:translateX(16px)} to{opacity:1; transform:translateX(0)} }
    .toast-in { animation: slideIn .25s ease-out; }
    @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.35} }
    .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
  `}</style>
);

const NIGERIAN_CITIES = [
  'Abuja (FCT)', 'Lagos', 'Ibadan', 'Port Harcourt', 'Kano', 'Benin City', 'Ilorin', 'Abeokuta',
  'Jos', 'Enugu', 'Owerri', 'Calabar', 'Uyo', 'Warri', 'Kaduna', 'Maiduguri', 'Sokoto', 'Akure',
  'Ado-Ekiti', 'Asaba'
];

const SAMPLE_CARS = [
  {
    id: 1, name: 'Toyota Camry 2023', type: 'Executive Sedan',
    images: {
      front: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
      side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    },
    price: 35000, location: 'Lagos, VI', rating: 4.9, reviews: 128, transmission: 'Automatic',
    seats: 5, verified: true, instantBook: true, electric: false,
    owner: { name: 'Adebayo Williams', initials: 'AW', rating: 4.9, reviews: 245, responseTime: 'Under 1 hour' },
    specifications: { year: 2023, fuelType: 'Petrol', engine: '2.5L 4-cylinder', mileage: '15,000', color: 'Pearl White', registration: 'LAG-123-AB' },
    availability: { available: true }
  },
  {
    id: 2, name: 'Lexus RX 350 2021', type: 'Luxury SUV',
    images: {
      front: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      back: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80',
      side: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
      interior: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      dashboard: 'https://images.unsplash.com/photo-1600661653561-629509216228?w=800&q=80'
    },
    price: 48000, location: 'Port Harcourt', rating: 4.8, reviews: 76, transmission: 'Automatic',
    seats: 7, verified: true, instantBook: false, electric: false,
    owner: { name: 'Ade Coker', initials: 'AC', rating: 4.8, reviews: 76, responseTime: 'Under 2 hours' },
    specifications: { year: 2021, fuelType: 'Petrol', engine: '3.5L V6', mileage: '32,000', color: 'Graphite', registration: 'PHC-789-EF' },
    availability: { available: true }
  },
  {
    id: 3, name: 'Mercedes-Benz C-Class 2022', type: 'Luxury Sedan',
    images: {
      front: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
      side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    },
    price: 55000, location: 'Abuja, Maitama', rating: 4.7, reviews: 54, transmission: 'Automatic',
    seats: 5, verified: true, instantBook: true, electric: false,
    owner: { name: 'Jane Smith', initials: 'JS', rating: 4.7, reviews: 54, responseTime: 'Under 1 hour' },
    specifications: { year: 2022, fuelType: 'Petrol', engine: '2.0L Turbo', mileage: '25,000', color: 'Black', registration: 'ABJ-456-CD' },
    availability: { available: false, nextAvailable: new Date(Date.now() + 172800000).toISOString().split('T')[0] }
  }
];

/* ---------------------------------------------------------------------
   TOASTS — replaces every alert() in the original file
--------------------------------------------------------------------- */
const ToastStack = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80">
    {toasts.map(t => (
      <div key={t.id} className={`toast-in flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg bg-white ${
        t.type === 'error' ? 'border-rose-200' : t.type === 'info' ? 'border-indigo-200' : 'border-emerald-200'
      }`}>
        {t.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 text-rose-500 flex-shrink-0" /> : <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.type === 'info' ? 'text-indigo-500' : 'text-emerald-500'}`} />}
        <p className="text-sm text-slate-700 font-body">{t.message}</p>
      </div>
    ))}
  </div>
);

/* ---------------------------------------------------------------------
   HEADER
--------------------------------------------------------------------- */
const Header = ({ activeTab, setActiveTab, menuOpen, setMenuOpen, user, onAuthOpen, onListCarClick, onLogout, onProfileOpen, notifications, isAdmin }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="DriveMate" className="h-10 w-10 object-contain" />
            <div>
              <span className="font-display text-xl font-bold text-slate-900 tracking-tight">DriveMate</span>
              <div className="text-[10px] font-mono2 text-indigo-500 uppercase tracking-widest -mt-0.5">Premium Rentals</div>
            </div>
          </div>

          <nav className="hidden lg:flex gap-1">
            {[['rent', 'Rent a Car'], ['trips', 'My Trips'], ['list', 'List Your Car']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-5 py-2.5 font-medium text-sm rounded-lg transition-all ${activeTab === id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <a href="/admin" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </a>
                )}
                <div className="relative">
                  <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }} className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-display font-semibold text-slate-900 text-sm">Notifications</p>
                        <p className="text-xs text-slate-400 font-body">{unread} unread</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                            <p className="text-sm text-slate-800 font-medium">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono2">{n.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }} className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">{user.initials}</div>
                    <span className="text-sm font-medium text-slate-800">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <button onClick={onProfileOpen} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><User className="w-4 h-4" />Profile & settings</button>
                      <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><CreditCard className="w-4 h-4" />Payment methods</a>
                      <div className="border-t border-slate-100 my-1" />
                      <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"><LogOut className="w-4 h-4" />Sign out</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button onClick={onAuthOpen} className="px-5 py-2.5 text-slate-700 font-medium text-sm hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors">Sign in</button>
                <button onClick={onAuthOpen} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Get started</button>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2.5 hover:bg-slate-100 rounded-lg">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

/* ---------------------------------------------------------------------
   CAR CARD
--------------------------------------------------------------------- */
const CarCard = ({ car, isFavorite, onToggleFavorite, onSelect }) => (
  <div onClick={() => onSelect(car)} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 hover:border-indigo-200 overflow-hidden font-body">
    <div className="relative h-56 overflow-hidden">
      <img src={car.images.front} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(car.id); }} className="absolute top-3.5 right-3.5 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow hover:scale-110 transition-transform">
        <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
      </button>
      {car.instantBook && (
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur text-cyan-300 text-[10px] font-mono2 tracking-widest rounded-md">INSTANT BOOK</div>
      )}
      {!car.availability.available && (
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-rose-500/90 backdrop-blur text-white text-[10px] font-mono2 tracking-widest rounded-md">UNAVAILABLE</div>
      )}
    </div>

    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display font-bold text-lg text-slate-900">{car.name}</h3>
        {car.verified && <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0" title="Verified vehicle" />}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md"><Car className="w-3 h-3" />{car.type}</span>
        <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md"><Users className="w-3 h-3" />{car.seats} seats</span>
        {car.electric && <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"><Zap className="w-3 h-3" />Electric</span>}
      </div>
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-900">{car.rating.toFixed(1)}</span><span className="text-slate-400">({car.reviews})</span></span>
        <span className="flex items-center gap-1 text-slate-500"><MapPin className="w-3.5 h-3.5" />{car.location}</span>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-mono2 text-xl font-semibold text-slate-900">₦{car.price.toLocaleString()}</span>
          <span className="text-slate-400 text-sm">/day</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSelect(car); }} disabled={!car.availability.available}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5">
          Select <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------------
   CAR DETAIL MODAL
--------------------------------------------------------------------- */
const CarDetailModal = ({ car, onClose, onBook }) => {
  const [tab, setTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(car.images.front);
  const [dates, setDates] = useState({ pickup: new Date().toISOString().split('T')[0], dropoff: new Date(Date.now() + 86400000).toISOString().split('T')[0] });

  const imageTypes = [['front', 'Front'], ['back', 'Rear'], ['side', 'Side'], ['interior', 'Interior'], ['dashboard', 'Dashboard']];
  const days = Math.max(1, Math.ceil((new Date(dates.dropoff) - new Date(dates.pickup)) / 86400000));
  const total = days * car.price;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 z-10 flex items-center justify-between p-5">
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-slate-100 rounded-xl"><Map className="w-4.5 h-4.5" /></button>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl"><Heart className="w-4.5 h-4.5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 lg:p-10">
          <div>
            <div className="rounded-2xl overflow-hidden mb-4">
              <img src={selectedImage} alt={car.name} className="w-full h-80 object-cover" />
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {imageTypes.map(([key, label]) => (
                <button key={key} onClick={() => setSelectedImage(car.images[key])}
                  className={`relative aspect-square rounded-lg overflow-hidden ${selectedImage === car.images[key] ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-200'}`} title={label}>
                  <img src={car.images[key]} alt={label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {car.electric && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono2 tracking-widest px-2.5 py-1 rounded-md">ELECTRIC</span>}
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono2 tracking-widest px-2.5 py-1 rounded-md">PREMIUM</span>
                {car.instantBook && <span className="bg-cyan-50 text-cyan-700 text-[10px] font-mono2 tracking-widest px-2.5 py-1 rounded-md">INSTANT BOOK</span>}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">{car.name}</h2>
                  <div className="flex items-center gap-5 text-sm">
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{car.rating.toFixed(1)}</span><span className="text-slate-400">({car.reviews})</span></span>
                    <span className="flex items-center gap-1.5 text-slate-500"><MapPin className="w-4 h-4" />{car.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono2 text-2xl font-semibold text-slate-900">₦{car.price.toLocaleString()}<span className="text-slate-400 text-sm">/day</span></div>
                </div>
              </div>

              <div className="flex gap-1 mt-6 p-1 bg-slate-100 rounded-lg w-fit">
                {['overview', 'specs'].map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5">
              <h3 className="font-display font-bold text-slate-900 mb-3 text-sm">Select dates</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Pick-up</label>
                  <input type="date" value={dates.pickup} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDates({ ...dates, pickup: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Return</label>
                  <input type="date" value={dates.dropoff} min={dates.pickup} onChange={(e) => setDates({ ...dates, dropoff: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" />
                </div>
              </div>
              <div className="mt-3 p-3.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500">{days} day{days > 1 ? 's' : ''} total</p>
                  <p className="font-mono2 text-lg font-semibold text-slate-900">₦{total.toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-500">₦{car.price.toLocaleString()}/day</p>
              </div>
            </div>

            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-xl"><div className="flex items-center gap-2 mb-1.5 text-slate-800 font-medium text-sm"><Car className="w-4 h-4 text-indigo-500" />Transmission</div><p className="text-sm text-slate-600">{car.transmission}</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl"><div className="flex items-center gap-2 mb-1.5 text-slate-800 font-medium text-sm"><Users className="w-4 h-4 text-indigo-500" />Capacity</div><p className="text-sm text-slate-600">{car.seats} passengers</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl"><div className="flex items-center gap-2 mb-1.5 text-slate-800 font-medium text-sm">{car.electric ? <Battery className="w-4 h-4 text-indigo-500" /> : <Fuel className="w-4 h-4 text-indigo-500" />}{car.electric ? 'Range' : 'Fuel'}</div><p className="text-sm text-slate-600">{car.electric ? '350 km (full charge)' : car.specifications.fuelType}</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl"><div className="flex items-center gap-2 mb-1.5 text-slate-800 font-medium text-sm"><CheckCircle className="w-4 h-4 text-emerald-500" />Status</div><p className="text-sm text-slate-600">{car.availability.available ? 'Available now' : `Available ${car.availability.nextAvailable}`}</p></div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 rounded-2xl p-5">
                  <h3 className="font-display font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm"><Shield className="w-4.5 h-4.5 text-indigo-600" />Everything included</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['Insurance coverage', '24/7 roadside assistance', 'Free cancellation', 'Unlimited mileage', 'No hidden fees', 'Contactless pickup'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-display font-bold text-slate-900 mb-3 text-sm">Meet your host</h3>
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-display font-bold">{car.owner?.initials}</div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{car.owner?.name}</p>
                        <p className="text-xs text-slate-500">{car.owner?.rating.toFixed(1)} ★ ({car.owner?.reviews} reviews)</p>
                      </div>
                      <p className="text-xs text-slate-500">Responds {car.owner?.responseTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'specs' && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(car.specifications).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 capitalize">{k}</p>
                    <p className="font-mono2 text-sm text-slate-900 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button className="flex-1 px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />Message host
              </button>
              <button onClick={onBook} disabled={!car.availability.available} className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />Book this car
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------
   PROFILE SETTINGS (trimmed to profile + security, matches brand)
--------------------------------------------------------------------- */
const ProfileSettings = ({ user, onClose, onUpdateUser, pushToast }) => {
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', location: user?.location || '' });
  const [twoFA, setTwoFA] = useState(user?.settings?.twoFactorAuth || false);

  const save = () => {
    onUpdateUser({ ...user, ...profile, initials: profile.name.split(' ').map(n => n[0]).join('').toUpperCase() });
    pushToast('Profile updated.', 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Profile & settings</h2>
            <p className="text-slate-500 text-sm">Manage your account</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 pt-4 flex gap-1">
          {['profile', 'security'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>{t}</button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label><input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" /></div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
                  <select value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none">
                    <option value="">Select location</option>
                    {NIGERIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={save} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">Save changes</button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Two-factor authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</p>
                </div>
                <button onClick={() => { setTwoFA(v => !v); pushToast(`Two-factor authentication ${!twoFA ? 'enabled' : 'disabled'}.`, 'info'); }} className={`relative w-12 h-7 rounded-full transition-colors ${twoFA ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${twoFA ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-slate-400 font-body">Password changes and account deletion are handled via a verified email link for security.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
export default function DriveMateApp() {
  const [user, setUser] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  // Logged-in visitors skip straight to the app; everyone else sees the landing page first.
  const [page, setPage] = useState(user ? 'app' : 'landing');

  const [activeTab, setActiveTab] = useState('rent');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [listingOpen, setListingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cars, setCars] = useState(SAMPLE_CARS);

  const isAdmin = user?.email?.includes('admin') || user?.email === 'admin@drivemate.ng';

  const [notifications] = useState([
    { id: '1', title: 'Booking confirmed', message: 'Your booking for Toyota Camry has been confirmed', timestamp: '10 min ago', read: false },
    { id: '2', title: 'Special offer', message: 'Get 20% off your next booking', timestamp: '2 hr ago', read: true },
    { id: '3', title: 'New login', message: 'New login detected from Lagos, Nigeria', timestamp: '1 day ago', read: false }
  ]);

  const pushToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  const handleLogin = (userData) => { setUser(userData); setPage('app'); pushToast(`Welcome, ${userData.name.split(' ')[0]}!`, 'success'); };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setPage('landing'); pushToast('Signed out.', 'info'); };
  const handleListCarClick = () => (user ? setListingOpen(true) : setAuthOpen(true));
  const handleCarSubmit = (car) => { setCars(prev => [car, ...prev]); pushToast('Car listed! Pending verification.', 'success'); };
  const handleUpdateUser = (updated) => { setUser(updated); localStorage.setItem('user', JSON.stringify(updated)); };
  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleBookCar = (car) => { pushToast(`Booking request sent for ${car.name}.`, 'success'); setSelectedCar(null); };

  if (page === 'landing') {
    return <LandingPage onGetStarted={() => setPage('app')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalStyle />
      <ToastStack toasts={toasts} />

      <Header
        activeTab={activeTab} setActiveTab={setActiveTab} menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        user={user} onAuthOpen={() => setAuthOpen(true)} onListCarClick={handleListCarClick}
        onLogout={handleLogout} onProfileOpen={() => setProfileOpen(true)} notifications={notifications} isAdmin={isAdmin}
      />

      {activeTab === 'rent' && (
        <>
          <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 85% 70%, rgba(34,211,238,0.2), transparent 45%)' }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full pulse-dot" />
                  <span className="text-sm font-mono2 text-cyan-200">5,000+ verified cars across Nigeria</span>
                </div>
                <h1 className="font-display text-5xl lg:text-6xl font-bold mb-6 leading-[1.05]">
                  Premium car rentals<span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">across Nigeria</span>
                </h1>
                <p className="text-lg text-slate-300 mb-8 max-w-xl font-body">Verified vehicles, trusted hosts, and instant booking — wherever you're headed.</p>
                <div className="flex items-center bg-white rounded-xl p-1.5 max-w-md shadow-xl">
                  <Search className="w-5 h-5 text-slate-400 ml-3" />
                  <input placeholder="Search by city or car model" className="flex-1 px-3 py-2.5 text-slate-900 text-sm focus:outline-none font-body" />
                  <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium text-sm">Search</button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Premium fleet</h2>
                <p className="text-slate-500 text-sm mt-1 font-body">{cars.length} verified cars available nationwide</p>
              </div>
              <div className="flex gap-2.5">
                <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center gap-2"><Filter className="w-4 h-4" />Filters</button>
                <select className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none">
                  <option>Sort: Recommended</option>
                  <option>Price: Low to high</option>
                  <option>Price: High to low</option>
                  <option>Rating: High to low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} isFavorite={favorites.includes(car.id)} onToggleFavorite={toggleFavorite} onSelect={setSelectedCar} />
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'trips' && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-slate-50 rounded-2xl p-10 text-center">
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-3">My trips</h1>
            <p className="text-slate-500 mb-6 font-body">You have no upcoming trips. Start by booking a car!</p>
            <button onClick={() => setActiveTab('rent')} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">Browse cars</button>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-4">List your car</h1>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto font-body">Earn up to ₦500,000 monthly by sharing your car with verified renters. We handle insurance, verification, and payments.</p>
          <button onClick={handleListCarClick} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-display font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Start listing now</button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[[Shield, 'Fully insured', 'Comprehensive coverage for peace of mind'], [DollarSign, 'Guaranteed earnings', 'Competitive, predictable monthly payouts'], [Users, 'Verified renters', 'Every renter is reviewed and verified']].map(([Icon, title, desc]) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-6 h-6 text-indigo-600" /></div>
                <h3 className="font-display font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-slate-500 text-sm font-body">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}
      {listingOpen && <CarListingForm user={user} onClose={() => setListingOpen(false)} onSubmit={handleCarSubmit} />}
      {profileOpen && user && <ProfileSettings user={user} onClose={() => setProfileOpen(false)} onUpdateUser={handleUpdateUser} pushToast={pushToast} />}
      {selectedCar && <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} onBook={() => handleBookCar(selectedCar)} />}

      <footer className="bg-slate-950 text-white pt-16 pb-8 font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <img src="/logo.png" alt="DriveMate" className="h-9 w-9 object-contain" />
                <span className="font-display text-xl font-bold">DriveMate</span>
              </div>
              <p className="text-slate-400 text-sm">Nigeria's premier car rental platform. Premium vehicles, verified hosts.</p>
            </div>
            {[['Company', ['About us', 'Careers', 'Press', 'Blog']], ['Support', ['Help center', 'Safety', 'Contact us', 'FAQs']], ['Legal', ['Privacy policy', 'Terms of service', 'Cookie policy']]].map(([title, links]) => (
              <div key={title}>
                <h3 className="font-display font-bold mb-5 text-sm uppercase tracking-wide">{title}</h3>
                <ul className="space-y-3">{links.map(l => <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-slate-500 text-sm">© 2026 DriveMate. All rights reserved.</p>
            <span className="text-slate-500 text-sm">🇳🇬 Made for Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}