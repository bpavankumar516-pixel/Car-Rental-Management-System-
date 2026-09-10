import React from 'react';
import { Fuel, Gauge, Users, Edit3, Trash2, Eye, CalendarCheck } from 'lucide-react';

export default function CarCard({ car, onViewDetails, onEdit, onDelete, onBook }) {
  const isAvailable = car.availabilityStatus === 'Available';

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 shadow-xs group flex flex-col justify-between">
      
      {/* Image & Status Badge */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-900 border border-slate-200 shadow-xs">
          {car.brand}
        </div>
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isAvailable
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-amber-500 text-white shadow-xs'
          }`}
        >
          {car.availabilityStatus}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-500 transition-colors">
              {car.model}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{car.year}</span>
          </div>

          {/* Specs Badges */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Fuel className="w-3.5 h-3.5 text-red-500" />
              <span className="truncate">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Gauge className="w-3.5 h-3.5 text-red-500" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Users className="w-3.5 h-3.5 text-red-500" />
              <span>{car.seatingCapacity} seats</span>
            </div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">${car.pricePerDay}</span>
            <span className="text-xs text-slate-400"> / day</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(car)}
              title="View Car Details"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(car)}
              title="Edit Car"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(car.id)}
              title="Delete Car"
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isAvailable && (
              <button
                onClick={() => onBook(car)}
                className="ml-1 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-red-500/25 transition-colors cursor-pointer"
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
