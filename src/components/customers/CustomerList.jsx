import React, { useState } from 'react';
import { Search, UserPlus, Edit3, Trash2, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCustomers } from '../../context/CustomerContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../common/ConfirmDialog';

export default function CustomerList({ onOpenAddModal, onEditCustomer }) {
  const { customers, deleteCustomer } = useCustomers();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const itemsPerPage = 5;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedList = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteCustomer(deleteTargetId);
      addToast('Customer record removed', 'info');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or license..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-100/80 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Add Customer Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {paginatedList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No customers found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Driving License</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedList.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{cust.name}</div>
                      <div className="text-[11px] text-slate-400">ID: {cust.id}</div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-red-500" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cust.mobile}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-mono text-xs font-semibold">
                        {cust.licenseNumber}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cust.address}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditCustomer(cust)}
                          title="Edit Customer"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(cust.id)}
                          title="Delete Customer"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
          <span className="text-slate-500">
            Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredCustomers.length} Total Customers)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Customer Profile"
        message="Are you sure you want to remove this customer record?"
        confirmText="Delete Profile"
      />

    </div>
  );
}
