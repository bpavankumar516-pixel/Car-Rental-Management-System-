import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2, ShieldCheck, Printer, Calendar, User, FileText } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { useToast } from '../../context/ToastContext';

export default function BookingSummaryModal({ isOpen, onClose, summaryData, onConfirmed }) {
  const { createBooking } = useBookings();
  const { addToast } = useToast();

  if (!summaryData) return null;

  const handleConfirm = () => {
    const created = createBooking(summaryData);
    addToast(`Reservation ${created.id} confirmed successfully!`, 'success');
    onConfirmed();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rental Booking Summary & Receipt" maxWidth="max-w-xl">
      <div className="space-y-5">
        
        {/* Receipt Header Badge */}
        <div className="text-center py-3 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl border border-cyan-500/30">
          <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-pulse" />
          <h4 className="text-base font-extrabold text-white">DrivePulse Official Reservation</h4>
          <p className="text-xs text-slate-400">Review specs before confirming reservation</p>
        </div>

        {/* Specs breakdown grid */}
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3 text-xs">
          
          {/* Car Info */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <p className="text-slate-400 font-medium">Selected Vehicle</p>
              <p className="text-sm font-bold text-white mt-0.5">{summaryData.carName}</p>
            </div>
            <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-cyan-400 font-bold rounded-lg">
              ${summaryData.pricePerDay} / day
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-700/60 pb-3">
            <div>
              <p className="text-slate-400 font-medium">Renter Name</p>
              <p className="font-semibold text-white mt-0.5">{summaryData.customerName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Driving License</p>
              <p className="font-mono text-cyan-400 font-semibold mt-0.5">{summaryData.licenseNumber}</p>
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-700/60 pb-3">
            <div>
              <p className="text-slate-400 font-medium">Pickup Date</p>
              <p className="font-semibold text-white mt-0.5">{summaryData.pickupDate}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Return Date</p>
              <p className="font-semibold text-white mt-0.5">{summaryData.returnDate}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Total Days</p>
              <p className="font-bold text-cyan-400 mt-0.5">{summaryData.totalDays} Days</p>
            </div>
          </div>

          {/* Final Cost */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-white">Grand Total Amount:</span>
            <span className="text-2xl font-black text-emerald-400">${summaryData.totalCost}</span>
          </div>

        </div>

        {/* Protection Note */}
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Includes standard insurance, 24/7 roadside assistance & free cancellation up to 24h prior.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Back to Edit
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Confirm Reservation
          </button>
        </div>

      </div>
    </Modal>
  );
}
