import React from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';
import { Car, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ setActiveTab, onOpenAddCar, onOpenNewBooking, onOpenAddCustomer }) {
  const { user } = useAuth();

  const handleActionClick = (action) => {
    if (action === 'add-car') onOpenAddCar();
    else if (action === 'new-booking') onOpenNewBooking();
    else if (action === 'add-customer') onOpenAddCustomer();
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Fleet Control Center
          </div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-cyan-400">{user?.name || 'Manager'}</span>! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Here is your live rental fleet performance summary, availability counters, active customer count, and quick shortcuts.
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0"
        >
          + Create New Reservation
        </button>
      </div>

      {/* Stats Overview Component */}
      <StatsOverview onActionClick={handleActionClick} />

      {/* Recent Bookings Live Feed */}
      <RecentBookingsTable onViewAll={() => setActiveTab('bookings')} />

    </div>
  );
}
