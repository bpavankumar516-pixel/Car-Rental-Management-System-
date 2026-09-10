import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  CreditCard,
  Palette,
  Globe,
  Save,
  CheckCircle2,
  DollarSign,
  Fuel,
  Clock,
  ShieldAlert,
  Server,
  Zap,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useAuth();
  const { addToast } = useToast();

  const [activeSection, setActiveSection] = useState('general');

  const [settingsForm, setSettingsForm] = useState({
    companyName: settings?.companyName || 'CARVO Rental Solutions',
    supportEmail: settings?.supportEmail || 'support@carvo-rentals.com',
    phone: settings?.phone || '+1 (800) 555-CARVO',
    address: settings?.address || '500 Tech Parkway, Suite 400, San Francisco, CA 94107',
    currency: settings?.currency || 'USD ($)',
    timezone: settings?.timezone || 'America/Los_Angeles (PST)',
    dateFormat: settings?.dateFormat || 'MM/DD/YYYY',
    securityDeposit: settings?.securityDeposit || 350,
    taxRate: settings?.taxRate || 8.5,
    gracePeriodHours: settings?.gracePeriodHours || 2,
    fuelPolicy: settings?.fuelPolicy || 'Full to Full',
    mileageLimitPerDay: settings?.mileageLimitPerDay || 250,
    emailNotifications: settings?.emailNotifications || {
      newBooking: true,
      bookingCancellation: true,
      maintenanceAlerts: true,
      overdueAlerts: true,
      weeklyReport: false
    },
    systemAccent: settings?.systemAccent || 'Red'
  });

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const res = updateSettings(settingsForm);
    if (res.success) {
      addToast('System settings saved successfully!', 'success');
    } else {
      addToast('Failed to save settings', 'error');
    }
  };

  const handleToggleNotification = (key) => {
    setSettingsForm((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key]
      }
    }));
  };

  const sections = [
    { id: 'general', label: 'General & Company', icon: Globe },
    { id: 'rental', label: 'Rental Policies', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Payment & API', icon: CreditCard },
    { id: 'appearance', label: 'Branding & Theme', icon: Palette }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-red-500" />
            System & Operations Settings
          </h1>
          <p className="text-xs text-slate-500">Manage rental configurations, pricing policies, and notifications.</p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sub Nav */}
        <div className="md:col-span-1 space-y-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs space-y-1 sticky top-24">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Form Panels */}
        <div className="md:col-span-3 space-y-6">
          
          {/* SECTION 1: General & Company */}
          {activeSection === 'general' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Company & Regional Preferences</h2>
                <p className="text-xs text-slate-500">Configure core agency branding, contact details, and currency units.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Rental Agency Name</label>
                  <input
                    type="text"
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Currency</label>
                  <select
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
                  <select
                    value={settingsForm.timezone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date Display Format</label>
                  <select
                    value={settingsForm.dateFormat}
                    onChange={(e) => setSettingsForm({ ...settingsForm, dateFormat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Headquarters Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: Rental Policies */}
          {activeSection === 'rental' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Rental & Deposit Policies</h2>
                <p className="text-xs text-slate-500">Standard rules for security deposits, tax rates, and fuel policies.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard Security Deposit ($)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={settingsForm.securityDeposit}
                      onChange={(e) => setSettingsForm({ ...settingsForm, securityDeposit: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Sales Tax / VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settingsForm.taxRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Grace Period for Returns (Hours)</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={settingsForm.gracePeriodHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, gracePeriodHours: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fuel Return Policy</label>
                  <div className="relative">
                    <Fuel className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={settingsForm.fuelPolicy}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fuelPolicy: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="Full to Full">Full to Full (Same as Pickup)</option>
                      <option value="Pre-paid Tank">Pre-paid Tank Included</option>
                      <option value="Pay on Return">Pay on Return per Gallon</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Email & System Alerts</h2>
                <p className="text-xs text-slate-500">Configure automated notifications sent to fleet administrators.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'newBooking', label: 'New Reservation Alerts', desc: 'Receive immediate email when a new car reservation is created.' },
                  { key: 'bookingCancellation', label: 'Cancellation Notifications', desc: 'Get notified when a customer cancels their rental booking.' },
                  { key: 'maintenanceAlerts', label: 'Vehicle Maintenance Reminders', desc: 'Automated warnings for scheduled oil changes and service.' },
                  { key: 'overdueAlerts', label: 'Overdue Rental Return Warnings', desc: 'Instant alerts when a car return passes the agreed schedule.' },
                  { key: 'weeklyReport', label: 'Weekly Operational Summary', desc: 'Receive weekly automated analytics digest via email.' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/50">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleNotification(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        settingsForm.emailNotifications[item.key] ? 'bg-red-500' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsForm.emailNotifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Integrations */}
          {activeSection === 'integrations' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Payment & API Integrations</h2>
                <p className="text-xs text-slate-500">Connected services for credit card payments and fleet GPS tracking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Stripe Payment Gateway</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">Connected</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Accept Visa, Mastercard, AMEX online & in-person deposits.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">GPS Fleet Telematics</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">Live Sync</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Real-time vehicle mileage, fuel level, and location tracking.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Branding & Theme */}
          {activeSection === 'appearance' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Branding & System Accent</h2>
                <p className="text-xs text-slate-500">Tailor the CARVO UI theme accent to your corporate branding.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Primary Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  {['Red', 'Slate', 'Emerald', 'Blue'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, systemAccent: color })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        settingsForm.systemAccent === color
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${
                        color === 'Red' ? 'bg-red-500' : color === 'Slate' ? 'bg-slate-900' : color === 'Emerald' ? 'bg-emerald-500' : 'bg-blue-600'
                      }`} />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
