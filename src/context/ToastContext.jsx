import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 101,
    title: 'New Reservation Created',
    desc: 'Booking #BK-7001 for Porsche 911 Carrera S created',
    time: '5m ago',
    unread: true,
    targetTab: 'bookings',
    type: 'booking'
  },
  {
    id: 102,
    title: 'Payment Marked as Paid',
    desc: 'Rental #BK-7002 completed and transaction TXN-884192 marked as Paid ($267)',
    time: '25m ago',
    unread: true,
    targetTab: 'bookings',
    type: 'payment'
  },
  {
    id: 103,
    title: 'Vehicle Added to Inventory',
    desc: 'Chevrolet Corvette Z06 Convertible added to fleet',
    time: '1h ago',
    unread: true,
    targetTab: 'cars',
    type: 'car'
  },
  {
    id: 104,
    title: 'Customer Directory Updated',
    desc: 'New customer Emily Johnson added to system',
    time: '3h ago',
    unread: false,
    targetTab: 'customers',
    type: 'customer'
  }
];

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('carvo_live_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('carvo_live_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      title: notif.title || 'System Activity',
      desc: notif.desc || notif.message,
      time: 'Just now',
      unread: true,
      targetTab: notif.targetTab || 'dashboard',
      type: notif.type || 'info',
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addToast = (message, type = 'info', targetTabOverride = null) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-detect activity details for Bell Notification
    const lowerMsg = message.toLowerCase();
    let targetTab = targetTabOverride;
    let title = 'System Activity';
    let notifType = type;

    if (lowerMsg.includes('car') || lowerMsg.includes('vehicle') || lowerMsg.includes('fleet')) {
      targetTab = targetTab || 'cars';
      title = lowerMsg.includes('added')
        ? 'Vehicle Added'
        : lowerMsg.includes('deleted') || lowerMsg.includes('removed')
        ? 'Vehicle Deleted'
        : 'Vehicle Specifications Updated';
      notifType = 'car';
    } else if (lowerMsg.includes('booking') || lowerMsg.includes('rental') || lowerMsg.includes('reservation')) {
      targetTab = targetTab || 'bookings';
      title = lowerMsg.includes('cancelled')
        ? 'Reservation Cancelled'
        : lowerMsg.includes('completed')
        ? 'Rental Completed'
        : 'New Reservation';
      notifType = 'booking';
    } else if (lowerMsg.includes('customer') || lowerMsg.includes('client') || lowerMsg.includes('user')) {
      targetTab = targetTab || 'customers';
      title = lowerMsg.includes('added') || lowerMsg.includes('registered')
        ? 'New Customer Registered'
        : lowerMsg.includes('deleted') || lowerMsg.includes('removed')
        ? 'Customer Record Deleted'
        : 'Customer Profile Updated';
      notifType = 'customer';
    } else if (lowerMsg.includes('paid') || lowerMsg.includes('payment') || lowerMsg.includes('revenue')) {
      targetTab = targetTab || 'bookings';
      title = 'Payment Received';
      notifType = 'payment';
    } else if (lowerMsg.includes('profile')) {
      targetTab = targetTab || 'profile';
      title = 'Admin Profile Updated';
      notifType = 'profile';
    } else if (lowerMsg.includes('settings')) {
      targetTab = targetTab || 'settings';
      title = 'Settings Updated';
      notifType = 'settings';
    }

    addNotification({
      title,
      desc: message,
      targetTab: targetTab || 'dashboard',
      type: notifType
    });

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <ToastContext.Provider
      value={{
        addToast,
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        dismissNotification,
        markNotificationRead
      }}
    >
      {children}
      
      {/* Toast Render Floating Banner - Top Right Positioned */}
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
