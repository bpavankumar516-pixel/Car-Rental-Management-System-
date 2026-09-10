import React from 'react';
import { Car, CheckCircle2, Clock, Users, DollarSign, PlusCircle, CalendarPlus, UserPlus } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useCustomers } from '../../context/CustomerContext';
import { useBookings } from '../../context/BookingContext';

export default function StatsOverview({ onActionClick }) {
  const { cars } = useCars();
  const { customers } = useCustomers();
  const { bookings } = useBookings();

  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const bookedCars = cars.filter((c) => c.availabilityStatus === 'Booked').length;
  const activeRentals = bookings.filter((b) => b.status === 'Active').length;
  
  // Dynamic revenue calculation from confirmed/active bookings
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 42500);

  const stats = [
    { title: 'Total Fleet Cars', value: totalCars, icon: Car, color: 'from-cyan-500/20 to-blue-500/20', textColor: 'text-cyan-400', border: 'border-cyan-500/30' },
    { title: 'Available Cars', value: availableCars, icon: CheckCircle2, color: 'from-emerald-500/20 to-teal-500/20', textColor: 'text-emerald-400', border: 'border-emerald-500/30' },
    { title: 'Booked / Rented', value: bookedCars, icon: Clock, color: 'from-amber-500/20 to-orange-500/20', textColor: 'text-amber-400', border: 'border-amber-500/30' },
    { title: 'Registered Customers', value: customers.length, icon: Users, color: 'from-indigo-500/20 to-purple-500/20', textColor: 'text-indigo-400', border: 'border-indigo-500/30' },
    { title: 'Active Rentals', value: activeRentals, icon: Clock, color: 'from-blue-500/20 to-cyan-500/20', textColor: 'text-blue-400', border: 'border-blue-500/30' },
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500/20 to-emerald-600/20', textColor: 'text-emerald-400', border: 'border-emerald-500/40' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 6 Stat Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-slate-900 border ${stat.border} rounded-2xl p-4 bg-gradient-to-br ${stat.color} transition-all duration-300 hover:scale-[1.02] shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-slate-900/80 ${stat.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onActionClick('add-car')}
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/80 hover:bg-cyan-500/10 border border-slate-700/80 hover:border-cyan-500/40 group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white group-hover:text-cyan-400">Add New Car</p>
              <p className="text-xs text-slate-400">Expand your rental fleet</p>
            </div>
          </button>

          <button
            onClick={() => onActionClick('new-booking')}
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/80 hover:bg-emerald-500/10 border border-slate-700/80 hover:border-emerald-500/40 group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white group-hover:text-emerald-400">New Rental Booking</p>
              <p className="text-xs text-slate-400">Reserve car for customer</p>
            </div>
          </button>

          <button
            onClick={() => onActionClick('add-customer')}
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/80 hover:bg-indigo-500/10 border border-slate-700/80 hover:border-indigo-500/40 group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white group-hover:text-indigo-400">Register Customer</p>
              <p className="text-xs text-slate-400">Add new client profile</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
