import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rental_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('rental_registered_users');
    return saved ? JSON.parse(saved) : [
      {
        id: 'u-1',
        name: 'Admin Manager',
        email: 'admin@drivepulse.com',
        password: 'admin123',
        role: 'Admin'
      }
    ];
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

  const login = (email, password) => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      setUser({ id: found.id, name: found.name, email: found.email, role: found.role });
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password. Try admin@drivepulse.com / admin123' };
    }
  };

  const register = (name, email, password) => {
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists' };
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role: 'User'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const resetPassword = (email, newPassword) => {
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      return { success: false, message: 'Email address not found' };
    }

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u))
    );
    return { success: true, message: 'Password reset successfully! You can now log in.' };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
