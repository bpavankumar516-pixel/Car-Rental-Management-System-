import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Shield,
  Calendar,
  Car,
  DollarSign,
  X,
  Check,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Header({ activeTab, globalSearch, setGlobalSearch, setActiveTab }) {
  const { user, darkMode, toggleDarkMode, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markAllRead,
    dismissNotification,
    markNotificationRead
  } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'PK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getBreadcrumbLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'cars': return 'Vehicle Inventory';
      case 'availability': return 'Car Availability Control';
      case 'customers': return 'Customer Directory';
      case 'bookings': return 'Rental Reservations';
      case 'reports': return 'Reports & Analytics';
      case 'profile': return 'My Profile';
      case 'settings': return 'System Settings';
      default: return 'Overview';
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    dismissNotification(id);
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.targetTab && setActiveTab) {
      setActiveTab(notif.targetTab);
    }
    setNotifOpen(false);
  };

  const getNotifMeta = (type) => {
    switch (type) {
      case 'car':
        return { Icon: Car, color: 'bg-blue-50 text-blue-600 border border-blue-200/60' };
      case 'booking':
        return { Icon: Calendar, color: 'bg-red-50 text-red-600 border border-red-200/60' };
      case 'customer':
        return { Icon: User, color: 'bg-amber-50 text-amber-600 border border-amber-200/60' };
      case 'payment':
        return { Icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' };
      case 'settings':
      case 'profile':
        return { Icon: Settings, color: 'bg-purple-50 text-purple-600 border border-purple-200/60' };
      default:
        return { Icon: Bell, color: 'bg-slate-100 text-slate-700 border border-slate-200' };
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs gap-4">
      
      {/* Left: Breadcrumbs & Search Bar */}
      <div className="flex items-center gap-6">
        
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-900 font-bold">{getBreadcrumbLabel(activeTab)}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-64 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cars, customers, reservations..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-slate-100/80 border-none rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Tools & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        
        {/* Theme Mode Toggle (Sun/Moon) */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-xl border border-slate-200/80 bg-slate-100/60 hover:bg-slate-200/80 text-slate-700 transition-all cursor-pointer shadow-2xs"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Language Selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
          <span>English</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Real-time Notifications Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            title="Notifications"
            className="relative p-2 rounded-xl border border-slate-200/80 bg-slate-100/60 hover:bg-slate-200/80 text-slate-700 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Panel Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200/90 shadow-2xl py-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">Real-Time Application Feed</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-700">All caught up! 🎉</p>
                    <p className="text-[11px] text-slate-400">No active activity logs found.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const { Icon, color } = getNotifMeta(notif.type);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-xs truncate ${notif.unread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                {notif.title}
                              </p>
                              {notif.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug break-words">{notif.desc}</p>
                            <p className="text-[9px] font-semibold text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDismissNotification(notif.id, e)}
                          title="Dismiss"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Action */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-center">
                <button
                  onClick={() => {
                    setActiveTab && setActiveTab('dashboard');
                    setNotifOpen(false);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                >
                  View Activity Timeline →
                </button>
              </div>

            </div>
          )}
        </div>

        {/* User Profile Container with Dropdown */}
        <div className="relative border-l border-slate-200/80 pl-3" ref={dropdownRef}>
          <div
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            title="Account Menu"
            className="flex items-center gap-1.5 cursor-pointer p-1 rounded-full hover:bg-slate-100/80 transition-all select-none"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 border border-slate-800">
              {getInitials(user?.name)}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Interactive Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* User Identity Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                    {getInitials(user?.name)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Pavan Kumar'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'pavan@rentacarpro.com'}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200/60">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab && setActiveTab('profile');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab && setActiveTab('settings');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout Divider & Action */}
              <div className="border-t border-slate-100 p-1.5 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
