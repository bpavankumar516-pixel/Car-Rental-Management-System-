import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCars } from '../../context/CarContext';
import { useCustomers } from '../../context/CustomerContext';

export default function NewBookingModal({ isOpen, onClose, selectedCarPreload = null, onProceedToSummary }) {
  const { cars } = useCars();
  const { customers } = useCustomers();

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
          <label className="text-xs font-semibold text-slate-700">Select Customer</label>
          {customers.length === 0 ? (
            <p className="text-xs text-red-500">No customers registered yet. Please add a customer first.</p>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile}) - Lic: {c.licenseNumber}
                </option>
              ))}
            </select>
          )}
          {errors.customer && <p className="text-[11px] text-red-500 font-medium">{errors.customer}</p>}
        </div>

        {/* Car Select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Select Available Vehicle</label>
          {availableCars.length === 0 ? (
            <p className="text-xs text-red-500">No cars are currently available for booking.</p>
          ) : (
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year}) - ${car.pricePerDay}/day - [{car.availabilityStatus}]
                </option>
              ))}
            </select>
          )}
          {errors.car && <p className="text-[11px] text-red-500 font-medium">{errors.car}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.pickupDate && <p className="text-[11px] text-red-500 font-medium">{errors.pickupDate}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.returnDate && <p className="text-[11px] text-red-500 font-medium">{errors.returnDate}</p>}
          </div>
        </div>

        {/* Summary Box */}
        {targetCar && (
          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Daily Rate:</span>
              <span className="font-bold text-slate-900">${targetCar.pricePerDay}/day</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Rental Duration:</span>
              <span className="font-bold text-red-600">{totalDays} Days</span>
            </div>
            <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Estimated Total Cost:</span>
              <span className="text-xl font-extrabold text-emerald-600">${totalCost}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={totalDays <= 0 || !targetCar}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/25 cursor-pointer"
          >
            Review Booking Summary
          </button>
        </div>

      </form>
    </Modal>
  );
}
