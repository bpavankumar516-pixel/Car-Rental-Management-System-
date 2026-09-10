import React, { useState } from 'react';
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
import SettingsPage from './pages/SettingsPage';
import PromotionsPage from './pages/PromotionsPage';
import ContactPage from './pages/ContactPage';

// Modals
import CarFormModal from './components/cars/CarFormModal';
import CarDetailModal from './components/cars/CarDetailModal';
import CustomerFormModal from './components/customers/CustomerFormModal';
import NewBookingModal from './components/bookings/NewBookingModal';
import BookingSummaryModal from './components/bookings/BookingSummaryModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

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
    setCarDetailOpen(true);
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

            {activeTab === 'promotions' && (
              <PromotionsPage />
            )}

            {activeTab === 'contact' && (
              <ContactPage />
            )}

            {activeTab === 'profile' && (
              <ProfilePage />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
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

      <CarDetailModal
        isOpen={carDetailOpen}
        onClose={() => setCarDetailOpen(false)}
        car={selectedCarDetail}
        onBook={handleOpenBookModal}
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
