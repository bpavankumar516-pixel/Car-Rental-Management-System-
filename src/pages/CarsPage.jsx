import React, { useState } from 'react';
import { PlusCircle, Car, AlertCircle } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useToast } from '../context/ToastContext';
import CarCard from '../components/cars/CarCard';
import CarFilterBar from '../components/cars/CarFilterBar';
import { CarCardSkeleton } from '../components/common/SkeletonLoader';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function CarsPage({ onOpenAddModal, onOpenEditModal, onOpenDetailModal, onOpenBookModal, globalSearch }) {
  const { cars, loading, deleteCar } = useCars();
  const { addToast } = useToast();

  const [search, setSearch] = useState(globalSearch || '');
  const [brand, setBrand] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Extract unique brands list dynamically
  const brandsList = Array.from(new Set(cars.map((c) => c.brand)));

  // Filter cars logic
  let filteredCars = cars.filter((car) => {
    const activeSearch = search || globalSearch;
    const matchesSearch =
      !activeSearch ||
      car.brand.toLowerCase().includes(activeSearch.toLowerCase()) ||
      car.model.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesBrand = brand === 'All' || car.brand === brand;
    const matchesFuel = fuelType === 'All' || car.fuelType === fuelType;
    const matchesTrans = transmission === 'All' || car.transmission === transmission;

    return matchesSearch && matchesBrand && matchesFuel && matchesTrans;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filteredCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-desc') {
    filteredCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'year-desc') {
    filteredCars.sort((a, b) => b.year - a.year);
  }

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteCar(deleteTargetId);
      addToast('Car deleted from fleet inventory', 'info');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white">Car Fleet Management</h2>
          <p className="text-xs text-slate-400">Total Cars: {cars.length} Vehicles in System</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add New Vehicle
        </button>
      </div>

      {/* Filters Bar */}
      <CarFilterBar
        search={search}
        setSearch={setSearch}
        brand={brand}
        setBrand={setBrand}
        fuelType={fuelType}
        setFuelType={setFuelType}
        transmission={transmission}
        setTransmission={setTransmission}
        sortBy={sortBy}
        setSortBy={setSortBy}
        brandsList={brandsList}
      />

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        /* Empty State UI */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl my-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Cars Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or brand/fuel filters to view available vehicles.
          </p>
          <button
            onClick={() => { setSearch(''); setBrand('All'); setFuelType('All'); setTransmission('All'); setSortBy('default'); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onViewDetails={onOpenDetailModal}
              onEdit={onOpenEditModal}
              onDelete={(id) => setDeleteTargetId(id)}
              onBook={onOpenBookModal}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Car Record"
        message="Are you sure you want to remove this car from the system?"
        confirmText="Delete Vehicle"
      />

    </div>
  );
}
