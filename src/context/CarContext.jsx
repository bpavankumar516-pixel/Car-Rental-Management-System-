import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCars } from '../data/dummyCars';
import { fetchCarsFromAPI, addCarToAPI, updateCarInAPI, deleteCarFromAPI } from '../services/api';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('rental_cars_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCarsFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET Request (Network Tab: GET https://dummyjson.com/products/category/vehicle)
      const apiData = await fetchCarsFromAPI();

      setCars((prev) => {
        const customCars = prev.filter((c) => c.id.startsWith('car-') && !initialCars.some((ic) => ic.id === c.id));
        const mappedCars = initialCars.map((defCar, index) => {
          const apiItem = apiData[index];
          return {
            ...defCar,
            image: defCar.image || apiItem?.thumbnail || apiItem?.images?.[0],
          };
        });
        const combined = [...customCars, ...mappedCars];
        localStorage.setItem('rental_cars_data', JSON.stringify(combined));
        return combined;
      });
    } catch (err) {
      console.warn('DummyJSON fetch error, using robust fallback cars:', err);
      setCars(initialCars);
      localStorage.setItem('rental_cars_data', JSON.stringify(initialCars));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ALWAYS trigger loadCarsFromAPI on mount so GET request appears in DevTools Network tab
    loadCarsFromAPI();
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem('rental_cars_data', JSON.stringify(cars));
    }
  }, [cars]);

  const addCar = async (newCarData) => {
    const newCar = {
      id: `car-${Date.now()}`,
      ...newCarData,
      availabilityStatus: newCarData.availabilityStatus || 'Available',
      image: newCarData.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    };

    setCars((prev) => [newCar, ...prev]);

    // POST Request (Network Tab: POST https://dummyjson.com/products/add)
    await addCarToAPI(newCarData);

    return newCar;
  };

  const updateCar = async (id, updatedFields) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    // PUT Request (Network Tab: PUT https://dummyjson.com/products/:id)
    await updateCarInAPI(id, updatedFields);
  };

  const deleteCar = async (id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));

    // DELETE Request (Network Tab: DELETE https://dummyjson.com/products/:id)
    await deleteCarFromAPI(id);
  };

  const updateCarAvailability = (id, status) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, availabilityStatus: status } : c))
    );
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        loading,
        error,
        addCar,
        updateCar,
        deleteCar,
        updateCarAvailability,
        reloadCars: loadCarsFromAPI
      }}
    >
      {children}
    </CarContext.Provider>
  );
}

export const useCars = () => useContext(CarContext);
