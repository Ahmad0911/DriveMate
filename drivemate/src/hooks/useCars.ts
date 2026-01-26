// src/hooks/useCars.ts
import { useState, useEffect } from 'react';
import { carAPI, handleAPIError } from '../services/api';

interface SearchParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
}

export const useCars = (searchParams?: SearchParams) => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carAPI.searchCars(searchParams);
      setCars(response.data || response.cars || []);
    } catch (err) {
      setError(handleAPIError(err));
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [JSON.stringify(searchParams)]);

  return { cars, loading, error, refetch: fetchCars };
};

export const useCar = (carId: string) => {
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carAPI.getCar(carId);
        setCar(response.data || response.car);
      } catch (err) {
        setError(handleAPIError(err));
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  return { car, loading, error };
};