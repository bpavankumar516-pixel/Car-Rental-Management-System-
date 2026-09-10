import React, { useState } from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';
import RecentActivityTimeline from '../components/dashboard/RecentActivityTimeline';
import { Clock, Filter, Download } from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  const tabs = ['Overview', 'Fleet', 'Bookings', 'Finance'];

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Welcome back! Here's what's happening with your fleet today.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-500 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last updated: 10 minutes ago</span>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
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

      {/* Row 1: 4 KPI Stat Cards */}
      <StatsOverview />

      {/* Row 2: 2-Column Main Data Section */}
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

    </div>
  );
}
