import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCars } from '../../context/CarContext';
import { useToast } from '../../context/ToastContext';

export default function CarFormModal({ isOpen, onClose, initialData = null }) {
  const { addCar, updateCar } = useCars();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2024,
    pricePerDay: 85,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        brand: '',
        model: '',
        year: 2024,
        pricePerDay: 85,
        fuelType: 'Electric',
        transmission: 'Automatic',
        seatingCapacity: 5,
        availabilityStatus: 'Available',
        image: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.brand.trim()) errs.brand = 'Brand is required';
    if (!formData.model.trim()) errs.model = 'Model is required';
    if (!formData.pricePerDay || formData.pricePerDay <= 0) errs.pricePerDay = 'Valid price per day is required';
    if (!formData.year || formData.year < 1990) errs.year = 'Valid year is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateCar(initialData.id, formData);
      addToast('Car updated successfully!', 'success');
    } else {
      addCar(formData);
      addToast('New car added to inventory!', 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Car Specifications' : 'Add New Car to Fleet'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Brand & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Tesla, BMW, Audi"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.brand && <p className="text-[11px] text-red-500 font-medium">{errors.brand}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Model Name</label>
            <input
              type="text"
              placeholder="e.g. Model Y, M5"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.model && <p className="text-[11px] text-red-500 font-medium">{errors.model}</p>}
          </div>
        </div>

        {/* Year & Daily Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Manufacturing Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.year && <p className="text-[11px] text-red-500 font-medium">{errors.year}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Price Per Day ($)</label>
            <input
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {errors.pricePerDay && <p className="text-[11px] text-red-500 font-medium">{errors.pricePerDay}</p>}
          </div>
        </div>

        {/* Fuel & Transmission */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Fuel Type</label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Transmission</label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Seating Capacity</label>
            <input
              type="number"
              value={formData.seatingCapacity}
              onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        {/* Status & Image URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Availability Status</label>
            <select
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/25 cursor-pointer"
          >
            {initialData ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>

      </form>
    </Modal>
  );
}
