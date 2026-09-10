import React from 'react';
import { Car, Calendar, ShieldCheck, UserCheck, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, bookingsCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('fleet')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                DrivePulse
              </span>
              <span className="block text-xs text-cyan-400 font-medium tracking-wide">CAR RENTAL SYSTEM</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'fleet'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-4 h-4" />
              Explore Fleet
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'bookings'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings
              {bookingsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-full">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Admin Portal
            </button>
          </div>

          {/* Action Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>24/7 Premium Concierge</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveTab('fleet'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
              activeTab === 'fleet' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Car className="w-5 h-5" />
            Explore Fleet
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
              activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              My Bookings
            </div>
            {bookingsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-full">
                {bookingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
              activeTab === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Portal
          </button>
        </div>
      )}
    </nav>
  );
}
