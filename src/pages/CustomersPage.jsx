import React from 'react';
import CustomerList from '../components/customers/CustomerList';

export default function CustomersPage({ onOpenAddCustomer, onEditCustomer }) {
  return (
    <div className="space-y-6">
      <CustomerList
        onOpenAddModal={onOpenAddCustomer}
        onEditCustomer={onEditCustomer}
      />
    </div>
  );
}
