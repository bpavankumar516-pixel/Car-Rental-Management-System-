import React from 'react';
import { Fuel, Gauge, Users, Calendar, Edit3, Trash2, Eye, CalendarCheck } from 'lucide-react';

export default function CarCard({ car, onViewDetails, onEdit, onDelete, onBook }) {
  const isAvailable = car.availabilityStatus === 'Available';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-xl group flex flex-col justify-between">
      
      {/* Image & Status Badge */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-cyan-400 border border-slate-700">
          {car.brand}
        </div>
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            isAvailable
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 backdrop-blur-md'
          }`}
        >
          {car.availabilityStatus}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              {car.model}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{car.year}</span>
          </div>

          {/* Specs Badges */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/60 p-2 rounded-xl">
              <Fuel className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 p-2 rounded-xl">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 p-2 rounded-xl">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{car.seatingCapacity} seats</span>
            </div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-white">${car.pricePerDay}</span>
            <span className="text-xs text-slate-400"> / day</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(car)}
              title="View Car Details"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(car)}
              title="Edit Car"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(car.id)}
              title="Delete Car"
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isAvailable && (
              <button
                onClick={() => onBook(car)}
                className="ml-1 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Book
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
