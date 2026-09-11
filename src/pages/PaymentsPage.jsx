import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Search,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Printer,
  Receipt,
  ShieldCheck,
  PlusCircle,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

export default function PaymentsPage() {
  const { bookings } = useBookings();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [collectPaymentModalOpen, setCollectPaymentModalOpen] = useState(false);

  // Form for manual payment collection
  const [paymentForm, setPaymentForm] = useState({
    bookingId: '',
    customerName: '',
    amount: '',
    method: 'Credit Card',
    notes: 'Standard Rental Payment'
  });

  // Dynamically derive initial transactions list from existing Bookings data
  const initialTransactions = bookings.map((b, index) => {
    let paymentStatus = 'Paid';
    if (b.status === 'Cancelled') paymentStatus = 'Refunded';
    else if (b.status === 'Pending') paymentStatus = 'Pending';

    const methods = ['Credit Card (Stripe)', 'Bank Transfer', 'Debit Card', 'UPI / NetBanking'];
    const selectedMethod = methods[index % methods.length];

    return {
      txnId: `TXN-${8000 + index * 147}`,
      bookingId: b.id,
      customerName: b.customerName,
      customerEmail: b.customerEmail || 'customer@example.com',
      customerMobile: b.customerMobile,
      carName: b.carName,
      amount: b.totalCost || 450,
      paymentMethod: selectedMethod,
      date: b.createdAt || '2026-09-08',
      status: paymentStatus,
      taxAmount: Math.round((b.totalCost || 450) * 0.085),
      deposit: 350
    };
  });

  const [transactions, setTransactions] = useState(initialTransactions);

  // Metrics calculation
  const totalCollected = transactions
    .filter((t) => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === 'Refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  const paidCount = transactions.filter((t) => t.status === 'Paid').length;

  // Filter transactions
  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      !search ||
      t.txnId.toLowerCase().includes(search.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.carName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesMethod =
      methodFilter === 'All' || t.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleExportCSV = () => {
    const csvRows = [
      ['Transaction ID', 'Booking ID', 'Customer Name', 'Vehicle', 'Amount ($)', 'Payment Method', 'Date', 'Status'],
      ...filteredTxns.map((t) => [
        t.txnId,
        t.bookingId,
        t.customerName,
        t.carName,
        t.amount,
        t.paymentMethod,
        t.date,
        t.status
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payment_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Payment transaction records exported to CSV!', 'success');
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!paymentForm.customerName || !paymentForm.amount) {
      addToast('Customer Name and Amount are required', 'error');
      return;
    }

    const newTxn = {
      txnId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      bookingId: paymentForm.bookingId || `BK-MANUAL`,
      customerName: paymentForm.customerName,
      customerEmail: 'manual.payment@customer.com',
      customerMobile: '+91 99000 00000',
      carName: 'Custom Rental Service',
      amount: Number(paymentForm.amount),
      paymentMethod: paymentForm.method,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      taxAmount: Math.round(Number(paymentForm.amount) * 0.085),
      deposit: 350
    };

    setTransactions([newTxn, ...transactions]);
    addToast(`Payment of $${paymentForm.amount} recorded successfully!`, 'success');
    setCollectPaymentModalOpen(false);
    setPaymentForm({ bookingId: '', customerName: '', amount: '', method: 'Credit Card', notes: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-red-500" />
            Payments & Financial Transactions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time payment logs, digital receipts, and billing records</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollectPaymentModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Collect Payment
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Statement (CSV)
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Collected */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Payments Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">${totalCollected.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> {paidCount} Successful Transactions
          </div>
        </div>

        {/* Pending Deposits */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Balances</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">${pendingAmount.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-amber-600 font-semibold">
            Awaiting customer settlement
          </div>
        </div>

        {/* Total Refunded */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Refunded</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">${totalRefunded.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-slate-500">
            Processed for cancelled bookings
          </div>
        </div>

        {/* Stripe Gateway Security */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payment Protection</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-900">256-Bit Encrypted</div>
          <div className="text-[11px] font-bold text-purple-600">
            PCI-DSS Compliant Gateway
          </div>
        </div>

      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Txn ID, Customer, Vehicle, or Booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid / Successful</option>
              <option value="Pending">Pending Settlement</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="All">All Payment Methods</option>
              <option value="Credit Card">Credit Card / Stripe</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI / NetBanking</option>
            </select>
          </div>

        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {filteredTxns.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">No payment transaction records found</p>
            <p className="text-xs text-slate-400">Try clearing search query or resetting filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Reservation ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle Rented</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTxns.map((t) => (
                  <tr key={t.txnId} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Txn ID */}
                    <td className="p-4 font-mono font-bold text-red-600">{t.txnId}</td>

                    {/* Booking ID */}
                    <td className="p-4 font-mono font-semibold text-slate-800">{t.bookingId}</td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{t.customerName}</div>
                      <div className="text-[11px] text-slate-400">{t.customerMobile}</div>
                    </td>

                    {/* Vehicle */}
                    <td className="p-4 font-semibold text-slate-800">{t.carName}</td>

                    {/* Method */}
                    <td className="p-4 font-medium text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                        {t.paymentMethod}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500">{t.date}</td>

                    {/* Amount */}
                    <td className="p-4 font-black text-emerald-600 text-sm">${t.amount}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : t.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(t)}
                        title="View Digital Receipt"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-red-500" /> Receipt
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DIGITAL RECEIPT MODAL */}
      {selectedReceipt && (
        <Modal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          title={`Official Payment Receipt - ${selectedReceipt.txnId}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CARVO Rental Solutions</p>
                <p className="text-base font-black text-white mt-0.5">Payment Confirmation</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-white">
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            {/* Receipt Table Breakdown */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reservation Reference:</span>
                  <span className="font-mono font-bold text-red-600">{selectedReceipt.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Date:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway / Method:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payer Name:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rented Vehicle:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.carName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-bold text-slate-900">${selectedReceipt.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Taxes (8.5%):</span>
                  <span className="font-bold text-slate-900">${selectedReceipt.taxAmount}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-600">${selectedReceipt.amount}</span>
                </div>
              </div>
            </div>

            {/* Receipt Modal Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" /> Print Receipt
              </button>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* COLLECT MANUAL PAYMENT MODAL */}
      {collectPaymentModalOpen && (
        <Modal
          isOpen={collectPaymentModalOpen}
          onClose={() => setCollectPaymentModalOpen(false)}
          title="Collect & Record Payment"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Varma"
                value={paymentForm.customerName}
                onChange={(e) => setPaymentForm({ ...paymentForm, customerName: e.target.value })}
                className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reservation ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. BK-7001"
                value={paymentForm.bookingId}
                onChange={(e) => setPaymentForm({ ...paymentForm, bookingId: e.target.value })}
                className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Amount ($)</label>
                <input
                  type="number"
                  placeholder="350"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="Credit Card (Stripe)">Credit Card</option>
                  <option value="Cash Payment">Cash Payment</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI / NetBanking">UPI / NetBanking</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCollectPaymentModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-500/25 cursor-pointer"
              >
                Save Payment Record
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
