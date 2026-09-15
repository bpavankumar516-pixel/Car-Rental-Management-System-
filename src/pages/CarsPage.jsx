import React, { useState, useEffect } from 'react';
import { PlusCircle, Car, Eye, Edit3, Trash2, Calendar, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useToast } from '../context/ToastContext';
import CarCard from '../components/cars/CarCard';
import CarFilterBar from '../components/cars/CarFilterBar';
import { CarCardSkeleton } from '../components/common/SkeletonLoader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CarDetailPage from './CarDetailPage';

export default function CarsPage({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onOpenBookModal,
  globalSearch,
  selectedCarForDetail: propSelectedCar,
  setSelectedCarForDetail: propSetSelectedCar
}) {
  const { cars, loading, deleteCar, reloadCars } = useCars();
  const { addToast } = useToast();

  const [localSelectedCar, setLocalSelectedCar] = useState(null);

  const activeSelectedCar = propSelectedCar !== undefined ? propSelectedCar : localSelectedCar;
  const handleSetSelectedCar = (car) => {
    if (propSetSelectedCar) {
      propSetSelectedCar(car);
    } else {
      setLocalSelectedCar(car);
    }
  };

  const [search, setSearch] = useState(globalSearch || '');
  const [brand, setBrand] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Pagination state (10 cars per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const brandsList = Array.from(new Set(cars.map((c) => c.brand)));

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

  if (sortBy === 'price-asc') {
    filteredCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-desc') {
    filteredCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'year-desc') {
    filteredCars.sort((a, b) => b.year - a.year);
  }

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, brand, fuelType, transmission, sortBy, globalSearch]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteCar(deleteTargetId);
      addToast('Car deleted from fleet inventory', 'info');
      setDeleteTargetId(null);
    }
  };

  if (activeSelectedCar) {
    return (
      <CarDetailPage
        car={activeSelectedCar}
        onBack={() => handleSetSelectedCar(null)}
        onBook={onOpenBookModal}
        onEdit={onOpenEditModal}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Car Fleet Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Total Fleet: {cars.length} Vehicles in System</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
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
        viewMode={viewMode}
        setViewMode={setViewMode}
        brandsList={brandsList}
      />

      {/* Main Content View (Grid or Table) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs my-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Cars Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or brand/fuel filters to view available vehicles.
          </p>
          <button
            onClick={() => { setSearch(''); setBrand('All'); setFuelType('All'); setTransmission('All'); setSortBy('default'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onViewDetails={() => handleSetSelectedCar(car)}
              onEdit={onOpenEditModal}
              onDelete={(id) => setDeleteTargetId(id)}
              onBook={onOpenBookModal}
            />
          ))}
        </div>
      ) : (
        /* Table View Mode */
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Vehicle Detail</th>
                  <th className="p-4">Brand & Model</th>
                  <th className="p-4">Specs</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedCars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{car.brand} {car.model}</div>
                      <div className="text-[11px] text-slate-400">Year: {car.year} | ID: {car.id}</div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div>{car.fuelType} • {car.transmission}</div>
                      <div className="text-[11px] text-slate-400">{car.seats || 5} Seats</div>
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ${car.pricePerDay} <span className="text-[10px] font-normal text-slate-400">/day</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          car.availabilityStatus === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : car.availabilityStatus === 'Booked'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {car.availabilityStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSetSelectedCar(car)}
                          title="View Details"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(car)}
                          title="Edit Vehicle"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {car.availabilityStatus === 'Available' && (
                          <button
                            onClick={() => onOpenBookModal(car)}
                            title="Book Vehicle"
                            className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Book
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteTargetId(car.id)}
                          title="Delete Vehicle"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && filteredCars.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredCars.length)}</strong> to <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredCars.length)}</strong> of <strong className="text-slate-900">{filteredCars.length}</strong> Vehicles
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer shadow-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer shadow-xs font-semibold flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
