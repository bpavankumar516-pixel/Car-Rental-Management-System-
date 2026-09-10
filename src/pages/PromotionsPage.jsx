import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle2,
  Clock,
  Copy,
  Trash2,
  Edit,
  Sparkles,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const initialPromotions = [
  {
    id: 'promo-1',
    code: 'SUMMER2026',
    title: 'Summer Getaway Discount',
    description: 'Get 20% off on all SUV and Premium Luxury rentals during summer months.',
    discountType: 'Percentage',
    discountValue: 20,
    minRentalDays: 3,
    validFrom: '2026-06-01',
    validTo: '2026-08-31',
    usageLimit: 200,
    usedCount: 142,
    status: 'Active',
    applicableCategory: 'SUV & Luxury'
  },
  {
    id: 'promo-2',
    code: 'WEEKEND50',
    title: 'Weekend Special Flat Discount',
    description: 'Flat $50 off on weekend bookings (Friday to Sunday).',
    discountType: 'Fixed',
    discountValue: 50,
    minRentalDays: 2,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    usageLimit: 500,
    usedCount: 389,
    status: 'Active',
    applicableCategory: 'All Vehicles'
  },
  {
    id: 'promo-3',
    code: 'PAVANVIP',
    title: 'VIP Partner Special Rate',
    description: 'Exclusive 25% discount for corporate partners and VIP registered customers.',
    discountType: 'Percentage',
    discountValue: 25,
    minRentalDays: 1,
    validFrom: '2026-02-15',
    validTo: '2026-11-30',
    usageLimit: 100,
    usedCount: 64,
    status: 'Active',
    applicableCategory: 'Sedan & Electric'
  },
  {
    id: 'promo-4',
    code: 'FALLDRIVE',
    title: 'Fall Roadtrip Promotion',
    description: 'Early bird promotion for autumn long weekend roadtrips.',
    discountType: 'Percentage',
    discountValue: 15,
    minRentalDays: 4,
    validFrom: '2026-09-15',
    validTo: '2026-10-31',
    usageLimit: 150,
    usedCount: 0,
    status: 'Scheduled',
    applicableCategory: 'SUVs & Minivans'
  },
  {
    id: 'promo-5',
    code: 'WELCOME10',
    title: 'First-Time Renter Offer',
    description: '10% off for first time customer bookings.',
    discountType: 'Percentage',
    discountValue: 10,
    minRentalDays: 1,
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    usageLimit: 1000,
    usedCount: 1000,
    status: 'Expired',
    applicableCategory: 'All Vehicles'
  }
];

export default function PromotionsPage() {
  const { addToast } = useToast();
  const [promotions, setPromotions] = useState(initialPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Promo Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'Percentage',
    discountValue: 15,
    minRentalDays: 2,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '2026-12-31',
    usageLimit: 100,
    applicableCategory: 'All Vehicles'
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    addToast(`Promo code '${code}' copied to clipboard!`, 'success');
  };

  const handleToggleStatus = (id) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'Active' ? 'Disabled' : 'Active';
          addToast(`Promotion ${p.code} is now ${newStatus}`, 'info');
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleDelete = (id, code) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    addToast(`Promotion ${code} deleted`, 'info');
  };

  const handleCreatePromotion = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      addToast('Code and Title are required', 'error');
      return;
    }

    const newPromo = {
      id: `promo-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim(),
      description: formData.description.trim() || 'Custom promotion offer.',
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minRentalDays: Number(formData.minRentalDays),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      usageLimit: Number(formData.usageLimit),
      usedCount: 0,
      status: 'Active',
      applicableCategory: formData.applicableCategory
    };

    setPromotions([newPromo, ...promotions]);
    addToast(`Promotion ${newPromo.code} created successfully!`, 'success');
    setIsModalOpen(false);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 15,
      minRentalDays: 2,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '2026-12-31',
      usageLimit: 100,
      applicableCategory: 'All Vehicles'
    });
  };

  const filteredPromotions = promotions.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = promotions.filter((p) => p.status === 'Active').length;
  const totalClaimed = promotions.reduce((acc, p) => acc + p.usedCount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-red-500" />
            Promotions & Discounts
          </h1>
          <p className="text-xs text-slate-500">Create and manage marketing coupon codes, campaign offers, and customer discounts.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Promotion
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Promos</p>
            <p className="text-2xl font-black text-slate-900">{activeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Discounts Claimed</p>
            <p className="text-2xl font-black text-slate-900">{totalClaimed.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Savings</p>
            <p className="text-2xl font-black text-slate-900">18.5%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Promo Revenue</p>
            <p className="text-2xl font-black text-slate-900">$48,250</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search promo code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Active', 'Scheduled', 'Expired', 'Disabled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPromotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  promo.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : promo.status === 'Scheduled'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : promo.status === 'Expired'
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {promo.status}
                </span>

                <span className="text-[11px] font-bold text-slate-400">
                  {promo.applicableCategory}
                </span>
              </div>

              {/* Code Pill */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-sm font-black tracking-wider text-slate-900">{promo.code}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">{promo.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{promo.description}</p>
              </div>

              {/* Discount Amount Banner */}
              <div className="flex items-center justify-between text-xs font-bold bg-red-50/60 p-2.5 rounded-xl border border-red-100 text-red-700">
                <span>Discount Rate</span>
                <span className="text-sm font-black">
                  {promo.discountType === 'Percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                </span>
              </div>

              {/* Validity & Usage */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Validity</span>
                  <span className="font-semibold text-slate-700">{promo.validFrom} to {promo.validTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usage Progress</span>
                  <span className="font-semibold text-slate-700">{promo.usedCount} / {promo.usageLimit}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${Math.min(100, (promo.usedCount / promo.usageLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(promo.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  promo.status === 'Active'
                    ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {promo.status === 'Active' ? 'Disable' : 'Enable'}
              </button>

              <button
                onClick={() => handleDelete(promo.id, promo.code)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Promotion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-500" />
                Create New Promotion
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promo Code (e.g. SUMMER25)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  placeholder="PROMO2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  placeholder="Summer Weekend Discount"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  placeholder="Terms & details of the offer..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-md cursor-pointer"
                >
                  Publish Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
