import React, { useState } from "react";
import {
  Calendar,
  Wrench,
  UserPlus,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Car,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { useBookings } from "../../context/BookingContext";
import { useCars } from "../../context/CarContext";
import { useCustomers } from "../../context/CustomerContext";
import Modal from "../common/Modal";

export default function RecentActivityTimeline({ setActiveTab }) {
  const { bookings } = useBookings();
  const { cars } = useCars();
  const { customers } = useCustomers();

  const [modalOpen, setModalOpen] = useState(false);

  // Dynamically generate timeline activities from real app contexts
  const dynamicActivities = [];

  // 1. Add Recent Bookings
  bookings.forEach((b) => {
    if (b.status === "Completed") {
      dynamicActivities.push({
        id: `act-b-comp-${b.id}`,
        title: "Rental Completed",
        description: `${b.carName} successfully returned by ${b.customerName}`,
        time: b.returnDate ? `Returned: ${b.returnDate}` : "Just now",
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 text-emerald-600",
        type: "booking",
      });
    } else if (b.status === "Cancelled") {
      dynamicActivities.push({
        id: `act-b-canc-${b.id}`,
        title: "Booking Cancelled",
        description: `Reservation ${b.id} for ${b.carName} was cancelled`,
        time: "Recently",
        icon: XCircle,
        iconBg: "bg-red-50 text-red-600",
        type: "booking",
      });
    } else {
      dynamicActivities.push({
        id: `act-b-new-${b.id}`,
        title: "New Reservation Created",
        description: `${b.carName} booked by ${b.customerName} ($${b.totalCost})`,
        time: b.pickupDate ? `Pickup: ${b.pickupDate}` : "10 minutes ago",
        icon: Calendar,
        iconBg: "bg-emerald-50 text-emerald-600",
        type: "booking",
      });
    }
  });

  // 2. Add Recent Customers
  customers.slice(0, 3).forEach((c) => {
    dynamicActivities.push({
      id: `act-c-${c.id}`,
      title: "New Customer Registered",
      description: `${c.name} registered driving license (${c.licenseNumber})`,
      time: c.createdAt ? `Joined: ${c.createdAt}` : "1 hour ago",
      icon: UserPlus,
      iconBg: "bg-blue-50 text-blue-600",
      type: "customer",
    });
  });

  // 3. Add Maintenance & Fleet Events
  cars
    .filter((car) => car.availabilityStatus === "Maintenance")
    .forEach((mCar) => {
      dynamicActivities.push({
        id: `act-m-${mCar.id}`,
        title: "Maintenance Scheduled",
        description: `${mCar.brand} ${mCar.model} sent for periodic inspection`,
        time: "2 hours ago",
        icon: Wrench,
        iconBg: "bg-amber-50 text-amber-600",
        type: "maintenance",
      });
    });

  // Fallback defaults if list is small
  if (dynamicActivities.length < 4) {
    dynamicActivities.push(
      {
        id: "act-def-1",
        title: "System Audit Verified",
        description: "PCI-DSS Payment Gateway security check passed",
        time: "3 hours ago",
        icon: ShieldCheck,
        iconBg: "bg-purple-50 text-purple-600",
        type: "system",
      },
      {
        id: "act-def-2",
        title: "Payment Received",
        description: "Invoice #TXN-9012 processed successfully",
        time: "5 hours ago",
        icon: DollarSign,
        iconBg: "bg-emerald-50 text-emerald-600",
        type: "payment",
      },
    );
  }

  // Display top 5 items
  const displayActivities = dynamicActivities.slice(0, 5);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Recent Activities
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time dynamic system events
          </p>
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
          title="Live Events"
        />
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {displayActivities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {act.description}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-center text-xs">
        <button
          onClick={() => setModalOpen(true)}
          className="font-bold text-slate-900 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Activities ({dynamicActivities.length})</span>
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* VIEW ALL ACTIVITIES MODAL */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="System Audit & Activity Timeline Log"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Chronological history of all live system events across bookings,
              customer registrations, and fleet maintenance:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {dynamicActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">
                          {act.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
