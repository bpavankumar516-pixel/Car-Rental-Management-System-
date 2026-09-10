import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginForm({ onSwitchToRegister, onOpenForgot }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
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

    const res = login(email, password);
    if (res.success) {
      addToast('Welcome back, Pavan! Successfully logged in.', 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('pavan@rentacarpro.com');
    setPassword('admin123');
    setErrors({});
    addToast('Demo credentials filled for Pavan Kumar! Click Sign In.', 'info');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sign In</h2>
        <p className="text-xs text-slate-500">Enter your manager credentials to access the CARVO fleet portal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="pavan@rentacarpro.com"
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <button
              type="button"
              onClick={onOpenForgot}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
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

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-red-500 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
            Remember this session
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm"
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-red-600 font-bold hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </p>
      </div>

      {/* Clickable Demo Credentials Card */}
      <div className="pt-2">
        <div
          onClick={fillDemoAdmin}
          title="Click to auto fill Pavan's demo credentials"
          className="p-3 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-200/80 hover:border-red-200 flex items-center justify-between text-xs cursor-pointer transition-all duration-200 hover:shadow-xs group"
        >
          <div className="flex items-center gap-2.5 text-slate-600">
            <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-red-500 shrink-0 transition-colors" />
            <div className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900">
              Demo Account (Pavan Kumar): <strong className="text-slate-900 group-hover:text-red-600">pavan@rentacarpro.com</strong> / admin123
            </div>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 shrink-0 transition-colors" />
        </div>
      </div>

    </div>
  );
}
