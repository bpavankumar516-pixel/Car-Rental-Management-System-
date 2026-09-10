import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = register(name, email, password);
    if (res.success) {
      addToast('Account created successfully! Logged in.', 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500">Join CARVO Fleet Management Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Suresh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-white border ${
                errors.name ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="suresh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border ${
                errors.email ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white border ${
                errors.password ? 'border-red-500' : 'border-slate-200'
              } rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-xs`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm"
        >
          Create Account <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-red-600 font-bold hover:underline cursor-pointer"
          >
            Sign In Instead
          </button>
        </p>
      </div>
    </div>
  );
}
