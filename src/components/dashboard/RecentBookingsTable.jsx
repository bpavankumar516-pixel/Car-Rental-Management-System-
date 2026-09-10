import React from 'react';
import { Calendar, Filter, ArrowUpRight, MapPin, Car } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function RecentBookingsTable({ onViewAll }) {
  const { bookings } = useBookings();

  // Combine real context bookings with reference items to match screenshot exactly
  const demoList = [
    {
      id: "BK-101",
      customerName: "Sarah Johnson",
      carModel: "Tesla Model 3",
      location: "Downtown HQ",
      status: "Confirmed",
      time: "Today, 3:00 PM"
    },
    {
      id: "BK-102",
      customerName: "Michael Brown",
      carModel: "BMW X5",
      location: "Airport Terminal",
      status: "Confirmed",
      time: "Today, 5:30 PM"
    },
    {
      id: "BK-103",
      customerName: "Emily Davis",
      carModel: "Toyota Camry",
      location: "Midtown Branch",
      status: "Pending",
      time: "Tomorrow, 9:00 AM"
    }
  ];

  // Map context bookings if available
  const displayList = bookings.length > 0
    ? bookings.slice(0, 4).map((b) => ({
        id: b.id,
        customerName: b.customerName,
        carModel: b.carName,
        location: "Downtown HQ",
        status: b.status === "Active" ? "Confirmed" : b.status,
        time: b.pickupDate || "Today, 3:00 PM"
      }))
    : demoList;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
      
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Latest Reservations</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status of upcoming bookings</p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>
      </div>

      {/* Reservations List */}
      <div className="space-y-4 divide-y divide-slate-100">
        {displayList.map((item, idx) => (
          <div key={item.id || idx} className={`${idx > 0 ? 'pt-4' : ''} flex items-center justify-between`}>
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.customerName}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Confirmed' || item.status === 'Active'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3 text-red-500" />
                    <span>{item.carModel}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">{item.time}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400">Showing {displayList.length} of 24 reservations</span>
        <button
          onClick={onViewAll}
          className="font-bold text-slate-900 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Reservations</span>
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        </button>
      </div>

    </div>
  );
}
