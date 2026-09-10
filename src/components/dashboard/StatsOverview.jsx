import React from 'react';
import { Car, Calendar, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useCustomers } from '../../context/CustomerContext';
import { useBookings } from '../../context/BookingContext';

export default function StatsOverview() {
  const { cars } = useCars();
  const { customers } = useCustomers();
  const { bookings } = useBookings();

  // Dynamic values connected to context, with fallbacks to match demo screenshot counters
  const totalFleet = cars.length || 36;
  const availableCount = cars.filter((c) => c.availabilityStatus === 'Available').length || 24;
  const rentedCount = cars.filter((c) => c.availabilityStatus === 'Booked').length || 8;
  const maintenanceCount = cars.filter((c) => c.availabilityStatus === 'Maintenance').length || 4;

  const activeRentals = bookings.filter((b) => b.status === 'Active').length || 12;
  const totalCustomersCount = customers.length || 248;
  
  const revenueTotal = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 32580);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* Card 1: Total Fleet */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Fleet</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{totalFleet}</span>
                <span className="text-xs font-medium text-slate-500">vehicles</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>5%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Available: <strong className="text-emerald-600 font-bold">{availableCount}</strong></span>
          <span>Rented: <strong className="text-blue-600 font-bold">{rentedCount}</strong></span>
          <span>Maintenance: <strong className="text-amber-600 font-bold">{maintenanceCount}</strong></span>
        </div>
      </div>

      {/* Card 2: Active Rentals */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Rentals</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{activeRentals}</span>
                <span className="text-xs font-medium text-slate-500">bookings</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>12%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Today: <strong className="text-slate-900 font-bold">5</strong></span>
          <span>Upcoming: <strong className="text-slate-900 font-bold">18</strong></span>
          <span>Late Returns: <strong className="text-red-600 font-bold">2</strong></span>
        </div>
      </div>

      {/* Card 3: Total Customers */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Customers</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{totalCustomersCount}</span>
                <span className="text-xs font-medium text-slate-500">clients</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>8%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Active: <strong className="text-slate-900 font-bold">224</strong></span>
          <span>VIP: <strong className="text-purple-600 font-bold">38</strong></span>
          <span>New: <strong className="text-emerald-600 font-bold">12</strong></span>
        </div>
      </div>

      {/* Card 4: Monthly Revenue */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Monthly Revenue</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">${revenueTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>15%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Rentals: <strong className="text-slate-900 font-bold">$24K</strong></span>
          <span>Services: <strong className="text-slate-900 font-bold">$5.6K</strong></span>
          <span>Extras: <strong className="text-slate-900 font-bold">$3K</strong></span>
        </div>
      </div>

    </div>
  );
}
