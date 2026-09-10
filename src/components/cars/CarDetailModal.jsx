import React from 'react';
import Modal from '../common/Modal';
import { Fuel, Gauge, Users, CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CarDetailModal({ isOpen, onClose, car, onBook }) {
  if (!car) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${car.brand} ${car.model} (${car.year})`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Banner Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Daily Rate: </span>
            <span className="text-lg font-black text-slate-900">${car.pricePerDay}</span>
            <span className="text-xs text-slate-400">/day</span>
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
            {car.availabilityStatus}
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Fuel className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-bold">Fuel Type</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{car.fuelType}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Gauge className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-bold">Transmission</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{car.transmission}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Users className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-bold">Seats</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{car.seatingCapacity} Passengers</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-bold">Insurance</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">Fully Covered</p>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            {(car.features || ['GPS Navigation', '360 Parking Sensor', 'Bluetooth Audio', 'Leather Seats']).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
          {car.availabilityStatus === 'Available' && (
            <button
              onClick={() => {
                onClose();
                onBook(car);
              }}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-red-500/25 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" /> Book This Car Now
            </button>
          )}
        </div>

      </div>
    </Modal>
  );
}
