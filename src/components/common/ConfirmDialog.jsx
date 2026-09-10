import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message, confirmText = "Delete", isDanger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div className="p-3 rounded-full bg-red-50 text-red-600 border border-red-100 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">{message}</p>
          <p className="text-xs text-slate-400">This action cannot be undone.</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
            isDanger
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
              : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
