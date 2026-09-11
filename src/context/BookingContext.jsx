import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCars } from './CarContext';

const BookingContext = createContext();

const initialBookings = [
  {
    id: "BK-7001",
    carId: "car-104",
    carName: "Porsche 911 Carrera S",
    customerId: "cust-1",
    customerName: "Emily Johnson",
    customerEmail: "emily.johnson@x.dummyjson.com",
    customerMobile: "+81 965-431-3024",
    pickupDate: "2026-09-08",
    returnDate: "2026-09-12",
    totalDays: 4,
    pricePerDay: 220,
    totalCost: 880,
    status: "Active",
    createdAt: "2026-09-08"
  }
];

export function BookingProvider({ children }) {
  const { updateCarAvailability } = useCars();
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('rental_bookings_data');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  useEffect(() => {
    localStorage.setItem('rental_bookings_data', JSON.stringify(bookings));
  }, [bookings]);

  const createBooking = (bookingData) => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData,
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update car status to "Booked"
    updateCarAvailability(bookingData.carId, "Booked");
    return newBooking;
  };

  const cancelBooking = (bookingId, carId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
    // Mark car as Available
    updateCarAvailability(carId, "Available");
  };

  const completeBooking = (bookingId, carId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Completed" } : b))
    );
    // Mark car as Available
    updateCarAvailability(carId, "Available");
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        cancelBooking,
        completeBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
