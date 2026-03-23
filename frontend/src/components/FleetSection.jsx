import React, { useState, useEffect } from 'react';
import CarCard from './CarCard';
import api from '../config/api';

const CATEGORIES = ['all', 'économique', 'berline', 'SUV', 'sport', 'luxe', 'utilitaire'];

function FleetSection({ onReserve }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars');
        setCars(data.cars || []);
      } catch (e) {
        setError('Impossible de charger les voitures.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = filter === 'all'
    ? cars
    : cars.filter(car => car.category === filter);

  // Map backend car to the format CarCard expects
  const mapCar = (car) => ({
    id: car._id,
    name: car.name,
    brand: car.brand,
    price: car.price,
    fuel: car.fuel,
    transmission: car.transmission,
    passengers: String(car.seats || 5),
    category: car.category,
    image: car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
    availability: car.availability,
  });

  return (
    <section id="flotte" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Notre <span className="text-red-500">Flotte</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules premium avec différentes catégories pour tous les besoins.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all capitalize ${
                filter === category
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'border border-red-500/30 text-gray-300 hover:text-white hover:border-red-500'
              }`}
            >
              {category === 'all' ? 'Tous les véhicules' : category}
            </button>
          ))}
        </div>

        {/* State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 py-10">{error}</p>
        ) : filteredCars.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Aucun véhicule dans cette catégorie.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <CarCard key={car._id} car={mapCar(car)} onReserve={onReserve} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FleetSection;
