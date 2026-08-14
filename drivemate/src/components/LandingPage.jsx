import React from 'react';
import {
  Search, Calendar, KeyRound, ShieldCheck, Star, MapPin, Clock, CheckCircle,
  ArrowRight, DollarSign, Users
} from 'lucide-react';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono2 { font-family: 'JetBrains Mono', monospace; }
    .font-body { font-family: 'Inter', sans-serif; }
    @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.35} }
    .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
    @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .float-slow { animation: floatSlow 5s ease-in-out infinite; }
  `}</style>
);

const STEPS = [
  { icon: Search, title: 'Search', desc: 'Tell us your city and dates. Browse a verified fleet of sedans, SUVs, and luxury cars near you.' },
  { icon: Calendar, title: 'Book', desc: 'Pick a car, choose your dates, and book instantly or request approval from the host — your call.' },
  { icon: KeyRound, title: 'Drive', desc: 'Meet your host, do a quick handover, and hit the road. Insurance and support are included on every trip.' }
];

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Every car is verified', desc: 'Documents, insurance, and photos are checked by our team before a listing goes live.' },
  { icon: Users, title: 'Reviewed hosts and renters', desc: 'Ratings go both ways, so you always know who you\'re dealing with.' },
  { icon: DollarSign, title: 'No hidden fees', desc: 'The price you see is the price you pay — insurance and support included.' },
  { icon: Clock, title: '24/7 support', desc: 'Something come up mid-trip? Our support line is always on.' }
];

const STATS = [
  ['5,000+', 'Verified cars'],
  ['40,000+', 'Trips completed'],
  ['4.8★', 'Average host rating'],
  ['20', 'Cities across Nigeria']
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white font-body">
      <GlobalStyle />

      {/* Nav */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="DriveMate" className="h-9 w-9 object-contain" />
          <span className="font-display text-xl font-bold text-slate-900">DriveMate</span>
        </div>
        <button onClick={onGetStarted} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
          Browse cars
        </button>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 85% 70%, rgba(34,211,238,0.2), transparent 45%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full pulse-dot" />
              <span className="text-sm font-mono2 text-cyan-200">Nigeria's verified car-sharing marketplace</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-[1.1]">
              Rent a car from<span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">real people near you</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg font-body">
              DriveMate connects you with verified car owners across Nigeria. Better prices than traditional rentals, insurance included, and a car for every trip.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onGetStarted} className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-display font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
                Browse cars <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onGetStarted} className="px-7 py-3.5 border border-white/20 text-white rounded-xl font-display font-semibold hover:bg-white/10 transition-all">
                List your car
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="float-slow bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm ml-auto">
              <img src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80" alt="Toyota Camry" className="w-full h-40 object-cover rounded-xl mb-4" />
              <div className="flex items-center justify-between mb-2">
                <p className="font-display font-bold">Toyota Camry 2023</p>
                <span className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />4.9</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Lagos, VI</span>
                <span className="font-mono2 text-cyan-300">₦35,000/day</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(([value, label]) => (
              <div key={label} className="text-center md:text-left">
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 font-mono2 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-indigo-500 font-mono2 mb-3">How it works</p>
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Three steps to your next drive</h2>
          <p className="text-slate-500 font-body">No paperwork queues, no rental counters. Just search, book, and go.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-8">
              <span className="absolute top-6 right-6 font-mono2 text-4xl font-bold text-slate-200">0{i + 1}</span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-widest text-indigo-500 font-mono2 mb-3">Why DriveMate</p>
            <h2 className="font-display text-3xl font-bold text-slate-900">Built on trust, backed by verification</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <Icon className="w-7 h-7 text-indigo-500 mb-4" />
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Ready to hit the road?</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto font-body">Join thousands of renters and hosts already using DriveMate across Nigeria.</p>
        <button onClick={onGetStarted} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-display font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all inline-flex items-center gap-2">
          Get started <ArrowRight className="w-4 h-4" />
        </button>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400 font-body">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Free to browse</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />No card required to sign up</span>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-400 text-sm font-body">© 2026 DriveMate. All rights reserved.</p>
          <span className="text-slate-400 text-sm font-body">🇳🇬 Made for Nigeria</span>
        </div>
      </footer>
    </div>
  );
}