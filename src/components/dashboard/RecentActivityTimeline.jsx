import React from 'react';
import { Calendar, Wrench, UserPlus, AlertTriangle, DollarSign, ArrowUpRight } from 'lucide-react';

export default function RecentActivityTimeline() {
  const activities = [
    {
      id: 1,
      title: "New Reservation Created",
      description: "Toyota Camry booked by John Smith",
      time: "10 minutes ago",
      icon: Calendar,
      iconBg: "bg-emerald-50 text-emerald-600"
    },
    {
      id: 2,
      title: "Maintenance Completed",
      description: "BMW X5 oil change and tire rotation",
      time: "45 minutes ago",
      icon: Wrench,
      iconBg: "bg-emerald-50 text-emerald-600"
    },
    {
      id: 3,
      title: "New Customer Registered",
      description: "Emily Davis completed profile setup",
      time: "2 hours ago",
      icon: UserPlus,
      iconBg: "bg-blue-50 text-blue-600"
    },
    {
      id: 4,
      title: "Vehicle Return Alert",
      description: "Honda Civic return overdue by 2 hours",
      time: "3 hours ago",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600"
    },
    {
      id: 5,
      title: "Payment Received",
      description: "Invoice #1234 paid by Robert Wilson",
      time: "5 hours ago",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600"
    }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Recent Activities</h3>
        <p className="text-xs text-slate-500 mt-0.5">Latest system events</p>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.description}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium shrink-0">{act.time}</span>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-center text-xs">
        <button className="font-bold text-slate-900 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All Activities</span>
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        </button>
      </div>

    </div>
  );
}
