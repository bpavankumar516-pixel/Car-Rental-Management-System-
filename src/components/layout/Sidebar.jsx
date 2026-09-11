import React from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
  };

  const getInitials = (name) => {
    if (!name) return 'PK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navSections = [
    {
      title: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Vehicle Management',
      items: [
        { id: 'cars', label: 'Cars', icon: Car },
        { id: 'availability', label: 'Availability Control', icon: Activity }
      ]
    },
    {
      title: 'Customer Management',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'bookings', label: 'Reservations', icon: Calendar }
      ]
    },
    {
      title: 'Financial & Reports',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'payments', label: 'Payments', icon: CreditCard }
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'My Profile', icon: User }
      ]
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      
      {/* Brand Header */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="h-16 flex items-center px-5 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8.5 h-8.5 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/25">
              <Car className="w-4.5 h-4.5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">CARVO</span>
          </div>
        </div>

        {/* Grouped Nav Items */}
        <nav className="p-3 space-y-3.5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {section.title && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (activeTab === 'cars' && item.id === 'cars') || (activeTab === 'bookings' && item.id === 'bookings');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs hover:border-slate-300 transition-colors">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate leading-none">{user?.name || 'Pavan Kumar'}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'pavan@rentacarpro.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
