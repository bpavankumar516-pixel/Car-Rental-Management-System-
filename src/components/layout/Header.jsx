import React from 'react';
import { Bell, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ activeTab, globalSearch, setGlobalSearch }) {
  const { user } = useAuth();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'cars': return 'Car Fleet Inventory';
      case 'customers': return 'Customer Directory';
      case 'bookings': return 'Rental Reservations';
      default: return 'Portal';
    }
  };

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>DrivePulse</span>
          <span>/</span>
          <span className="text-cyan-400 capitalize">{activeTab}</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">{getBreadcrumbTitle()}</h2>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-4">
        
        {/* Global Search Bar */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Live System Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Context API</span>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

      </div>
    </header>
  );
}
