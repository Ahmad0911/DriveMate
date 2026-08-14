import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

/* Shared design tokens with AdminDashboard: Space Grotesk / Inter / JetBrains Mono,
   slate-950 base, indigo-500 → cyan-400 accent gradient. */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono2 { font-family: 'JetBrains Mono', monospace; }
    .font-body { font-family: 'Inter', sans-serif; }
    @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.35} }
    .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
    @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    .scanline::after {
      content:''; position:absolute; inset:0; pointer-events:none;
      background: linear-gradient(180deg, transparent, rgba(34,211,238,0.06), transparent);
      animation: scanline 4s linear infinite;
    }
  `}</style>
);

// Demo credentials — replace with real auth before shipping.
const ADMIN_CREDENTIALS = { email: 'admin@drivemate.ng', password: 'admin123' };

export default function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 450));

    if (credentials.email === ADMIN_CREDENTIALS.email && credentials.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminToken', 'admin-demo-token');
      localStorage.setItem('adminEmail', credentials.email);
      onLogin();
    } else {
      setError('Invalid admin credentials. Check your email and password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-body relative overflow-hidden">
      <GlobalStyle />
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 40%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.12), transparent 40%)' }}
      />

      <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 max-w-md w-full scanline overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-950/40 border border-slate-800 rounded-2xl mb-4 relative p-2">
            <img src="/logo.png" alt="DriveMate" className="w-full h-full object-contain" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 pulse-dot" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono2 mb-2">DriveMate · Fleet Control</p>
          <h1 className="font-display text-3xl font-bold text-slate-50">Admin Portal</h1>
          <p className="text-slate-500 mt-2 text-sm font-body">Sign in to manage the fleet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span className="text-rose-200 text-sm font-body">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 font-mono2 mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-body text-sm"
                placeholder="admin@drivemate.ng"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 font-mono2 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-body text-sm"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 rounded-lg font-display font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying…' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors font-body">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}