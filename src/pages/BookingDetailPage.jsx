import React from 'react';
import { ArrowLeft, Car, User, Calendar, DollarSign, Printer, CheckCircle, XCircle, ShieldCheck, Clock, FileText } from 'lucide-react';

export default function BookingDetailPage({ booking, onBack, onComplete, onCancel }) {
  if (!booking) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs my-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Reservation Record Not Found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Reservations List
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-2 font-bold text-xs shrink-0"
            title="Back to Reservations List"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reservations</span>
          </button>

          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Reservation {booking.id}
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'Active' || booking.status === 'Confirmed'
                    ? 'bg-red-500 text-white'
                    : booking.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {booking.status}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Created Date: {booking.createdAt || '2026-09-08'} • Full Rental Contract & Invoice</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>

          {booking.status === 'Active' && (
            <>
              <button
                onClick={() => onComplete(booking.id, booking.carId)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/25"
              >
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
              <button
                onClick={() => onCancel(booking)}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> Cancel Booking
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main 2-Column Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Vehicle & Customer Summary */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Rented Vehicle Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-red-500" /> Rented Vehicle Details
              </h3>
              <span className="text-xs font-mono text-slate-400">ID: {booking.carId}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={booking.carImage || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'}
                  alt={booking.carName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs flex-1 w-full">
                <p className="text-base font-black text-slate-900">{booking.carName}</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Daily Rate</span>
                    <span className="font-bold text-slate-900">${booking.pricePerDay || 150} / day</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Days</span>
                    <span className="font-bold text-red-600">{booking.totalDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Customer Information
              </h3>
              <span className="text-xs font-mono text-slate-400">ID: {booking.customerId || 'cust-1'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Name</p>
                <p className="font-black text-slate-900 text-sm">{booking.customerName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="font-bold text-slate-900">{booking.customerMobile || '+1 (555) 234-5678'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 sm:col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="font-bold text-slate-900">{booking.customerEmail || 'customer@example.com'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Timeline & Financial Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Timeline & Schedule */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-emerald-500" /> Rental Timeline & Dates
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-700">Pickup Date</span>
                </div>
                <span className="font-black text-slate-900">{booking.pickupDate}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-slate-700">Return Date</span>
                </div>
                <span className="font-black text-slate-900">{booking.returnDate}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="font-bold text-red-700">Duration</span>
                <span className="font-black text-red-700">{booking.totalDays} Rental Days</span>
              </div>
            </div>
          </div>

          {/* Pricing & Invoice Total */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Payment & Billing Summary
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  booking.paymentStatus === 'Paid' || booking.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : booking.paymentStatus === 'Refunded' || booking.status === 'Cancelled'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {booking.paymentStatus || (booking.status === 'Completed' ? 'Paid' : booking.status === 'Cancelled' ? 'Refunded' : 'Pending')}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Transaction Ref:</span>
                  <span className="font-mono font-bold text-slate-900">{booking.transactionId || 'TXN-884192'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Payment Method:</span>
                  <span className="font-bold text-slate-900">{booking.paymentMethod || 'Credit Card'}</span>
                </div>
                {(booking.paidAt || booking.status === 'Completed') && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Date Paid:</span>
                    <span className="font-bold text-emerald-600">{booking.paidAt || booking.createdAt || '2026-09-08'}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between py-1">
                <span>Daily Rental Fee ({booking.totalDays} days @ ${booking.pricePerDay || 150}/day)</span>
                <span className="font-bold text-slate-900">${(booking.totalDays || 1) * (booking.pricePerDay || 150)}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100">
                <span>Insurance Coverage</span>
                <span className="font-bold text-emerald-600">Included</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100">
                <span>Security Deposit (Refundable)</span>
                <span className="font-bold text-slate-900">$200.00</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-600 text-xl">${booking.totalCost}</span>
              </div>
            </div>
          </div>

          {/* Return Action */}
          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Reservations Directory
          </button>

        </div>

      </div>

    </div>
  );
}
