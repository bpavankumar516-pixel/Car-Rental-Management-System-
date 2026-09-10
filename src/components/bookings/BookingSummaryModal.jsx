import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
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
        <div className="text-center py-3 bg-red-50 rounded-2xl border border-red-100">
          <CheckCircle2 className="w-8 h-8 text-red-500 mx-auto mb-1 animate-pulse" />
          <h4 className="text-base font-extrabold text-slate-900">CARVO Official Reservation</h4>
          <p className="text-xs text-slate-500">Review specs before confirming reservation</p>
        </div>

        {/* Specs breakdown grid */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
          
          {/* Car Info */}
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <p className="text-slate-500 font-medium">Selected Vehicle</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{summaryData.carName}</p>
            </div>
            <span className="px-3 py-1 bg-white border border-slate-200 text-red-600 font-bold rounded-lg shadow-xs">
              ${summaryData.pricePerDay} / day
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <p className="text-slate-500 font-medium">Renter Name</p>
              <p className="font-semibold text-slate-900 mt-0.5">{summaryData.customerName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Driving License</p>
              <p className="font-mono text-red-600 font-semibold mt-0.5">{summaryData.licenseNumber}</p>
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <p className="text-slate-500 font-medium">Pickup Date</p>
              <p className="font-semibold text-slate-900 mt-0.5">{summaryData.pickupDate}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Return Date</p>
              <p className="font-semibold text-slate-900 mt-0.5">{summaryData.returnDate}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Total Days</p>
              <p className="font-bold text-red-600 mt-0.5">{summaryData.totalDays} Days</p>
            </div>
          </div>

          {/* Final Cost */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-slate-900">Grand Total Amount:</span>
            <span className="text-2xl font-black text-emerald-600">${summaryData.totalCost}</span>
          </div>

        </div>

        {/* Protection Note */}
        <div className="flex items-center gap-2.5 text-[11px] text-slate-600 bg-slate-100/80 p-3 rounded-xl border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Includes standard insurance, 24/7 roadside assistance & free cancellation up to 24h prior.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Back to Edit
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl text-xs shadow-md shadow-red-500/25 cursor-pointer"
          >
            Confirm Reservation
          </button>
        </div>

      </div>
    </Modal>
  );
}
