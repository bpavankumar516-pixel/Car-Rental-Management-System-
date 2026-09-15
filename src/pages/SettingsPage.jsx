import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Moon,
  Sun,
  Globe,
  DollarSign,
  Building,
  Mail,
  Phone,
  Percent,
  ShieldAlert,
  Database,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  Bell,
  Layout,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage({ setActiveTab }) {
  const { darkMode, toggleDarkMode } = useAuth();
  const { addToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('general');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Settings state persisted in localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('carvo_app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      currency: 'USD',
      currencySymbol: '$',
      language: 'English',
      defaultLandingPage: 'dashboard',
      companyName: 'CARVO Luxury Rentals',
      supportEmail: 'support@carvorentals.com',
      supportPhone: '+1 (800) 555-CARVO',
      taxRate: 10,
      defaultDeposit: 500,
      compactView: false,
      enableNotifications: true,
      autoSaveLocalData: true
    };
  });

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('carvo_app_settings', JSON.stringify(settings));
    addToast('Settings updated & saved successfully!', 'success');
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        settings,
        activeTab: localStorage.getItem('carvo_active_tab'),
        exportTimestamp: new Date().toISOString()
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `carvo_system_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('System data backup exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export system data', 'error');
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('carvo_app_settings');
    localStorage.removeItem('carvo_active_tab');
    setResetDialogOpen(false);
    addToast('Local preferences reset to defaults!', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shadow-xs shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">System Settings & Preferences</h1>
            <p className="text-xs text-slate-500 mt-0.5">Customize application defaults, business configuration, and system preferences</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex items-center gap-1 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'general'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" /> General Config
        </button>

        <button
          onClick={() => setActiveSubTab('company')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'company'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" /> Business Info
        </button>

        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'appearance'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Interface & Theme
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" /> Backup & Reset
        </button>
      </div>

      {/* SUB-TAB 1: General Config */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Regional & System Preferences</h2>
            <p className="text-xs text-slate-500">Configure default currency, default landing tab, and language parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Primary Currency</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={settings.currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    const symbols = { USD: '$', EUR: '€', INR: '₹', GBP: '£' };
                    setSettings({ ...settings, currency: val, currencySymbol: symbols[val] || '$' });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">System Language</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="English">English (United States)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>
            </div>

            {/* Default Landing Tab */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Default Starting Page</label>
              <div className="relative">
                <Layout className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={settings.defaultLandingPage}
                  onChange={(e) => setSettings({ ...settings, defaultLandingPage: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="dashboard">Dashboard Overview</option>
                  <option value="cars">Vehicle Inventory</option>
                  <option value="bookings">Reservations & Payments</option>
                  <option value="customers">Customer Directory</option>
                </select>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Toast Notifications</label>
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">Enable Toast Alerts</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    settings.enableNotifications ? 'bg-red-500' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.enableNotifications ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: Company Info */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Rental Agency & Tax Settings</h2>
            <p className="text-xs text-slate-500">Update company branding details, support phone, tax percentages, and rental deposit requirements.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Agency / Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="CARVO Luxury Rentals"
                />
              </div>
            </div>

            {/* Support Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Support Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="support@carvo.com"
                />
              </div>
            </div>

            {/* Support Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Customer Support Hotline</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="+1 (800) 555-CARVO"
                />
              </div>
            </div>

            {/* Standard Tax Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Sales Tax Rate (%)</label>
              <div className="relative">
                <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Default Security Deposit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Security Deposit ({settings.currencySymbol})</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={settings.defaultDeposit}
                  onChange={(e) => setSettings({ ...settings, defaultDeposit: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="500"
                />
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Business Info
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: Interface & Theme */}
      {activeSubTab === 'appearance' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Appearance & Dashboard UI Controls</h2>
            <p className="text-xs text-slate-500">Manage dark mode theme toggles and visual presentation styles.</p>
          </div>

          <div className="space-y-4">
            
            {/* Dark Mode Card */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400">
                  {darkMode ? <Sun className="w-5 h-5 fill-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Application Color Theme</h3>
                  <p className="text-[11px] text-slate-500">Currently operating in {darkMode ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Switch to {darkMode ? 'Light' : 'Dark'} Mode
              </button>
            </div>

            {/* Compact Table View Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Compact Table Spacing</h3>
                  <p className="text-[11px] text-slate-500">Reduce padding in inventory and customer data tables</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, compactView: !settings.compactView })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.compactView ? 'bg-red-500' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.compactView ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 4: Backup & Reset */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6">
          
          {/* Data Backup Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Export Application Configuration & Data
                </h3>
                <p className="text-xs text-slate-500 mt-1">Download a JSON snapshot of your current system settings and session preferences.</p>
              </div>

              <button
                onClick={handleExportData}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Export Backup (.json)
              </button>
            </div>
          </div>

          {/* Reset Preferences Danger Zone */}
          <div className="bg-red-50/50 rounded-2xl border border-red-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Reset Preferences to Factory Defaults
                </h3>
                <p className="text-xs text-red-700 mt-1">Clears local storage preferences and restores initial system defaults.</p>
              </div>

              <button
                onClick={() => setResetDialogOpen(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" /> Reset Local Preferences
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Confirmation Dialog for Reset */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Local Preferences?"
        message="Are you sure you want to reset all local app preferences to default settings? Your active tab and custom settings will be cleared."
        confirmText="Yes, Reset System Settings"
      />

    </div>
  );
}
