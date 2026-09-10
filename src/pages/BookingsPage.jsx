import React, { useState } from 'react';
import { CalendarPlus, Search, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function BookingsPage({ onOpenNewBooking }) {
  const { bookings, cancelBooking, completeBooking } = useBookings();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !search ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.carName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancelConfirm = () => {
    if (cancelTarget) {
      cancelBooking(cancelTarget.id, cancelTarget.carId);
      addToast(`Booking ${cancelTarget.id} has been cancelled and car is now available`, 'info');
      setCancelTarget(null);
    }
  };

  const handleComplete = (bookingId, carId) => {
    completeBooking(bookingId, carId);
    addToast(`Rental ${bookingId} marked as Completed`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white">Rental Reservations & History</h2>
          <p className="text-xs text-slate-400">Total Bookings: {bookings.length} Records</p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" /> Create New Reservation
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Customer, or Car..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Rentals</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No bookings found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Reservation ID</th>
                  <th className="p-4">Vehicle Model</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Rental Duration</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-cyan-400">{b.id}</td>
                    <td className="p-4 font-semibold text-white">{b.carName}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.customerMobile}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <div>{b.pickupDate} → {b.returnDate}</div>
                      <div className="text-[11px] text-cyan-400 font-bold">{b.totalDays} Days</div>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-400 text-sm">${b.totalCost}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          b.status === 'Active'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : b.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.status === 'Active' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleComplete(b.id, b.carId)}
                            title="Complete Rental"
                            className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Complete
                          </button>
                          <button
                            onClick={() => setCancelTarget(b)}
                            title="Cancel Booking"
                            className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Rental Booking"
        message={`Are you sure you want to cancel booking ${cancelTarget?.id}? The vehicle will be returned to Available state.`}
        confirmText="Cancel Reservation"
      />

    </div>
  );
}
