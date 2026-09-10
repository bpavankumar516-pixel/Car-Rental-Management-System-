import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import { Car, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center p-4 relative overflow-hidden">
      
      {/* Glow Orbs Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Brand Bar */}
      <div className="pt-8 flex items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-2xl font-black text-white tracking-tight">DrivePulse</span>
          <span className="block text-xs font-semibold text-cyan-400">CAR RENTAL MANAGEMENT SYSTEM</span>
        </div>
      </div>

      {/* Main Auth Form Container */}
      <div className="my-auto relative z-10 w-full flex justify-center py-6">
        {isRegistering ? (
          <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
        ) : (
          <LoginForm
            onSwitchToRegister={() => setIsRegistering(true)}
            onOpenForgot={() => setForgotModalOpen(true)}
          />
        )}
      </div>

      {/* Footer info */}
      <div className="pb-6 text-center text-xs text-slate-500 relative z-10 flex items-center gap-4">
        <span>© 2026 DrivePulse Inc. All rights reserved.</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Module 1-5 Completed
        </span>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />

    </div>
  );
}
