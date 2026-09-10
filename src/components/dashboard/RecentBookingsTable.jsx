import React from 'react';
import { Calendar, User, DollarSign, ArrowRight } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function RecentBookingsTable({ onViewAll }) {
  const { bookings } = useBookings();
  const recentList = bookings.slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Recent Rental Bookings</h3>
          <p className="text-xs text-slate-400">Live reservation feed</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All Reservations <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">No rental bookings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Booking ID</th>
                <th className="p-3.5">Car Model</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Dates</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-cyan-400">{item.id}</td>
                  <td className="p-3.5 font-semibold text-white">{item.carName}</td>
                  <td className="p-3.5 text-slate-300">{item.customerName}</td>
                  <td className="p-3.5 text-slate-400">
                    {item.pickupDate} → {item.returnDate} ({item.totalDays}d)
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400">${item.totalCost}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === 'Active'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
