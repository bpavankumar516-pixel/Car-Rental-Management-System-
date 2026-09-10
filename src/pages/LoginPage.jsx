import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { Car, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [authView, setAuthView] = useState('login');

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Auth Form & CARVO Branding Section */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 sm:p-10 relative z-20 min-h-screen">
        
        {/* Top Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/25">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">CARVO</span>
        </div>

        {/* Center Auth Card Container */}
        <div className="my-auto py-8 w-full max-w-md mx-auto">
          {authView === 'login' && (
            <LoginForm
              onSwitchToRegister={() => setAuthView('register')}
              onOpenForgot={() => setAuthView('forgot')}
            />
          )}

          {authView === 'register' && (
            <RegisterForm
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}

          {authView === 'forgot' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>

        {/* Bottom Footer Info */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 CARVO Fleet Management</span>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure System</span>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Crystal Clear Supercar Showcase */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/20" />
      </div>

    </div>
  );
}
