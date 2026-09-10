import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCars } from '../../context/CarContext';
import { useCustomers } from '../../context/CustomerContext';

export default function NewBookingModal({ isOpen, onClose, selectedCarPreload = null, onProceedToSummary }) {
  const { cars } = useCars();
  const { customers } = useCustomers();

  // Filter only Available cars
  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available' || c.id === selectedCarPreload?.id);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customers.length > 0) setSelectedCustomerId(customers[0].id);
    if (selectedCarPreload) {
      setSelectedCarId(selectedCarPreload.id);
    } else if (availableCars.length > 0) {
      setSelectedCarId(availableCars[0].id);
    }

    // Default dates: tomorrow to +3 days
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setDate(today.getDate() + 4);

    setPickupDate(start.toISOString().split('T')[0]);
    setReturnDate(end.toISOString().split('T')[0]);
    setErrors({});
  }, [isOpen, selectedCarPreload]);

  const targetCar = cars.find((c) => c.id === selectedCarId);
  const targetCustomer = customers.find((cust) => cust.id === selectedCustomerId);

  // Auto-calculate total rental days
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalCost = targetCar ? totalDays * targetCar.pricePerDay : 0;

  const validate = () => {
    const errs = {};
    if (!selectedCustomerId) errs.customer = 'Please select a customer';
    if (!selectedCarId) errs.car = 'Please select an available car';
    if (!pickupDate) errs.pickupDate = 'Pickup date is required';
    if (!returnDate) errs.returnDate = 'Return date is required';
    if (totalDays <= 0) errs.returnDate = 'Return date must be after pickup date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const summaryPayload = {
      carId: targetCar.id,
      carName: `${targetCar.brand} ${targetCar.model}`,
      carImage: targetCar.image,
      pricePerDay: targetCar.pricePerDay,
      customerId: targetCustomer.id,
      customerName: targetCustomer.name,
      customerEmail: targetCustomer.email,
      customerMobile: targetCustomer.mobile,
      licenseNumber: targetCustomer.licenseNumber,
      pickupDate,
      returnDate,
      totalDays,
      totalCost
    };

    onProceedToSummary(summaryPayload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Rental Reservation" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Customer Select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Select Customer</label>
          {customers.length === 0 ? (
            <p className="text-xs text-red-400">No customers registered yet. Please add a customer first.</p>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile}) - Lic: {c.licenseNumber}
                </option>
              ))}
            </select>
          )}
          {errors.customer && <p className="text-[11px] text-red-400">{errors.customer}</p>}
        </div>

        {/* Car Select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Select Available Vehicle</label>
          {availableCars.length === 0 ? (
            <p className="text-xs text-red-400">No cars are currently available for booking.</p>
          ) : (
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            >
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year}) - ${car.pricePerDay}/day - [{car.availabilityStatus}]
                </option>
              ))}
            </select>
          )}
          {errors.car && <p className="text-[11px] text-red-400">{errors.car}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            />
            {errors.pickupDate && <p className="text-[11px] text-red-400">{errors.pickupDate}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            />
            {errors.returnDate && <p className="text-[11px] text-red-400">{errors.returnDate}</p>}
          </div>
        </div>

        {/* Calculation Realtime Summary Box */}
        {targetCar && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Daily Rate:</span>
              <span className="font-bold text-white">${targetCar.pricePerDay}/day</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Rental Duration:</span>
              <span className="font-bold text-cyan-400">{totalDays} Days</span>
            </div>
            <div className="pt-2 border-t border-cyan-500/30 flex items-center justify-between">
              <span className="text-sm font-bold text-white">Estimated Total Cost:</span>
              <span className="text-xl font-extrabold text-emerald-400">${totalCost}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={totalDays <= 0 || !targetCar}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20"
          >
            Review Booking Summary
          </button>
        </div>

      </form>
    </Modal>
  );
}
