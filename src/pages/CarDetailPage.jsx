import React from 'react';
import { ArrowLeft, Fuel, Gauge, Users, ShieldCheck, CheckCircle2, CalendarCheck, Edit3, Car, Zap, Award } from 'lucide-react';

export default function CarDetailPage({ car, onBack, onBook, onEdit }) {
  if (!car) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs my-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Vehicle Record Not Found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fleet List
        </button>
      </div>
    );
  }

  const defaultFeatures = [
    'GPS Touchscreen Navigation',
    '360° Surround View Camera',
    'Premium Leather Interior',
    'Wireless Apple CarPlay & Android Auto',
    'Adaptive Cruise Control',
    'Heated & Ventilated Front Seats',
    'Keyless Push Button Start',
    'Blinded Spot Warning Monitor'
  ];

  const featuresList = car.features && car.features.length > 0 ? car.features : defaultFeatures;

  return (
    <div className="space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-2 font-bold text-xs shrink-0"
            title="Back to Car Fleet Page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fleet</span>
          </button>

          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {car.brand} {car.model}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                {car.year}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Vehicle ID: {car.id} • Full Specifications & Rental Details</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onEdit && (
            <button
              onClick={() => onEdit(car)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Specs
            </button>
          )}

          {car.availabilityStatus === 'Available' && onBook && (
            <button
              onClick={() => onBook(car)}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" /> Book Vehicle Now
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Detail Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Hero Image Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Price Badge Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-lg">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Daily Rate</span>
              <span className="text-2xl font-black text-slate-900">${car.pricePerDay}</span>
              <span className="text-xs font-semibold text-slate-400"> / 24 hours</span>
            </div>

            {/* Status Pill Overlay */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md ${
                  car.availabilityStatus === 'Available'
                    ? 'bg-emerald-500 text-white'
                    : car.availabilityStatus === 'Booked'
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {car.availabilityStatus}
              </span>
            </div>
          </div>

          {/* Highlights & Guarantees */}
          <div className="grid grid-cols-3 gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">Fully Insured</p>
              <p className="text-[10px] text-slate-400">$0 Collision Waiver</p>
            </div>
            <div className="space-y-1 border-x border-slate-100">
              <Zap className="w-5 h-5 text-amber-500 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">Instant Booking</p>
              <p className="text-[10px] text-slate-400">Immediate Pickup</p>
            </div>
            <div className="space-y-1">
              <Award className="w-5 h-5 text-blue-500 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">Premium Clean</p>
              <p className="text-[10px] text-slate-400">Sanitized Fleet</p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Detailed Specs & Features */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Technical Performance Specs */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Performance Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Fuel className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-[11px]">Fuel Type</span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-1">{car.fuelType}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Gauge className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-[11px]">Transmission</span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-1">{car.transmission}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-[11px]">Seating Capacity</span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-1">{car.seatingCapacity || 5} Seats</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Car className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-[11px]">Model Year</span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-1">{car.year}</p>
              </div>
            </div>
          </div>

          {/* Standard Included Features List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Included Equipment & Comfort
            </h3>

            <div className="space-y-2 text-xs">
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-100 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Daily Rate</p>
                <p className="text-2xl font-black">${car.pricePerDay} USD</p>
              </div>
              {car.availabilityStatus === 'Available' && onBook ? (
                <button
                  onClick={() => onBook(car)}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-red-500/30 transition-all"
                >
                  <CalendarCheck className="w-4 h-4" /> Reserve Vehicle
                </button>
              ) : (
                <span className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                  Currently {car.availabilityStatus}
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
