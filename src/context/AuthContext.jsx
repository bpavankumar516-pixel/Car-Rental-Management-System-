import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const defaultRegisteredUsers = [
  {
    id: 'u-1',
    name: 'Pavan Kumar',
    email: 'pavan@rentacarpro.com',
    password: 'admin123',
    role: 'System Administrator',
    phone: '+1 (555) 839-2001',
    company: 'CARVO Enterprise Rentals',
    location: 'San Francisco, CA',
    bio: 'Fleet Operation Director & System Admin managing rental fleet operations across North America.',
    memberSince: 'Jan 2024'
  },
  {
    id: 'u-2',
    name: 'Pavan Manager',
    email: 'admin@rentacarpro.com',
    password: 'admin123',
    role: 'Fleet Manager',
    phone: '+1 (555) 482-9102',
    company: 'CARVO Fleet Solutions',
    location: 'Chicago, IL',
    bio: 'Regional Manager supervising vehicle logistics and customer reservations.',
    memberSince: 'Mar 2024'
  },
  {
    id: 'u-3',
    name: 'Admin Manager',
    email: 'admin@drivepulse.com',
    password: 'admin123',
    role: 'Operations Admin',
    phone: '+1 (555) 712-4099',
    company: 'DrivePulse Rentals',
    location: 'Austin, TX',
    bio: 'Operations Coordinator managing bookings and financial invoices.',
    memberSince: 'May 2024'
  }
];

const defaultSettings = {
  companyName: 'CARVO Rental Solutions',
  supportEmail: 'support@carvo-rentals.com',
  phone: '+1 (800) 555-CARVO',
  address: '500 Tech Parkway, Suite 400, San Francisco, CA 94107',
  currency: 'USD ($)',
  timezone: 'America/Los_Angeles (PST)',
  dateFormat: 'MM/DD/YYYY',
  securityDeposit: 350,
  taxRate: 8.5,
  gracePeriodHours: 2,
  fuelPolicy: 'Full to Full',
  mileageLimitPerDay: 250,
  emailNotifications: {
    newBooking: true,
    bookingCancellation: true,
    maintenanceAlerts: true,
    overdueAlerts: true,
    weeklyReport: false
  },
  systemAccent: 'Red'
};

export function AuthProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('rental_registered_users');
    if (!saved) return defaultRegisteredUsers;
    try {
      const parsed = JSON.parse(saved);
      const hasPavan = parsed.some((u) => u.email.toLowerCase() === 'pavan@rentacarpro.com');
      return hasPavan ? parsed : [...defaultRegisteredUsers, ...parsed];
    } catch {
      return defaultRegisteredUsers;
    }
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rental_auth_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return registeredUsers[0]; }
    }
    return registeredUsers[0];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rental_system_settings');
    if (saved) {
      try { return { ...defaultSettings, ...JSON.parse(saved) }; } catch { return defaultSettings; }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('rental_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rental_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rental_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('rental_theme_mode');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('rental_theme_mode', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (found) {
      setUser(found);
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password. Try pavan@rentacarpro.com / admin123' };
    }
  };

  const register = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists' };
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email: cleanEmail,
      password,
      role: 'System Administrator',
      phone: '+1 (555) 000-0000',
      company: 'CARVO Enterprise',
      location: 'United States',
      bio: 'Administrator account.',
      memberSince: 'Just Now'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const resetPassword = (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (!exists) {
      return { success: false, message: 'Email address not found' };
    }

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === cleanEmail ? { ...u, password: newPassword } : u))
    );
    return { success: true, message: 'Password reset successfully! You can now log in.' };
  };

  const updateProfile = (updatedFields) => {
    if (!user) return { success: false, message: 'No active user session' };

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...updatedFields } : u))
    );

    return { success: true, message: 'Profile updated successfully!' };
  };

  const updatePassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: 'No active user session' };

    const found = registeredUsers.find((u) => u.id === user.id);
    if (found && found.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u))
    );

    return { success: true, message: 'Password updated successfully!' };
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    return { success: true, message: 'System settings saved successfully!' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        darkMode,
        toggleDarkMode,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        updatePassword,
        updateSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
