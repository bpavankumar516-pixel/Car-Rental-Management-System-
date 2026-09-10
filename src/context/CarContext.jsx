import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCars } from '../data/dummyCars';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('rental_cars_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(cars.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarsFromAPI = async () => {
      if (cars.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://dummyjson.com/products/category/vehicle');
        let apiData = [];
        
        if (res.ok) {
          const data = await res.json();
          apiData = data.products || [];
        }

        // If DummyJSON category/vehicle is empty or fails, fetch general products or fallback
        if (!apiData || apiData.length === 0) {
          const fallbackRes = await fetch('https://dummyjson.com/products?limit=10');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            apiData = fallbackData.products || [];
          }
        }

        // Transform API products into Car models with realistic specs
        const mappedCars = initialCars.map((defCar, index) => {
          const apiItem = apiData[index];
          return {
            ...defCar,
            image: apiItem?.thumbnail || apiItem?.images?.[0] || defCar.image,
          };
        });

        setCars(mappedCars);
        localStorage.setItem('rental_cars_data', JSON.stringify(mappedCars));
      } catch (err) {
        console.warn('DummyJSON fetch error, using robust fallback cars:', err);
        setCars(initialCars);
        localStorage.setItem('rental_cars_data', JSON.stringify(initialCars));
      } finally {
        setLoading(false);
      }
    };

    fetchCarsFromAPI();
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem('rental_cars_data', JSON.stringify(cars));
    }
  }, [cars]);

  const addCar = (newCarData) => {
    const newCar = {
      id: `car-${Date.now()}`,
      ...newCarData,
      availabilityStatus: newCarData.availabilityStatus || 'Available',
      image: newCarData.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    };
    setCars((prev) => [newCar, ...prev]);
    return newCar;
  };

  const updateCar = (id, updatedFields) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCar = (id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
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
        updateCarAvailability
      }}
    >
      {children}
    </CarContext.Provider>
  );
}

export const useCars = () => useContext(CarContext);
