import React, { useState } from 'react';
import { Mail, Lock, KeyRound } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    const res = resetPassword(email, newPassword);
    if (res.success) {
      addToast(res.message, 'success');
      setEmail('');
      setNewPassword('');
      setError('');
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Password" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
          <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Enter your account email and choose a new password to reset instantly.</span>
        </div>

        {error && <p className="text-xs text-rose-400 font-medium bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/60">{error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Account Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="admin@drivepulse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>
    </Modal>
  );
}
