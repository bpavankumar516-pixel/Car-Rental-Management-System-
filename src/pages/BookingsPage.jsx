import React, { useState } from 'react';
import { CalendarPlus, Search, CheckCircle, XCircle, Eye, Calendar, User, Car, DollarSign, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import BookingDetailPage from './BookingDetailPage';

export default function BookingsPage({ onOpenNewBooking }) {
  const { bookings, cancelBooking, completeBooking } = useBookings();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [cancelTarget, setCancelTarget] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);

  // Financial KPI calculations
  const totalBookingsCount = bookings.length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'Active' || b.status === 'Confirmed').length;
  const totalPaidRevenue = bookings
    .filter((b) => b.paymentStatus === 'Paid' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const totalPendingRevenue = bookings
    .filter((b) => b.paymentStatus === 'Pending' || b.status === 'Active')
    .reduce((sum, b) => sum + (b.totalCost || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !search ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      (b.transactionId && b.transactionId.toLowerCase().includes(search.toLowerCase())) ||
      b.carName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const currentPayStatus = b.paymentStatus || (b.status === 'Completed' ? 'Paid' : b.status === 'Cancelled' ? 'Refunded' : 'Pending');
    const matchesPayment = paymentFilter === 'All' || currentPayStatus === paymentFilter;

    let matchesDate = true;
    if (fromDate) {
      matchesDate = matchesDate && new Date(b.pickupDate) >= new Date(fromDate);
    }
    if (toDate) {
      matchesDate = matchesDate && new Date(b.returnDate) <= new Date(toDate);
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const handleCancelConfirm = () => {
    if (cancelTarget) {
      cancelBooking(cancelTarget.id, cancelTarget.carId);
      addToast(`Booking ${cancelTarget.id} cancelled (Payment Refunded)`, 'info');
      setCancelTarget(null);
    }
  };

  const handleComplete = (bookingId, carId) => {
    completeBooking(bookingId, carId);
    addToast(`Rental ${bookingId} Completed & Marked as Paid!`, 'success');
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setFromDate('');
    setToDate('');
  };

  if (detailBooking) {
    return (
      <BookingDetailPage
        booking={detailBooking}
        onBack={() => setDetailBooking(null)}
        onComplete={handleComplete}
        onCancel={(b) => setCancelTarget(b)}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Reservations & Payment Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Unified management for vehicle bookings, payment statuses, and transaction records</p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" /> Create New Reservation
        </button>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Reservations</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalBookingsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Rentals</p>
            <p className="text-2xl font-black text-red-600 mt-1">{activeBookingsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Paid Revenue</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">${totalPaidRevenue}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Payments</p>
            <p className="text-2xl font-black text-amber-600 mt-1">${totalPendingRevenue}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, TXN Ref, Customer, or Car..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Reservation Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="All">All Rental Statuses</option>
              <option value="Active">Active Rentals</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Refunded">Refunded Only</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

        </div>

        {(search || statusFilter !== 'All' || paymentFilter !== 'All' || fromDate || toDate) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Bookings & Payments Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No reservation records found matching search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Reservation & TXN</th>
                  <th className="p-4">Vehicle Rented</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Rental Duration</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Rental Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.map((b) => {
                  const payStatus = b.paymentStatus || (b.status === 'Completed' ? 'Paid' : b.status === 'Cancelled' ? 'Refunded' : 'Pending');

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div
                          onClick={() => setDetailBooking(b)}
                          className="font-bold text-red-600 cursor-pointer hover:underline"
                          title="View Reservation Details"
                        >
                          {b.id}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {b.transactionId || 'TXN-884192'}
                        </div>
                      </td>

                      <td
                        onClick={() => setDetailBooking(b)}
                        className="p-4 font-bold text-slate-900 cursor-pointer hover:text-red-500 transition-colors"
                        title="View Reservation Details"
                      >
                        {b.carName}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.customerMobile}</div>
                      </td>

                      <td className="p-4 text-slate-500">
                        <div>{b.pickupDate} → {b.returnDate}</div>
                        <div className="text-[11px] text-red-500 font-bold">{b.totalDays} Days</div>
                      </td>

                      <td className="p-4 font-black text-slate-900 text-sm">
                        ${b.totalCost}
                      </td>

                      {/* Rental Status Column */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'Active' || b.status === 'Confirmed'
                              ? 'bg-red-500 text-white'
                              : b.status === 'Completed'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailBooking(b)}
                            title="View Reservation Details"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {b.status === 'Active' && (
                            <>
                              <button
                                onClick={() => handleComplete(b.id, b.carId)}
                                title="Complete Rental"
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Complete
                              </button>
                              <button
                                onClick={() => setCancelTarget(b)}
                                title="Cancel Booking"
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
        message={`Are you sure you want to cancel booking ${cancelTarget?.id}? Payment status will be set to Refunded.`}
        confirmText="Cancel Reservation"
      />

    </div>
  );
}
