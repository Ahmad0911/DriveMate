import React, { useMemo, useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Eye,
  Clock,
  User,
  Car,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  ChevronDown,
  Download,
  Bell,
  Home,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Gauge,
  Radio,
  X,
  Fuel,
  Palette,
  Hash,
  Mail,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

/* ==========================================================================
   GLOBAL STYLES
============================================================================ */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }

    .font-mono2 {
      font-family: 'JetBrains Mono', monospace;
    }

    .font-body {
      font-family: 'Inter', sans-serif;
    }

    @keyframes pulseDot {
      0%, 100% {
        opacity: 1;
      }

      50% {
        opacity: .35;
      }
    }

    .pulse-dot {
      animation: pulseDot 2s ease-in-out infinite;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(16px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-in {
      animation: slideIn .25s ease-out;
    }

    @keyframes scanline {
      0% {
        transform: translateY(-100%);
      }

      100% {
        transform: translateY(100%);
      }
    }

    .scanline::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        transparent,
        rgba(34, 211, 238, 0.08),
        transparent
      );
      animation: scanline 3s linear infinite;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 8px;
    }

    * {
      scrollbar-width: thin;
      scrollbar-color: #1e293b transparent;
    }
  `}</style>
);

/* ==========================================================================
   SAMPLE DATA
============================================================================ */

const initialListings = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    carName: 'Toyota Camry 2023',
    carType: 'Executive Sedan',
    price: 35000,
    location: 'Lagos, VI',
    status: 'pending',
    submittedDate: new Date().toISOString(),

    images: {
      front:
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      back:
        'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
      side:
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      interior:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      dashboard:
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    },

    specifications: {
      year: 2023,
      fuelType: 'Petrol',
      engine: '2.5L 4-cylinder',
      mileage: '15,000',
      color: 'Pearl White',
      registration: 'LAG-123-AB',
    },

    adminComments: [],
    verificationScore: 85,
  },

  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    carName: 'Mercedes-Benz C-Class 2022',
    carType: 'Luxury Sedan',
    price: 55000,
    location: 'Abuja, Maitama',
    status: 'needs_revision',
    submittedDate: new Date(Date.now() - 86400000).toISOString(),

    images: {
      front:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      back:
        'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
      side:
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      interior:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      dashboard:
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    },

    specifications: {
      year: 2022,
      fuelType: 'Petrol',
      engine: '2.0L Turbo',
      mileage: '25,000',
      color: 'Black',
      registration: 'ABJ-456-CD',
    },

    adminComments: [
      {
        id: 'comment-1',
        adminName: 'Admin User',
        message: 'Please provide clearer images of the interior',
        timestamp: '2024-01-15 10:30',
        type: 'comment',
      },
    ],

    verificationScore: 70,
  },

  {
    id: '3',
    userId: 'user3',
    userName: 'Ade Coker',
    userEmail: 'ade@example.com',
    carName: 'Lexus RX 350 2021',
    carType: 'SUV',
    price: 48000,
    location: 'Port Harcourt',
    status: 'pending',
    submittedDate: new Date(Date.now() - 3600000).toISOString(),

    images: {
      front:
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      back:
        'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80',
      side:
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
      interior:
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      dashboard:
        'https://images.unsplash.com/photo-1600661653561-629509216228?w=800&q=80',
    },

    specifications: {
      year: 2021,
      fuelType: 'Petrol',
      engine: '3.5L V6',
      mileage: '32,000',
      color: 'Graphite',
      registration: 'PHC-789-EF',
    },

    adminComments: [],
    verificationScore: 91,
  },
];

const initialUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 800 000 0001',
    location: 'Lagos',
    memberSince: '2024-01-01',
    status: 'active',
    verificationLevel: 'verified',
    lastActive: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 800 000 0002',
    location: 'Abuja',
    memberSince: '2024-01-05',
    status: 'pending',
    verificationLevel: 'basic',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Ade Coker',
    email: 'ade@example.com',
    phone: '+234 800 000 0003',
    location: 'Port Harcourt',
    memberSince: '2023-11-20',
    status: 'active',
    verificationLevel: 'premium',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
  },
];

const initialBookings = [
  {
    id: 'B-1001',
    userName: 'Chidi Okafor',
    carName: 'Toyota Camry 2023',
    dates: 'Aug 14 – Aug 18',
    total: 140000,
    status: 'upcoming',
  },
  {
    id: 'B-1002',
    userName: 'Fatima Bello',
    carName: 'Mercedes C-Class',
    dates: 'Aug 10 – Aug 15',
    total: 275000,
    status: 'active',
  },
  {
    id: 'B-1003',
    userName: 'Emeka Nwosu',
    carName: 'Lexus RX 350',
    dates: 'Jul 28 – Aug 02',
    total: 240000,
    status: 'completed',
  },
  {
    id: 'B-1004',
    userName: 'Grace Udo',
    carName: 'Honda Accord 2022',
    dates: 'Aug 05 – Aug 06',
    total: 32000,
    status: 'cancelled',
  },
];

const revenueTrend = [
  { month: 'Mar', revenue: 8.2 },
  { month: 'Apr', revenue: 9.6 },
  { month: 'May', revenue: 10.1 },
  { month: 'Jun', revenue: 11.8 },
  { month: 'Jul', revenue: 13.4 },
  { month: 'Aug', revenue: 15.6 },
];

const listingsByStatus = [
  { name: 'Approved', count: 118 },
  { name: 'Pending', count: 12 },
  { name: 'Revision', count: 9 },
  { name: 'Rejected', count: 17 },
];

/* ==========================================================================
   HELPERS
============================================================================ */

const STATUS_MAP = {
  pending: {
    label: 'PENDING',
    cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  },

  approved: {
    label: 'APPROVED',
    cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  },

  rejected: {
    label: 'REJECTED',
    cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
  },

  needs_revision: {
    label: 'REVISION',
    cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  },

  active: {
    label: 'ACTIVE',
    cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  },

  upcoming: {
    label: 'UPCOMING',
    cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  },

  completed: {
    label: 'COMPLETED',
    cls: 'text-slate-300 border-slate-500/40 bg-slate-500/10',
  },

  cancelled: {
    label: 'CANCELLED',
    cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
  },

  suspended: {
    label: 'SUSPENDED',
    cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
  },
};

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return '₦0';
  }

  return `₦${amount.toLocaleString('en-NG')}`;
};

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-NG');
};

/* ==========================================================================
   STATUS PLATE
============================================================================ */

const StatusPlate = ({ status }) => {
  const config = STATUS_MAP[status] || {
    label: String(status || 'UNKNOWN').toUpperCase(),
    cls: 'text-slate-300 border-slate-700 bg-slate-800/50',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border font-mono2 text-[10px] tracking-widest ${config.cls}`}
    >
      {config.label}
    </span>
  );
};

/* ==========================================================================
   RADIAL GAUGE
============================================================================ */

const RadialGauge = ({
  value,
  max = 100,
  label,
  colorClass = 'text-cyan-400',
  size = 108,
}) => {
  const safeValue = Number.isFinite(Number(value))
    ? Number(value)
    : 0;

  const safeMax = max > 0 ? max : 100;

  const stroke = 8;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;

  const pct = Math.min(Math.max(safeValue / safeMax, 0), 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-800"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke="currentColor"
            className={colorClass}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1.2s ease',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono2 text-xl font-semibold text-slate-50">
            {Math.round(safeValue)}
            {safeMax === 100 ? '%' : ''}
          </span>
        </div>
      </div>

      <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-2">
        {label}
      </span>
    </div>
  );
};

/* ==========================================================================
   STAT CARD
============================================================================ */

const StatCard = ({
  title,
  value,
  change = '0',
  icon,
  glow = 'cyan',
}) => {
  const glowMap = {
    cyan: 'from-cyan-500/15 text-cyan-400',
    indigo: 'from-indigo-500/15 text-indigo-400',
    emerald: 'from-emerald-500/15 text-emerald-400',
    amber: 'from-amber-500/15 text-amber-400',
  };

  const gradientClass =
    glowMap[glow] || glowMap.cyan;

  const [gradient, textColor] = gradientClass.split(' ');

  const changeString = String(change);
  const isPositive = changeString.startsWith('+');

  return (
    <div className="relative overflow-hidden bg-slate-900/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div
        className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} to-transparent blur-2xl`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-body">
            {title}
          </p>

          <p className="font-display text-2xl font-bold text-slate-50 mt-2">
            {value}
          </p>

          <p
            className={`text-xs mt-2 font-mono2 ${
              isPositive
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {changeString} · 30d
          </p>
        </div>

        <div
          className={`p-2.5 rounded-lg bg-slate-800/80 ${textColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   TOAST STACK
============================================================================ */

const ToastStack = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-[calc(100%-3rem)] max-w-80">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`toast-in flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
            : toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-200'
            : 'bg-indigo-950/90 border-indigo-500/30 text-indigo-200'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        ) : toast.type === 'error' ? (
          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        ) : (
          <Radio className="w-4 h-4 mt-0.5 flex-shrink-0" />
        )}

        <p className="text-sm font-body">
          {toast.message}
        </p>
      </div>
    ))}
  </div>
);

/* ==========================================================================
   SIDEBAR
============================================================================ */

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: BarChart3,
  },
  {
    id: 'listings',
    label: 'Fleet Listings',
    icon: Car,
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

const Sidebar = ({
  activeTab,
  setActiveTab,
  pendingCount,
}) => (
  <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-slate-900/60 border-r border-slate-800 min-h-screen">
    <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
      <div className="relative">
        <div className="w-9 h-9 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-center p-1">
          <img
            src="/logo.png"
            alt="DriveMate"
            className="w-full h-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 pulse-dot" />
      </div>

      <div>
        <p className="font-display font-bold text-slate-50 text-sm leading-tight">
          DRIVEMATE
        </p>

        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          Control Center
        </p>
      </div>
    </div>

    <nav className="flex-1 px-3 py-6 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
              active
                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              {item.label}
            </span>

            {item.id === 'listings' &&
              pendingCount > 0 && (
                <span className="text-[10px] font-mono2 bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded">
                  {pendingCount}
                </span>
              )}
          </button>
        );
      })}
    </nav>

    <div className="px-3 pb-6">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 relative overflow-hidden scanline">
        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />

          <span className="text-[10px] uppercase tracking-widest font-mono2">
            System Online
          </span>
        </div>

        <p className="text-xs text-slate-500 font-body">
          All verification services operational.
        </p>
      </div>
    </div>
  </aside>
);

/* ==========================================================================
   TOPBAR
============================================================================ */

const Topbar = ({
  notifications,
  setNotifications,
  search,
  setSearch,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unread = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search listings, users, plates…"
          className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 font-body focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
        />
      </div>

      <div className="flex items-center gap-2 ml-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((value) => !value);
              setProfileOpen(false);
            }}
            className="relative p-2.5 hover:bg-slate-800/70 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-400" />

            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full pulse-dot" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <p className="font-display font-semibold text-slate-100 text-sm">
                  Notifications
                </p>

                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-body"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-slate-800/60 last:border-0 ${
                        !notification.read
                          ? 'bg-indigo-500/5'
                          : ''
                      }`}
                    >
                      <p className="text-sm text-slate-200 font-body">
                        {notification.title}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5 font-body">
                        {notification.message}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-1 font-mono2">
                        {notification.timestamp}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((value) => !value);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-800/70 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-display font-bold text-sm">
              A
            </div>

            <span className="hidden sm:block text-sm text-slate-300 font-body">
              Admin
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1.5 z-50">
              <button
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/70 font-body"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <a
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/70 font-body"
              >
                <Home className="w-4 h-4" />
                Back to site
              </a>

              <div className="border-t border-slate-800 my-1" />

              <button
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 font-body"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ==========================================================================
   SPEC CHIP
============================================================================ */

const SpecChip = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-body">
    {icon}
    {children}
  </span>
);

/* ==========================================================================
   LISTING CARD
============================================================================ */

const ListingCard = ({
  listing,
  onSelect,
  onApprove,
  onReject,
  onRequestRevision,
}) => {
  const images = listing.images || {};
  const specifications = listing.specifications || {};

  const frontImage =
    images.front ||
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

  const comments = Array.isArray(listing.adminComments)
    ? listing.adminComments
    : [];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-colors group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={frontImage}
          alt={listing.carName || 'Vehicle'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

        <div className="absolute top-3 left-3">
          <StatusPlate status={listing.status} />
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur px-2 py-1 rounded-md">
          <Gauge className="w-3 h-3 text-cyan-400" />

          <span className="font-mono2 text-[11px] text-cyan-300">
            {listing.verificationScore ?? 0}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <p className="font-display font-bold text-slate-50 text-lg leading-tight">
            {listing.carName || 'Unnamed vehicle'}
          </p>

          <p className="text-xs text-slate-300 font-body">
            {listing.carType || 'Vehicle'}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <span className="font-mono2 text-xl font-semibold text-slate-50">
            {formatCurrency(listing.price)}
            <span className="text-xs text-slate-500">
              /day
            </span>
          </span>

          {specifications.registration && (
            <span className="font-mono2 text-[11px] text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
              {specifications.registration}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <SpecChip
            icon={<User className="w-3.5 h-3.5" />}
          >
            {listing.userName || 'Unknown user'}
          </SpecChip>

          <SpecChip
            icon={<MapPin className="w-3.5 h-3.5" />}
          >
            {listing.location || 'Unknown location'}
          </SpecChip>

          <SpecChip
            icon={<Fuel className="w-3.5 h-3.5" />}
          >
            {specifications.fuelType || '—'}
          </SpecChip>

          <SpecChip
            icon={<Clock className="w-3.5 h-3.5" />}
          >
            {formatDate(listing.submittedDate)}
          </SpecChip>
        </div>

        {comments.length > 0 && (
          <div className="mb-4 text-xs text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg p-3 font-body">
            <span className="text-slate-500">
              Last note —{' '}
            </span>

            {comments[comments.length - 1]?.message}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onSelect(listing)}
            className="flex-1 px-3 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 text-sm font-body"
          >
            <Eye className="w-4 h-4" />
            Review
          </button>

          {listing.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => onApprove(listing.id)}
                title="Approve"
                aria-label="Approve listing"
                className="px-3 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onRequestRevision(listing.id)
                }
                title="Request revision"
                aria-label="Request revision"
                className="px-3 py-2 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/25 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onReject(listing.id)}
                title="Reject"
                aria-label="Reject listing"
                className="px-3 py-2 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/25 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   REVIEW MODAL
============================================================================ */

const ReviewModal = ({
  listing,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
  onAddComment,
}) => {
  const [tab, setTab] = useState('details');
  const [rejectionReason, setRejectionReason] =
    useState('');
  const [revisionComment, setRevisionComment] =
    useState('');
  const [newComment, setNewComment] = useState('');

  const specifications = listing.specifications || {};
  const images = listing.images || {};
  const comments = Array.isArray(listing.adminComments)
    ? listing.adminComments
    : [];

  const specRows = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Year',
      value: specifications.year || '—',
    },
    {
      icon: <Fuel className="w-4 h-4" />,
      label: 'Fuel Type',
      value: specifications.fuelType || '—',
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      label: 'Engine',
      value: specifications.engine || '—',
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Mileage',
      value: specifications.mileage
        ? `${specifications.mileage} km`
        : '—',
    },
    {
      icon: <Palette className="w-4 h-4" />,
      label: 'Color',
      value: specifications.color || '—',
    },
    {
      icon: <Hash className="w-4 h-4" />,
      label: 'Plate',
      value: specifications.registration || '—',
    },
  ];

  const checklist = [
    {
      title: 'Vehicle documents verified',
      checked: true,
    },
    {
      title: 'Owner identity verified',
      checked: true,
    },
    {
      title: 'Insurance coverage valid',
      checked: false,
    },
    {
      title: 'All required images provided',
      checked: true,
    },
    {
      title: 'Price within market range',
      checked: true,
    },
    {
      title: 'No prohibited content in images',
      checked: true,
    },
    {
      title: 'Vehicle not reported stolen',
      checked: true,
    },
    {
      title: 'Registration details match',
      checked: false,
    },
  ];

  const imageEntries = Object.entries(images);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-10 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono2 mb-1">
                Listing Review
              </p>

              <h2 className="font-display text-2xl font-bold text-slate-50 break-words">
                {listing.carName || 'Unnamed vehicle'}
              </h2>

              <p className="text-slate-400 text-sm font-body break-words">
                Submitted by {listing.userName || 'Unknown user'} ·{' '}
                {listing.userEmail || 'No email'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 flex-shrink-0"
              aria-label="Close review"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1 mt-6 p-1 bg-slate-950/60 border border-slate-800 rounded-lg w-fit max-w-full overflow-x-auto">
            {[
              'details',
              'images',
              'comments',
              'verification',
            ].map((tabName) => (
              <button
                key={tabName}
                type="button"
                onClick={() => setTab(tabName)}
                className={`px-4 py-2 rounded-md text-sm font-body capitalize transition-all whitespace-nowrap ${
                  tab === tabName
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <h3 className="font-display font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
                    Specifications
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {specRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start gap-2"
                      >
                        <span className="text-cyan-400 mt-0.5">
                          {row.icon}
                        </span>

                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500 font-body">
                            {row.label}
                          </p>

                          <p className="text-sm text-slate-200 font-mono2 break-words">
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <h3 className="font-display font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
                    Owner
                  </h3>

                  <div className="space-y-3 text-sm font-body">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{listing.userName || '—'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 break-all">
                      <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{listing.userEmail || '—'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{listing.location || '—'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>
                        {formatDateTime(
                          listing.submittedDate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex items-center gap-6">
                  <RadialGauge
                    value={listing.verificationScore ?? 0}
                    label="Trust Score"
                    colorClass={
                      (listing.verificationScore ?? 0) >=
                      80
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  />

                  <div className="flex-1 space-y-3">
                    {[
                      ['Image quality', 85],
                      ['Info completeness', 90],
                      ['Price competitiveness', 75],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-slate-400 mb-1 font-body">
                          <span>{label}</span>

                          <span className="font-mono2">
                            {value}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full"
                            style={{
                              width: `${value}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <h3 className="font-display font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
                    Decision
                  </h3>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        onApprove(listing.id)
                      }
                      className="w-full py-2.5 bg-emerald-500 text-slate-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve listing
                    </button>

                    <div className="space-y-2">
                      <textarea
                        value={revisionComment}
                        onChange={(event) =>
                          setRevisionComment(
                            event.target.value
                          )
                        }
                        placeholder="What needs to change?"
                        rows={3}
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 focus:outline-none font-body resize-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const message =
                            revisionComment.trim();

                          if (!message) return;

                          onRequestRevision(
                            listing.id,
                            message
                          );

                          onClose();
                        }}
                        disabled={
                          !revisionComment.trim()
                        }
                        className="w-full py-2 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Request revision
                      </button>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={rejectionReason}
                        onChange={(event) =>
                          setRejectionReason(
                            event.target.value
                          )
                        }
                        placeholder="Reason for rejection"
                        rows={3}
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/40 focus:outline-none font-body resize-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const reason =
                            rejectionReason.trim();

                          if (!reason) return;

                          onReject(
                            listing.id,
                            reason
                          );

                          onClose();
                        }}
                        disabled={
                          !rejectionReason.trim()
                        }
                        className="w-full py-2 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-sm font-medium hover:bg-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Reject listing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {imageEntries.length === 0 ? (
                <div className="md:col-span-2 text-center py-12 text-slate-500">
                  No vehicle images available.
                </div>
              ) : (
                imageEntries.map(([key, url]) => (
                  <div
                    key={key}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-mono2">
                        {key}
                      </p>
                    </div>

                    <img
                      src={String(url)}
                      alt={`${listing.carName || 'Vehicle'} ${key}`}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'comments' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
              <h3 className="font-display font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
                Admin Comments
              </h3>

              <div className="space-y-3 mb-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500 font-body">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-l-2 border-indigo-500/50 pl-3 py-1"
                    >
                      <div className="flex justify-between gap-3 text-xs text-slate-500 font-mono2">
                        <span>
                          {comment.adminName ||
                            'Admin'}
                        </span>

                        <span>
                          {comment.timestamp || '—'}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 mt-1 font-body">
                        {comment.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <textarea
                value={newComment}
                onChange={(event) =>
                  setNewComment(event.target.value)
                }
                placeholder="Add a comment…"
                rows={3}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:outline-none font-body resize-none"
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const message = newComment.trim();

                    if (!message) return;

                    onAddComment(
                      listing.id,
                      message
                    );

                    setNewComment('');
                  }}
                  disabled={!newComment.trim()}
                  className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Add comment
                </button>
              </div>
            </div>
          )}

          {tab === 'verification' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
              <h3 className="font-display font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
                Verification Checklist
              </h3>

              <div className="space-y-1">
                {checklist.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-900 rounded-lg"
                  >
                    <span className="text-sm text-slate-300 font-body">
                      {item.title}
                    </span>

                    {item.checked ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/25 rounded-lg">
                <p className="text-xs uppercase tracking-widest text-amber-300 font-mono2 mb-2">
                  Outstanding
                </p>

                <ul className="text-sm text-amber-200/90 space-y-1 font-body list-disc list-inside">
                  <li>
                    Insurance document verification
                    required
                  </li>
                  <li>
                    Registration number needs verification
                    with authorities
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   USER MANAGEMENT
============================================================================ */

const UserManagement = ({
  users,
  onUserAction,
}) => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        !normalizedQuery ||
        user.name
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        user.email
          ?.toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        status === 'all' || user.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [users, query, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-50">
            User Management
          </h3>

          <p className="text-slate-500 text-sm font-body">
            Manage renter and host accounts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search users…"
              className="pl-9 pr-4 py-2 bg-slate-900/70 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-body"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="px-3 py-2 bg-slate-900/70 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-body"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-slate-950/60">
              <tr>
                {[
                  'User',
                  'Status',
                  'Tier',
                  'Joined',
                  'Last active',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-mono2"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-500 font-body"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-display font-bold text-sm">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase() || 'U'}
                        </div>

                        <div>
                          <p className="text-slate-200 font-body">
                            {user.name}
                          </p>

                          <p className="text-slate-500 text-xs font-body">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusPlate
                        status={user.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-mono2 px-2 py-1 rounded border ${
                          user.verificationLevel ===
                          'premium'
                            ? 'text-indigo-300 border-indigo-500/40 bg-indigo-500/10'
                            : user.verificationLevel ===
                              'verified'
                            ? 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10'
                            : 'text-slate-400 border-slate-700 bg-slate-800/40'
                        }`}
                      >
                        {user.verificationLevel}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-body">
                      {formatDate(user.memberSince)}
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-body">
                      {formatDate(user.lastActive)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            onUserAction(
                              user.id,
                              'verify'
                            )
                          }
                          title="Verify"
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUserAction(
                              user.id,
                              'suspend'
                            )
                          }
                          title="Suspend"
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUserAction(
                              user.id,
                              'message'
                            )
                          }
                          title="Message"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   TOGGLE
============================================================================ */

const Toggle = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition-colors ${
      checked
        ? 'bg-indigo-500'
        : 'bg-slate-700'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

/* ==========================================================================
   EMPTY STATE
============================================================================ */

const EmptyState = ({
  icon,
  title,
  description,
}) => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-4 text-slate-600">
      {icon}
    </div>

    <h3 className="font-display font-semibold text-slate-300">
      {title}
    </h3>

    <p className="text-sm text-slate-500 mt-1 font-body">
      {description}
    </p>
  </div>
);

/* ==========================================================================
   MAIN ADMIN DASHBOARD
============================================================================ */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] =
    useState('dashboard');

  const [selectedListing, setSelectedListing] =
    useState(null);

  const [listings, setListings] =
    useState(initialListings);

  const [users, setUsers] =
    useState(initialUsers);

  const [bookings] =
    useState(initialBookings);

  const [search, setSearch] =
    useState('');

  const [toasts, setToasts] =
    useState([]);

  const [autoApprove, setAutoApprove] =
    useState(false);

  const [emailNotifs, setEmailNotifs] =
    useState(true);

  const [smsAlerts, setSmsAlerts] =
    useState(false);

  const [minScore, setMinScore] =
    useState(80);

  const [notifications, setNotifications] =
    useState([
      {
        id: 'notification-1',
        title: 'New Car Listing',
        message:
          'Toyota Camry 2023 submitted for review',
        timestamp: '10 min ago',
        read: false,
      },
      {
        id: 'notification-2',
        title: 'New User Registered',
        message:
          'John Doe registered as a new host',
        timestamp: '2 hr ago',
        read: false,
      },
      {
        id: 'notification-3',
        title: 'New Booking',
        message:
          'Mercedes C-Class booked for 5 days',
        timestamp: '5 hr ago',
        read: true,
      },
      {
        id: 'notification-4',
        title: 'Reported Issue',
        message:
          'User reported issue with booking #12345',
        timestamp: '1 day ago',
        read: true,
      },
    ]);

  /* ------------------------------------------------------------------------
     TOAST
  ------------------------------------------------------------------------ */

  const pushToast = (
    message,
    type = 'success'
  ) => {
    const id =
      Date.now() + Math.random();

    setToasts((previous) => [
      ...previous,
      {
        id,
        message,
        type,
      },
    ]);

    window.setTimeout(() => {
      setToasts((previous) =>
        previous.filter(
          (toast) => toast.id !== id
        )
      );
    }, 3500);
  };

  /* ------------------------------------------------------------------------
     STATS
  ------------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const pendingCount = listings.filter(
      (listing) =>
        listing.status === 'pending'
    ).length;

    const activeBookingsCount =
      bookings.filter(
        (booking) =>
          booking.status === 'active'
      ).length;

    return {
      totalListings: listings.length,
      pendingListings: pendingCount,
      totalUsers: users.length,
      newUsers: 45,
      activeBookings: activeBookingsCount,
      revenue: 15600000,
      approvalRate: 92,
    };
  }, [listings, users, bookings]);

  /* ------------------------------------------------------------------------
     LISTING ACTIONS
  ------------------------------------------------------------------------ */

  const updateSelectedListing = (
    id,
    updater
  ) => {
    setSelectedListing((previous) => {
      if (!previous || previous.id !== id) {
        return previous;
      }

      return updater(previous);
    });
  };

  const handleApproveListing = (
    id,
    comment
  ) => {
    const timestamp =
      new Date().toISOString();

    const approvalComment = {
      id: `comment-${Date.now()}`,
      adminName: 'Admin User',
      message:
        comment || 'Listing approved',
      timestamp,
      type: 'approval',
    };

    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              status: 'approved',
              adminComments: [
                ...(listing.adminComments || []),
                approvalComment,
              ],
            }
          : listing
      )
    );

    updateSelectedListing(id, (listing) => ({
      ...listing,
      status: 'approved',
      adminComments: [
        ...(listing.adminComments || []),
        approvalComment,
      ],
    }));

    setSelectedListing(null);

    pushToast(
      'Listing approved successfully.',
      'success'
    );
  };

  const handleRejectListing = (
    id,
    reason = 'Quality issues'
  ) => {
    const timestamp =
      new Date().toISOString();

    const rejectionComment = {
      id: `comment-${Date.now()}`,
      adminName: 'Admin User',
      message: `Rejected: ${reason}`,
      timestamp,
      type: 'rejection',
    };

    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              status: 'rejected',
              rejectionReason: reason,
              adminComments: [
                ...(listing.adminComments || []),
                rejectionComment,
              ],
            }
          : listing
      )
    );

    updateSelectedListing(id, (listing) => ({
      ...listing,
      status: 'rejected',
      rejectionReason: reason,
      adminComments: [
        ...(listing.adminComments || []),
        rejectionComment,
      ],
    }));

    setSelectedListing(null);

    pushToast(
      'Listing rejected. User notified.',
      'error'
    );
  };

  const handleRequestRevision = (
    id,
    comment = 'Please review and update your submission.'
  ) => {
    const timestamp =
      new Date().toISOString();

    const revisionComment = {
      id: `comment-${Date.now()}`,
      adminName: 'Admin User',
      message: `Revision requested: ${comment}`,
      timestamp,
      type: 'comment',
    };

    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              status: 'needs_revision',
              adminComments: [
                ...(listing.adminComments || []),
                revisionComment,
              ],
            }
          : listing
      )
    );

    updateSelectedListing(id, (listing) => ({
      ...listing,
      status: 'needs_revision',
      adminComments: [
        ...(listing.adminComments || []),
        revisionComment,
      ],
    }));

    setSelectedListing(null);

    pushToast(
      'Revision requested. User notified.',
      'info'
    );
  };

  const handleAddComment = (
    id,
    comment
  ) => {
    const message = comment.trim();

    if (!message) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      adminName: 'Admin User',
      message,
      timestamp:
        new Date().toISOString(),
      type: 'comment',
    };

    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              adminComments: [
                ...(listing.adminComments || []),
                newComment,
              ],
            }
          : listing
      )
    );

    updateSelectedListing(id, (listing) => ({
      ...listing,
      adminComments: [
        ...(listing.adminComments || []),
        newComment,
      ],
    }));

    pushToast(
      'Comment added.',
      'success'
    );
  };

  /* ------------------------------------------------------------------------
     USER ACTIONS
  ------------------------------------------------------------------------ */

  const handleUserAction = (
    userId,
    action
  ) => {
    if (action === 'verify') {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === userId
            ? {
                ...user,
                verificationLevel:
                  'verified',
                status: 'active',
              }
            : user
        )
      );

      pushToast(
        'User verified.',
        'success'
      );

      return;
    }

    if (action === 'suspend') {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: 'suspended',
              }
            : user
        )
      );

      pushToast(
        'User suspended.',
        'error'
      );

      return;
    }

    if (action === 'message') {
      pushToast(
        'Messaging interface would open here.',
        'info'
      );
    }
  };

  /* ------------------------------------------------------------------------
     FILTERED LISTINGS
  ------------------------------------------------------------------------ */

  const pendingListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.status === 'pending'
      ),
    [listings]
  );

  const revisionListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.status ===
          'needs_revision'
      ),
    [listings]
  );

  const filteredAllListings = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return listings;
  }

  return listings.filter((listing) => {
    const specifications = listing.specifications;

    const searchableText = [
      listing.carName,
      listing.carType,
      listing.userName,
      listing.userEmail,
      listing.location,
      String(specifications?.registration || ''),
      String(specifications?.color || ''),
      String(specifications?.fuelType || ''),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}, [listings, search]);

  /* ------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-slate-950 font-body flex">
      <GlobalStyle />

      <ToastStack toasts={toasts} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={
          stats.pendingListings
        }
      />

      <div className="flex-1 min-w-0">
        <Topbar
          notifications={notifications}
          setNotifications={
            setNotifications
          }
          search={search}
          setSearch={setSearch}
        />

        <main className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Mobile navigation */}
          <div className="flex lg:hidden gap-2 overflow-x-auto mb-6 pb-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap font-body ${
                  activeTab === item.id
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* =================================================================
              DASHBOARD
          ================================================================== */}

          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-cyan-400 font-mono2 mb-1">
                  Fleet status · Live
                </p>

                <h1 className="font-display text-3xl font-bold text-slate-50">
                  Overview
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Pending Listings"
                  value={
                    stats.pendingListings
                  }
                  change="+2"
                  icon={
                    <AlertCircle className="w-5 h-5" />
                  }
                  glow="amber"
                />

                <StatCard
                  title="Total Revenue"
                  value={`₦${(
                    stats.revenue /
                    1000000
                  ).toFixed(1)}M`}
                  change="+15%"
                  icon={
                    <DollarSign className="w-5 h-5" />
                  }
                  glow="emerald"
                />

                <StatCard
                  title="New Users"
                  value={stats.newUsers}
                  change="+8"
                  icon={
                    <Users className="w-5 h-5" />
                  }
                  glow="indigo"
                />

                <StatCard
                  title="Active Bookings"
                  value={
                    stats.activeBookings
                  }
                  change="+4"
                  icon={
                    <Calendar className="w-5 h-5" />
                  }
                  glow="cyan"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display font-bold text-slate-100">
                      Pending Listings (
                      {pendingListings.length})
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          'listings'
                        )
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-body"
                    >
                      View all →
                    </button>
                  </div>

                  {pendingListings.length >
                  0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                      {pendingListings.map(
                        (listing) => (
                          <ListingCard
                            key={listing.id}
                            listing={listing}
                            onSelect={
                              setSelectedListing
                            }
                            onApprove={
                              handleApproveListing
                            }
                            onReject={(
                              id
                            ) =>
                              handleRejectListing(
                                id,
                                'Quality issues'
                              )
                            }
                            onRequestRevision={(
                              id
                            ) =>
                              handleRequestRevision(
                                id,
                                'Please review and update your submission.'
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon={
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      }
                      title="Queue clear"
                      description="Nothing is pending review."
                    />
                  )}
                </div>

                <div className="space-y-5">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center">
                    <h3 className="font-display font-semibold text-slate-100 text-sm mb-4 self-start uppercase tracking-wide">
                      Approval Rate
                    </h3>

                    <RadialGauge
                      value={
                        stats.approvalRate
                      }
                      label="Approved"
                      colorClass="text-emerald-400"
                      size={128}
                    />
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-display font-semibold text-slate-100 text-sm mb-4 uppercase tracking-wide">
                      Quick Actions
                    </h3>

                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          pushToast(
                            'Batch approve queued.',
                            'success'
                          )
                        }
                        className="w-full py-2.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium hover:bg-emerald-500/25 flex items-center gap-2 px-3"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Batch approve selected
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          pushToast(
                            'Export started — check downloads shortly.',
                            'info'
                          )
                        }
                        className="w-full py-2.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-lg text-sm font-medium hover:bg-indigo-500/25 flex items-center gap-2 px-3"
                      >
                        <Download className="w-4 h-4" />
                        Export reports
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveTab(
                            'settings'
                          )
                        }
                        className="w-full py-2.5 bg-slate-800/60 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 px-3"
                      >
                        <Settings className="w-4 h-4" />
                        System settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {revisionListings.length >
                0 && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display font-bold text-slate-100">
                      Needs Revision (
                      {revisionListings.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {revisionListings.map(
                      (listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          onSelect={
                            setSelectedListing
                          }
                          onApprove={
                            handleApproveListing
                          }
                          onReject={(
                            id
                          ) =>
                            handleRejectListing(
                              id,
                              'Quality issues'
                            )
                          }
                          onRequestRevision={(
                            id
                          ) =>
                            handleRequestRevision(
                              id,
                              'Please review and update your submission.'
                            )
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              LISTINGS
          ================================================================== */}

          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-50">
                    Fleet Listings
                  </h1>

                  <p className="text-slate-500 text-sm font-body">
                    {filteredAllListings.length}{' '}
                    listing
                    {filteredAllListings.length ===
                    1
                      ? ''
                      : 's'}
                  </p>
                </div>
              </div>

              {filteredAllListings.length ===
              0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl">
                  <EmptyState
                    icon={
                      <Car className="w-10 h-10" />
                    }
                    title="No listings found"
                    description="Try adjusting your search."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredAllListings.map(
                    (listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onSelect={
                          setSelectedListing
                        }
                        onApprove={
                          handleApproveListing
                        }
                        onReject={(id) =>
                          handleRejectListing(
                            id,
                            'Quality issues'
                          )
                        }
                        onRequestRevision={(
                          id
                        ) =>
                          handleRequestRevision(
                            id,
                            'Please review and update your submission.'
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              USERS
          ================================================================== */}

          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onUserAction={
                handleUserAction
              }
            />
          )}

          {/* =================================================================
              BOOKINGS
          ================================================================== */}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h1 className="font-display text-2xl font-bold text-slate-50">
                Bookings
              </h1>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[760px]">
                    <thead className="bg-slate-950/60">
                      <tr>
                        {[
                          'Booking',
                          'Renter',
                          'Vehicle',
                          'Dates',
                          'Total',
                          'Status',
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-mono2"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800">
                      {bookings.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-slate-500"
                          >
                            No bookings found.
                          </td>
                        </tr>
                      ) : (
                        bookings.map(
                          (booking) => (
                            <tr
                              key={
                                booking.id
                              }
                              className="hover:bg-slate-800/30"
                            >
                              <td className="px-5 py-4 font-mono2 text-cyan-300">
                                {
                                  booking.id
                                }
                              </td>

                              <td className="px-5 py-4 text-slate-200 font-body">
                                {
                                  booking.userName
                                }
                              </td>

                              <td className="px-5 py-4 text-slate-300 font-body">
                                {
                                  booking.carName
                                }
                              </td>

                              <td className="px-5 py-4 text-slate-400 font-body">
                                {
                                  booking.dates
                                }
                              </td>

                              <td className="px-5 py-4 font-mono2 text-slate-200">
                                {formatCurrency(
                                  booking.total
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <StatusPlate
                                  status={
                                    booking.status
                                  }
                                />
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              REPORTS
          ================================================================== */}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h1 className="font-display text-2xl font-bold text-slate-50">
                Reports
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-display font-semibold text-slate-100 text-sm mb-4 uppercase tracking-wide">
                    Revenue trend (₦M)
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >
                    <AreaChart
                      data={revenueTrend}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                            stopOpacity={0.4}
                          />

                          <stop
                            offset="100%"
                            stopColor="#22d3ee"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#1e293b"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            '#0f172a',
                          border:
                            '1px solid #1e293b',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{
                          color: '#e2e8f0',
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-display font-semibold text-slate-100 text-sm mb-4 uppercase tracking-wide">
                    Listings by status
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >
                    <BarChart
                      data={listingsByStatus}
                    >
                      <CartesianGrid
                        stroke="#1e293b"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            '#0f172a',
                          border:
                            '1px solid #1e293b',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{
                          color: '#e2e8f0',
                        }}
                        cursor={{
                          fill: '#1e293b',
                        }}
                      />

                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                        radius={[
                          4,
                          4,
                          0,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SETTINGS
          ================================================================== */}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <h1 className="font-display text-2xl font-bold text-slate-50">
                Settings
              </h1>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
                <h3 className="font-display font-semibold text-slate-100 text-sm uppercase tracking-wide">
                  Listing Approval
                </h3>

                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-slate-200 font-body">
                      Auto-approve verified
                      users
                    </p>

                    <p className="text-xs text-slate-500 font-body mt-1">
                      Skip manual review for
                      premium-tier hosts
                    </p>
                  </div>

                  <Toggle
                    checked={autoApprove}
                    onChange={
                      setAutoApprove
                    }
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm text-slate-300 mb-2 font-body gap-4">
                    <span>
                      Minimum verification
                      score for auto-approval
                    </span>

                    <span className="font-mono2 text-cyan-300 whitespace-nowrap">
                      {minScore}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={minScore}
                    onChange={(event) =>
                      setMinScore(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
                <h3 className="font-display font-semibold text-slate-100 text-sm uppercase tracking-wide">
                  Notifications
                </h3>

                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-slate-200 font-body">
                      Email alerts for new
                      listings
                    </p>
                  </div>

                  <Toggle
                    checked={emailNotifs}
                    onChange={
                      setEmailNotifs
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-slate-200 font-body">
                      SMS alerts for
                      high-priority issues
                    </p>
                  </div>

                  <Toggle
                    checked={smsAlerts}
                    onChange={setSmsAlerts}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          REVIEW MODAL
      ====================================================================== */}

      {selectedListing && (
        <ReviewModal
          listing={selectedListing}
          onClose={() =>
            setSelectedListing(null)
          }
          onApprove={
            handleApproveListing
          }
          onReject={
            handleRejectListing
          }
          onRequestRevision={
            handleRequestRevision
          }
          onAddComment={
            handleAddComment
          }
        />
      )}
    </div>
  );
}