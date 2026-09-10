import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';

    if (!newPassword) errs.newPassword = 'New password is required';
    else if (newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';

    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = resetPassword(email, newPassword);
    if (res.success) {
      addToast(res.message, 'success');
      onSwitchToLogin();
    } else {
      setErrors({ email: res.message });
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-500">Enter your account email and choose a new password to recover access.</p>
      </div>

      {/* Info Pill */}
      <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-xs">
        <KeyRound className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <span className="text-slate-600 leading-relaxed text-[11px]">
          Password updates apply immediately to your account session.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Account Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="admin@rentacarpro.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border ${
                errors.email ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* New Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full bg-white border ${
                errors.newPassword ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
          </div>
          {errors.newPassword && <p className="text-[11px] text-red-500 font-medium">{errors.newPassword}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-white border ${
                errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm"
        >
          Update Password <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Back to Sign In link */}
      <div className="text-center pt-2 border-t border-slate-100">
        <button
          onClick={onSwitchToLogin}
          className="text-xs font-bold text-slate-600 hover:text-red-600 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
      </div>

    </div>
  );
}
