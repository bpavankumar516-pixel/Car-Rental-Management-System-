import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Floating Banner - Top Right Positioned with CARVO Light Theme */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border border-slate-200/90 bg-white/95 backdrop-blur-md border-l-4 transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'border-l-emerald-500'
                : toast.type === 'error'
                ? 'border-l-red-500'
                : 'border-l-red-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-red-600 shrink-0" />}
              <p className="text-xs font-medium text-slate-700">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
