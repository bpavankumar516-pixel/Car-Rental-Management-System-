import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

const initialCustomers = [
  {
    id: "cust-1",
    name: "Rajesh Varma",
    email: "rajesh.v@example.com",
    mobile: "+91 98765 43210",
    address: "Banjara Hills, Hyderabad, Telangana",
    licenseNumber: "TS09-2021-0048291",
    createdAt: "2026-08-15"
  },
  {
    id: "cust-2",
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    mobile: "+91 91234 56789",
    address: "HSR Layout, Bengaluru, Karnataka",
    licenseNumber: "KA05-2022-0091823",
    createdAt: "2026-08-20"
  },
  {
    id: "cust-3",
    name: "Vikram Sharma",
    email: "vikram.s@example.com",
    mobile: "+91 99887 76655",
    address: "Andheri West, Mumbai, Maharashtra",
    licenseNumber: "MH02-2020-0012984",
    createdAt: "2026-09-01"
  }
];

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('rental_customers_data');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem('rental_customers_data', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `cust-${Date.now()}`,
      ...customerData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);
