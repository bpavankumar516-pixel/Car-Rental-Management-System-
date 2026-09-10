import React from 'react';
import { Search, Bell, Settings, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ globalSearch, setGlobalSearch, setActiveTab }) {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'PK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      
      {/* Left: Search Bar */}
      <div className="relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search cars, customers, reservations..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-full bg-slate-100/80 border-none rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
        />
      </div>

      {/* Right Tools & User Profile */}
      <div className="flex items-center gap-5">
        
        {/* Language Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
          <span>English</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notifications Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Settings Gear */}
        <button
          onClick={() => setActiveTab && setActiveTab('settings')}
          title="Open Settings"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Clickable Area */}
        <div
          onClick={() => setActiveTab && setActiveTab('profile')}
          title="View Profile"
          className="flex items-center gap-3 pl-3 border-l border-slate-200/80 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block text-left truncate max-w-[150px]">
            <p className="text-xs font-bold text-slate-900 leading-none truncate">{user?.name || 'Pavan Kumar'}</p>
            <p className="text-[10px] text-slate-400 truncate mt-1">{user?.email || 'pavan@rentacarpro.com'}</p>
          </div>
        </div>

      </div>

    </header>
  );
}
