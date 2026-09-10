import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  User,
  ShieldAlert,
  Headphones,
  LifeBuoy,
  X,
  FileText
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const initialTickets = [
  {
    id: 'TKT-1089',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    subject: 'Request for rental extension on BMW X5',
    category: 'Rental Extension',
    priority: 'High',
    status: 'Open',
    date: '2026-09-10 14:20',
    message: 'Hello, I would like to extend my BMW X5 rental by 2 days. Please let me know if it is available and what the additional rate will be.'
  },
  {
    id: 'TKT-1088',
    customerName: 'Pavan Kumar',
    email: 'pavan@rentacarpro.com',
    subject: 'Airport terminal pickup location query',
    category: 'Booking Enquiry',
    priority: 'Medium',
    status: 'In Progress',
    date: '2026-09-09 11:45',
    message: 'Can I pick up my booked Tesla Model 3 directly at Terminal 2 Arrival Bay 4?'
  },
  {
    id: 'TKT-1087',
    customerName: 'Michael Chang',
    email: 'michael.c@techcorp.com',
    subject: 'Invoice copy required for corporate expense',
    category: 'Billing & Payment',
    priority: 'Low',
    status: 'Resolved',
    date: '2026-09-08 09:30',
    message: 'Please re-send the PDF invoice receipt for booking #BK-7890 to my billing email.'
  },
  {
    id: 'TKT-1086',
    customerName: 'Amanda Ross',
    email: 'amanda.r@gmail.com',
    subject: 'Tire pressure alert on Audi A6',
    category: 'Vehicle Maintenance',
    priority: 'High',
    status: 'Open',
    date: '2026-09-07 16:10',
    message: 'The dashboard showed a low tire pressure warning near Highway 101. Is there an authorized service center nearby?'
  }
];

export default function ContactPage() {
  const { addToast } = useToast();
  const [tickets, setTickets] = useState(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // New Support Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Booking Enquiry',
    priority: 'Medium',
    message: ''
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) {
      addToast('Name, Email, and Message are required', 'error');
      return;
    }

    const newTkt = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: inquiryForm.name.trim(),
      email: inquiryForm.email.trim(),
      subject: inquiryForm.subject.trim() || 'General Customer Inquiry',
      category: inquiryForm.category,
      priority: inquiryForm.priority,
      status: 'Open',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      message: inquiryForm.message.trim()
    };

    setTickets([newTkt, ...tickets]);
    addToast(`Support ticket ${newTkt.id} created successfully!`, 'success');
    setInquiryForm({
      name: '',
      email: '',
      subject: '',
      category: 'Booking Enquiry',
      priority: 'Medium',
      message: ''
    });
  };

  const handleResolveTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    addToast(`Ticket ${id} marked as Resolved!`, 'success');
    setSelectedTicket(null);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addToast(`Response sent to ${selectedTicket.email}`, 'success');
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'In Progress' } : t))
    );
    setReplyText('');
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Headphones className="w-6 h-6 text-red-500" />
            Contact & Customer Support Center
          </h1>
          <p className="text-xs text-slate-500">Manage customer inquiries, support tickets, and contact channels.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            24/7 Support Desk Online
          </span>
        </div>
      </div>

      {/* Top 4 Contact Info Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hotline Support</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">+1 (800) 555-CARVO</p>
            <p className="text-[10px] text-slate-400">Toll-free emergency</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Desk</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">support@carvo-rentals.com</p>
            <p className="text-[10px] text-slate-400">Avg reply 15 mins</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Headquarters</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">San Francisco, CA</p>
            <p className="text-[10px] text-slate-400">500 Tech Parkway</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Tickets</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">
              {tickets.filter((t) => t.status !== 'Resolved').length} Unresolved
            </p>
            <p className="text-[10px] text-slate-400">Priority assistance</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Table + Right Direct Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Support Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {tkt.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        tkt.status === 'Open'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : tkt.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {tkt.status}
                      </span>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tkt.priority === 'High' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-100'
                      }`}>
                        {tkt.priority} Priority
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">{tkt.date}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tkt.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tkt.message}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {tkt.customerName} ({tkt.email})
                    </span>
                    <span className="text-slate-400 font-medium">{tkt.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Inquiry Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleCreateTicket}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs sticky top-24"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                Submit Customer Ticket
              </h3>
              <p className="text-xs text-slate-500">Log a new inquiry or customer support case.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Email</label>
              <input
                type="email"
                required
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={inquiryForm.category}
                onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="Booking Enquiry">Booking Enquiry</option>
                <option value="Rental Extension">Rental Extension</option>
                <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                <option value="Billing & Payment">Billing & Payment</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={inquiryForm.subject}
                onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="Brief summary of inquiry"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Details</label>
              <textarea
                rows={3}
                required
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                placeholder="Describe the issue or customer request..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit Ticket
            </button>
          </form>
        </div>

      </div>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md">
                  {selectedTicket.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{selectedTicket.category}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{selectedTicket.customerName}</span>
                <span className="text-slate-400">{selectedTicket.email}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">{selectedTicket.subject}</p>
                {selectedTicket.message}
              </div>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700">Send Response to Customer</label>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official reply here..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 cursor-pointer"
                >
                  Mark as Resolved
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Email Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
