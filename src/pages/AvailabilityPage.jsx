import React, { useState } from 'react';
import { Car, CheckCircle2, Clock, Wrench, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useToast } from '../context/ToastContext';

export default function AvailabilityPage() {
  const { cars, updateCarAvailability } = useCars();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available');
  const bookedCars = cars.filter((c) => c.availabilityStatus === 'Booked');
  const maintenanceCars = cars.filter((c) => c.availabilityStatus === 'Maintenance');

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      !search ||
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      car.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = activeFilter === 'All' || car.availabilityStatus === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (carId, carName, newStatus) => {
    updateCarAvailability(carId, newStatus);
    addToast(`Updated ${carName} status to ${newStatus}`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Available
          </span>
        );
      case 'Booked':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Rented / Booked
          </span>
        );
      case 'Maintenance':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
            <Wrench className="w-3.5 h-3.5" /> Under Maintenance
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Car Availability & Status Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage real-time vehicle states across the entire fleet</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Real-time Context Sync</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Available Card */}
        <div
          onClick={() => setActiveFilter('Available')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Available'
              ? 'bg-emerald-50/50 border-emerald-500 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{availableCars.length}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Available Vehicles</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ready for immediate customer reservation</p>
        </div>

        {/* Rented Card */}
        <div
          onClick={() => setActiveFilter('Booked')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Booked'
              ? 'bg-blue-50/50 border-blue-500 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{bookedCars.length}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Rented / On Road</h3>
          <p className="text-xs text-slate-500 mt-0.5">Currently assigned to active customer bookings</p>
        </div>

        {/* Maintenance Card */}
        <div
          onClick={() => setActiveFilter('Maintenance')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Maintenance'
              ? 'bg-amber-50/50 border-amber-500 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{maintenanceCars.length}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">In Maintenance</h3>
          <p className="text-xs text-slate-500 mt-0.5">Service, oil change, or body repairs</p>
        </div>

      </div>

      {/* Controls & Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fleet by make, model, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100/80 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Available', 'Booked', 'Maintenance'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'Booked' ? 'Rented' : status}
            </button>
          ))}
        </div>

      </div>

      {/* Fleet Status Management Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {filteredCars.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">No vehicles found in this status category</p>
            <p className="text-xs text-slate-400">Try selecting a different filter or clearing search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Vehicle Detail</th>
                  <th className="p-4">Category / Specs</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Quick Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Vehicle */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image}
                          alt={car.model}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {car.brand} {car.model}
                          </div>
                          <div className="text-[11px] text-slate-400">Year: {car.year} | ID: {car.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-medium text-slate-800">{car.fuelType} • {car.transmission}</div>
                      <div className="text-[11px] text-slate-400">{car.seats || 5} Seats</div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ${car.pricePerDay} <span className="text-[10px] font-normal text-slate-400">/day</span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {getStatusBadge(car.availabilityStatus)}
                    </td>

                    {/* Status Dropdown Switcher */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={car.availabilityStatus}
                          onChange={(e) => handleStatusChange(car.id, `${car.brand} ${car.model}`, e.target.value)}
                          className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                        >
                          <option value="Available">Set Available</option>
                          <option value="Booked">Set Rented / Booked</option>
                          <option value="Maintenance">Set Maintenance</option>
                        </select>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
