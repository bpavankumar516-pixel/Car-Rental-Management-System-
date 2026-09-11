import React, { useState } from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';
import RecentActivityTimeline from '../components/dashboard/RecentActivityTimeline';
import { Clock, Filter, Download, Car, Calendar, DollarSign, ArrowRight, RefreshCw } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useBookings } from '../context/BookingContext';
import { useCustomers } from '../context/CustomerContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

export default function DashboardPage({ setActiveTab, onOpenAddCar, onOpenNewBooking, onOpenAddCustomer }) {
  const { cars } = useCars();
  const { bookings } = useBookings();
  const { customers } = useCustomers();
  const { addToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [lastUpdatedText, setLastUpdatedText] = useState('Just now');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('This Month');

  const tabs = ['Overview', 'Fleet', 'Bookings', 'Finance'];

  const handleRefresh = () => {
    setLastUpdatedText('Just now');
    addToast('Dashboard data refreshed with latest real-time context!', 'info');
  };

  const handleExportDashboard = () => {
    const totalFleet = cars.length || 6;
    const activeRentals = bookings.filter((b) => b.status === 'Active').length;
    const totalCustomers = customers.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 33727);

    const csvRows = [
      ['CARVO Fleet Operations Dashboard Summary'],
      ['Report Generated Date', new Date().toLocaleDateString()],
      ['Filter Time Period', timePeriod],
      [],
      ['Metric', 'Value'],
      ['Total Vehicles in Fleet', totalFleet],
      ['Active Reservations', activeRentals],
      ['Total Registered Customers', totalCustomers],
      ['Total Monthly Revenue ($)', totalRevenue],
      [],
      ['Recent Bookings Summary'],
      ['Booking ID', 'Customer Name', 'Vehicle Rented', 'Status', 'Total Cost ($)'],
      ...bookings.slice(0, 5).map((b) => [b.id, b.customerName, b.carName, b.status, b.totalCost])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CARVO_Dashboard_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Dashboard Summary exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Welcome back! Here's what's happening with your fleet today.</p>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Dashboard Data"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {lastUpdatedText}</span>
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters ({timePeriod})</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportDashboard}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md shadow-red-500/25 text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: Overview */}
      {activeSubTab === 'Overview' && (
        <>
          {/* 4 KPI Stat Cards */}
          <StatsOverview setActiveTab={setActiveTab} />

          {/* 2-Column Main Data Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (65%): Latest Reservations Table */}
            <div className="lg:col-span-7 xl:col-span-8">
              <RecentBookingsTable onViewAll={() => setActiveTab('bookings')} />
            </div>

            {/* Right Column (35%): Recent Activity Timeline */}
            <div className="lg:col-span-5 xl:col-span-4">
              <RecentActivityTimeline />
            </div>

          </div>
        </>
      )}

      {/* SUB-TAB 2: Fleet Overview */}
      {activeSubTab === 'Fleet' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-red-500" /> Vehicle Fleet Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Quick summary of vehicles in inventory</p>
            </div>

            <button
              onClick={() => setActiveTab('cars')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Full Fleet</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cars.slice(0, 6).map((car) => (
              <div key={car.id} className="p-4 rounded-xl border border-slate-200 flex items-center gap-3 bg-slate-50/50">
                <img src={car.image} alt={car.model} className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{car.brand} {car.model}</p>
                  <p className="text-[11px] text-slate-500">${car.pricePerDay}/day • {car.availabilityStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Bookings Overview */}
      {activeSubTab === 'Bookings' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" /> Active Reservations Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Upcoming pickups and active rental agreements</p>
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Booking Directory</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <RecentBookingsTable onViewAll={() => setActiveTab('bookings')} />
        </div>
      )}

      {/* SUB-TAB 4: Finance Overview */}
      {activeSubTab === 'Finance' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Financial Operations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Revenue summaries and payment collection logs</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Payments Log
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Reports</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Gross Rental Revenue</p>
              <p className="text-3xl font-black text-slate-900 mt-1">$33,727 USD</p>
              <p className="text-xs text-slate-500 mt-1">Includes daily rental fees, insurance extras, and security deposits.</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/25 cursor-pointer"
            >
              View Detailed Analytics
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD FILTER MODAL */}
      {filterModalOpen && (
        <Modal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          title="Filter Dashboard Time Period"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">Select time period window to filter KPI statistics and charts:</p>
            
            <div className="space-y-2">
              {['Today', 'This Week', 'This Month', 'This Quarter', 'Year 2026'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setTimePeriod(period);
                    addToast(`Dashboard filtered by ${period}`, 'info');
                    setFilterModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    timePeriod === period
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{period}</span>
                  {timePeriod === period && <span className="w-2 h-2 rounded-full bg-red-500" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
