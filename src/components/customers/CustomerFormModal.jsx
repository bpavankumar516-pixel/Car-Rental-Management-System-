import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCustomers } from '../../context/CustomerContext';
import { useToast } from '../../context/ToastContext';

export default function CustomerFormModal({ isOpen, onClose, initialData = null }) {
  const { addCustomer, updateCustomer } = useCustomers();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    licenseNumber: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        licenseNumber: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email address is required';

    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.licenseNumber.trim()) errs.licenseNumber = 'Driving License Number is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateCustomer(initialData.id, formData);
      addToast('Customer updated successfully!', 'success');
    } else {
      addCustomer(formData);
      addToast('New customer profile registered!', 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Customer Profile' : 'Register New Customer'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Customer Full Name</label>
          <input
            type="text"
            placeholder="e.g. Suresh Kumar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
          />
          {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              placeholder="suresh@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            />
            {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Mobile Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
            />
            {errors.mobile && <p className="text-[11px] text-red-400">{errors.mobile}</p>}
          </div>
        </div>

        {/* License Number */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Driving License Number</label>
          <input
            type="text"
            placeholder="TS09-2021-0048291"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 uppercase tracking-wider font-mono text-xs"
          />
          {errors.licenseNumber && <p className="text-[11px] text-red-400">{errors.licenseNumber}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Full Address</label>
          <textarea
            rows="2"
            placeholder="Street name, City, State, Pincode"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500"
          />
          {errors.address && <p className="text-[11px] text-red-400">{errors.address}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20"
          >
            {initialData ? 'Save Changes' : 'Register Customer'}
          </button>
        </div>

      </form>
    </Modal>
  );
}
