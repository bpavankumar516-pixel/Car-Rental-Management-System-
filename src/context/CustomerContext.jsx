import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsersFromAPI, addUserToAPI, updateUserInAPI, deleteUserFromAPI } from '../services/api';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('rental_customers_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const realApiCustomers = parsed.filter((c) => !['cust-1', 'cust-2', 'cust-3'].includes(c.id));
        return realApiCustomers;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomersFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET Request (Network Tab: GET https://dummyjson.com/users?limit=30)
      const apiCustomers = await fetchUsersFromAPI(30);

      setCustomers((prev) => {
        // Keep custom user-added customers created in UI
        const customAdded = prev.filter((c) => c.id.startsWith('cust-') && !c.rawId);
        return [...customAdded, ...apiCustomers];
      });
      localStorage.setItem('rental_customers_data', JSON.stringify(apiCustomers));
    } catch (err) {
      console.error('Error fetching DummyJSON users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ALWAYS call loadCustomersFromAPI on mount so GET request appears in DevTools Network tab
    loadCustomersFromAPI();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('rental_customers_data', JSON.stringify(customers));
    }
  }, [customers]);

  const addCustomer = async (customerData) => {
    const newCustomer = {
      id: `cust-${Date.now()}`,
      ...customerData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    // POST Request (Network Tab: POST https://dummyjson.com/users/add)
    await addUserToAPI(customerData);

    return newCustomer;
  };

  const updateCustomer = async (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    // PUT Request (Network Tab: PUT https://dummyjson.com/users/:id)
    await updateUserInAPI(id, updatedFields);
  };

  const deleteCustomer = async (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));

    // DELETE Request (Network Tab: DELETE https://dummyjson.com/users/:id)
    await deleteUserFromAPI(id);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        reloadCustomers: loadCustomersFromAPI
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);
