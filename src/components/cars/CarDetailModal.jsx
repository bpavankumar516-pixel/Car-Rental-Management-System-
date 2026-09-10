import React from 'react';
import Modal from '../common/Modal';
import { Fuel, Gauge, Users, CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CarDetailModal({ isOpen, onClose, car, onBook }) {
  if (!car) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${car.brand} ${car.model} (${car.year})`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Banner Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-400">Daily Rate: </span>
            <span className="text-lg font-black text-white">${car.pricePerDay}</span>
            <span className="text-xs text-slate-400">/day</span>
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
            {car.availabilityStatus}
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <Fuel className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Fuel Type</p>
            <p className="text-sm font-bold text-white mt-0.5">{car.fuelType}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <Gauge className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Transmission</p>
            <p className="text-sm font-bold text-white mt-0.5">{car.transmission}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Seats</p>
            <p className="text-sm font-bold text-white mt-0.5">{car.seatingCapacity} Passengers</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Insurance</p>
            <p className="text-sm font-bold text-white mt-0.5">Fully Covered</p>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Premium Vehicle Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            {(car.features || ['GPS Navigation', '360 Parking Sensor', 'Bluetooth Audio', 'Leather Seats']).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Close
          </button>
          {car.availabilityStatus === 'Available' && (
            <button
              onClick={() => {
                onClose();
                onBook(car);
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <CalendarCheck className="w-4 h-4" /> Book This Car Now
            </button>
          )}
        </div>

      </div>
    </Modal>
  );
}
