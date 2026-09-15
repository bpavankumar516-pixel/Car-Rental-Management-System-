import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCars } from './CarContext';

const BookingContext = createContext();

const initialBookings = [
  {
    id: "BK-7001",
    carId: "car-104",
    carName: "Porsche 911 Carrera S",
    carImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
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
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    transactionId: "TXN-902411",
    createdAt: "2026-09-08"
  },
  {
    id: "BK-7002",
    carId: "car-101",
    carName: "Tesla Model 3 Performance",
    carImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    customerId: "cust-2",
    customerName: "Michael Scott",
    customerEmail: "michael.scott@x.dummyjson.com",
    customerMobile: "+1 555-019-2834",
    pickupDate: "2026-09-04",
    returnDate: "2026-09-07",
    totalDays: 3,
    pricePerDay: 89,
    totalCost: 267,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Apple Pay",
    transactionId: "TXN-884192",
    paidAt: "2026-09-07",
    createdAt: "2026-09-04"
  },
  {
    id: "BK-7003",
    carId: "car-102",
    carName: "BMW M4 Competition",
    carImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    customerId: "cust-3",
    customerName: "Sarah Connor",
    customerEmail: "sarah.connor@x.dummyjson.com",
    customerMobile: "+1 555-432-1098",
    pickupDate: "2026-09-02",
    returnDate: "2026-09-05",
    totalDays: 3,
    pricePerDay: 140,
    totalCost: 420,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    transactionId: "TXN-773910",
    paidAt: "2026-09-05",
    createdAt: "2026-09-02"
  },
  {
    id: "BK-7004",
    carId: "car-103",
    carName: "Mercedes-Benz C-Class Coupe",
    carImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    customerId: "cust-4",
    customerName: "David Miller",
    customerEmail: "david.miller@x.dummyjson.com",
    customerMobile: "+1 555-876-5432",
    pickupDate: "2026-08-28",
    returnDate: "2026-08-31",
    totalDays: 3,
    pricePerDay: 95,
    totalCost: 285,
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "PayPal",
    transactionId: "TXN-661049",
    createdAt: "2026-08-28"
  },
  {
    id: "BK-7005",
    carId: "car-107",
    carName: "Audi RS6 Avant Performance",
    carImage: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    customerId: "cust-5",
    customerName: "James Wilson",
    customerEmail: "james.wilson@x.dummyjson.com",
    customerMobile: "+1 555-987-6543",
    pickupDate: "2026-08-25",
    returnDate: "2026-08-28",
    totalDays: 3,
    pricePerDay: 175,
    totalCost: 525,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Debit Card",
    transactionId: "TXN-552914",
    paidAt: "2026-08-28",
    createdAt: "2026-08-25"
  },
  {
    id: "BK-7006",
    carId: "car-108",
    carName: "Lamborghini Huracán EVO RWD",
    carImage: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    customerId: "cust-6",
    customerName: "Alex Mercer",
    customerEmail: "alex.mercer@x.dummyjson.com",
    customerMobile: "+1 555-321-7654",
    pickupDate: "2026-09-10",
    returnDate: "2026-09-13",
    totalDays: 3,
    pricePerDay: 350,
    totalCost: 1050,
    status: "Active",
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    transactionId: "TXN-441823",
    createdAt: "2026-09-10"
  }
];

export function BookingProvider({ children }) {
  const { updateCarAvailability } = useCars();
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('rental_bookings_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old bookings to have payment fields if missing
        return parsed.map((b) => ({
          ...b,
          paymentStatus: b.paymentStatus || (b.status === 'Completed' ? 'Paid' : b.status === 'Cancelled' ? 'Refunded' : 'Pending'),
          paymentMethod: b.paymentMethod || 'Credit Card',
          transactionId: b.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`
        }));
      } catch {
        return initialBookings;
      }
    }
    return initialBookings;
  });

  useEffect(() => {
    localStorage.setItem('rental_bookings_data', JSON.stringify(bookings));
  }, [bookings]);

  const createBooking = (bookingData) => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentStatus: bookingData.paymentStatus || "Pending",
      paymentMethod: bookingData.paymentMethod || "Credit Card",
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
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled", paymentStatus: "Refunded" } : b))
    );
    // Mark car as Available
    updateCarAvailability(carId, "Available");
  };

  const completeBooking = (bookingId, carId) => {
    const today = new Date().toISOString().split('T')[0];
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Completed", paymentStatus: "Paid", paidAt: today } : b))
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
