import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Shield,
  Key,
  Camera,
  Save,
  CheckCircle2,
  Clock,
  Laptop,
  Smartphone,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('personal');

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    location: user?.location || '',
    role: user?.role || 'System Administrator',
    bio: user?.bio || ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'PK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Name and Email are required', 'error');
      return;
    }

    const res = updateProfile(formData);
    if (res.success) {
      addToast('Profile details updated successfully!', 'success');
    } else {
      addToast(res.message || 'Failed to update profile', 'error');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      addToast('Please fill out all password fields', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    const res = updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      addToast('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      addToast(res.message, 'error');
    }
  };

  const mockSessions = [
    {
      id: 1,
      device: 'Windows PC • Chrome 122.0',
      location: 'San Francisco, USA',
      ip: '192.168.1.45',
      time: 'Active Now',
      isCurrent: true,
      icon: Laptop
    },
    {
      id: 2,
      device: 'iPhone 15 Pro • Safari',
      location: 'San Francisco, USA',
      ip: '198.51.100.22',
      time: '2 hours ago',
      isCurrent: false,
      icon: Smartphone
    }
  ];

  const mockActivityLog = [
    { id: 1, action: 'Updated profile information', date: 'Today, 2:45 PM', status: 'Completed' },
    { id: 2, action: 'Password changed successfully', date: 'Yesterday, 10:15 AM', status: 'Security Alert' },
    { id: 3, action: 'Exported quarterly rental report', date: '3 days ago', status: 'Completed' },
    { id: 4, action: 'Logged in from new IP address', date: '5 days ago', status: 'Logged' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Cover Accent Gradient */}
        <div className="h-36 bg-gradient-to-r from-red-600 via-rose-600 to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#opacity-10,white_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        </div>

        {/* Profile Details Header Bar */}
        <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-xl">
                {getInitials(formData.name)}
              </div>
              <button
                type="button"
                onClick={() => addToast('Avatar upload simulated', 'info')}
                className="absolute bottom-1 right-1 p-2 rounded-xl bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formData.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200/60">
                  <Shield className="w-3 h-3 mr-1" />
                  {formData.role}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {formData.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {formData.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since {user?.memberSince || 'Jan 2024'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'personal'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="border-t border-slate-100 px-6 flex items-center gap-6 text-xs font-bold text-slate-500 overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'personal' ? 'border-red-500 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'security' ? 'border-red-500 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'activity' ? 'border-red-500 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Account Activity
          </button>
        </div>
      </div>

      {/* TAB CONTENT: Personal Information */}
      {activeTab === 'personal' && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal & Contact Details</h2>
              <p className="text-xs text-slate-500">Update your account information and contact preferences.</p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="Your Full Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Company / Organization */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Company / Agency</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="CARVO Enterprise"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            {/* Role (Read-only badge style) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Assigned Role</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={formData.role}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Brief description about your role in the rental management system..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile Details
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: Security & Password */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password Change Card */}
          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-red-500" />
                  Change Password
                </h2>
                <p className="text-xs text-slate-500">Ensure your account is using a strong password.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Update Password
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-xs text-slate-500">Adds an additional layer of security to your admin account using SMS or Authenticator App.</p>
              </div>

              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  addToast(twoFactorEnabled ? '2FA disabled' : '2FA enabled successfully', 'info');
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-700" />
              Active Login Sessions
            </h3>
            <div className="divide-y divide-slate-100">
              {mockSessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{session.device}</p>
                          {session.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Current Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{session.location} • {session.ip}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{session.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Activity Log */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Recent Account Activity
            </h2>
            <p className="text-xs text-slate-500">Audit record of recent account operations and security events.</p>
          </div>

          <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 my-4 pl-6">
            {mockActivityLog.map((log) => (
              <div key={log.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-xs"></div>
                
                <div className="flex items-center justify-between bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{log.action}</p>
                    <p className="text-[11px] text-slate-400">{log.date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
