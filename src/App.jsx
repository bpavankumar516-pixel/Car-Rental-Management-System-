import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { CustomerProvider } from './context/CustomerContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import DashboardPage from './pages/DashboardPage';
import CarsPage from './pages/CarsPage';
import CustomersPage from './pages/CustomersPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import AvailabilityPage from './pages/AvailabilityPage';
import ReportsPage from './pages/ReportsPage';
import PaymentsPage from './pages/PaymentsPage';

// Modals
import CarFormModal from './components/cars/CarFormModal';
import CustomerFormModal from './components/customers/CustomerFormModal';
import NewBookingModal from './components/bookings/NewBookingModal';
import BookingSummaryModal from './components/bookings/BookingSummaryModal';

const VALID_TABS = ['dashboard', 'cars', 'customers', 'bookings', 'availability', 'reports', 'payments', 'profile'];

function MainApp() {
  const getInitialTab = () => {
    // 1. Try URL hash (e.g. #customers -> 'customers')
    const hash = window.location.hash.replace('#', '').trim();
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
    // 2. Try localStorage
    const savedTab = localStorage.getItem('carvo_active_tab');
    if (VALID_TABS.includes(savedTab)) {
      return savedTab;
    }
    // 3. Fallback default
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [globalSearch, setGlobalSearch] = useState('');

  const setActiveTab = (tab) => {
    if (!VALID_TABS.includes(tab)) return;
    setActiveTabState(tab);
    localStorage.setItem('carvo_active_tab', tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    // Sync current tab to hash on mount if not already present
    if (!window.location.hash || !VALID_TABS.includes(window.location.hash.replace('#', ''))) {
      window.location.hash = activeTab;
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem('carvo_active_tab', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Modals state
  const [carFormOpen, setCarFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [carDetailOpen, setCarDetailOpen] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState(null);

  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [preloadCarForBooking, setPreloadCarForBooking] = useState(null);

  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryPayload, setSummaryPayload] = useState(null);

  // Modal Handlers
  const handleOpenAddCar = () => {
    setEditingCar(null);
    setCarFormOpen(true);
  };

  const handleOpenEditCar = (car) => {
    setEditingCar(car);
    setCarFormOpen(true);
  };

  const handleOpenCarDetail = (car) => {
    setSelectedCarDetail(car);
    setActiveTab('cars');
  };

  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerFormOpen(true);
  };

  const handleOpenEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerFormOpen(true);
  };

  const handleOpenBookModal = (car = null) => {
    setPreloadCarForBooking(car);
    setNewBookingOpen(true);
  };

  const handleProceedToSummary = (payload) => {
    setSummaryPayload(payload);
    setNewBookingOpen(false);
    setSummaryModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />

        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardPage
                setActiveTab={setActiveTab}
                onOpenAddCar={handleOpenAddCar}
                onOpenNewBooking={() => handleOpenBookModal()}
                onOpenAddCustomer={handleOpenAddCustomer}
              />
            )}

            {activeTab === 'cars' && (
              <CarsPage
                onOpenAddModal={handleOpenAddCar}
                onOpenEditModal={handleOpenEditCar}
                onOpenDetailModal={handleOpenCarDetail}
                onOpenBookModal={handleOpenBookModal}
                globalSearch={globalSearch}
                selectedCarForDetail={selectedCarDetail}
                setSelectedCarForDetail={setSelectedCarDetail}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersPage
                onOpenAddCustomer={handleOpenAddCustomer}
                onEditCustomer={handleOpenEditCustomer}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsPage
                onOpenNewBooking={() => handleOpenBookModal()}
              />
            )}

            {activeTab === 'availability' && (
              <AvailabilityPage />
            )}

            {activeTab === 'reports' && (
              <ReportsPage />
            )}

            {activeTab === 'payments' && (
              <PaymentsPage />
            )}

            {activeTab === 'profile' && (
              <ProfilePage />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CarFormModal
        isOpen={carFormOpen}
        onClose={() => setCarFormOpen(false)}
        initialData={editingCar}
      />

      <CustomerFormModal
        isOpen={customerFormOpen}
        onClose={() => setCustomerFormOpen(false)}
        initialData={editingCustomer}
      />

      <NewBookingModal
        isOpen={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        selectedCarPreload={preloadCarForBooking}
        onProceedToSummary={handleProceedToSummary}
      />

      <BookingSummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        summaryData={summaryPayload}
        onConfirmed={() => setActiveTab('bookings')}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CarProvider>
          <CustomerProvider>
            <BookingProvider>
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            </BookingProvider>
          </CustomerProvider>
        </CarProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
