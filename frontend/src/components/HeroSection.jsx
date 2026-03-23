import React, { useState, useEffect } from 'react';

const backgroundImages = [
  'https://images.unsplash.com/photo-1555353540-64fd1b19584a?q=80&w=2000&auto=format&fit=crop', // BMW
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2000&auto=format&fit=crop', // Mercedes
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2000&auto=format&fit=crop', // Audi
  'https://images.unsplash.com/photo-1620882813838-518337deade3?q=80&w=2000&auto=format&fit=crop', // Toyota
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000&auto=format&fit=crop', // Lamborghini
  'https://images.unsplash.com/photo-1503376710356-be616bb1e72e?q=80&w=2000&auto=format&fit=crop'  // Porsche
];

import { Calendar, Car, MapPin, RefreshCw } from 'lucide-react';
import { cities } from '../carsData';
import api from '../config/api';

function HeroSection({ onSearchSubmit }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    city: cities[0],
    carId: '',
    pickupDate: '',
    returnDate: ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars');
        const fetchedCars = data.cars || [];
        setCars(fetchedCars);
        if (fetchedCars.length > 0) {
          setFormData(prev => ({ ...prev, carId: fetchedCars[0]._id }));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des voitures:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    onSearchSubmit(formData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="accueil" 
      className="min-h-screen relative overflow-hidden pt-16 flex items-center"
    >
      {/* Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent opacity-80 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 max-w-7xl mx-auto py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight font-playfair animate-fade-in-up text-center">
          Louez votre voiture <span className="text-red-500">au Maroc</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Une flotte de véhicules premium avec service haut de gamme. Réservation facile, tarifs compétitifs et livraison partout au Maroc.
        </p>

        {/* Compact Search Bar */}
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-3 mx-auto w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form className="flex flex-col md:flex-row gap-3 md:gap-2 items-end justify-between" onSubmit={handleSearchClick}>
            
            {/* City Selection */}
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Ville</label>
              <div className="relative">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-gray-50 text-gray-800 font-medium transition-colors hover:bg-white"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                  <MapPin size={18} />
                </div>
              </div>
            </div>

            {/* Car Selection */}
            <div className="flex-1 w-full md:w-auto mt-2 md:mt-0">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Véhicule</label>
              <div className="relative">
                <select
                  name="carId"
                  value={formData.carId}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-gray-50 text-gray-800 font-medium transition-colors hover:bg-white truncate"
                  disabled={loading || cars.length === 0}
                >
                  {loading ? (
                    <option>Chargement...</option>
                  ) : cars.length === 0 ? (
                    <option>Aucune voiture</option>
                  ) : (
                    cars.map(car => (
                      <option key={car._id} value={car._id}>{car.name} ({car.price} DH/j)</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                  <Car size={18} />
                </div>
              </div>
            </div>

            {/* Pickup Date */}
            <div className="w-full md:w-44 mt-2 md:mt-0">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Départ</label>
              <div className="relative">
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleFormChange}
                  required
                  className="w-full pl-3 pr-4 py-2.5 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-gray-800 font-medium transition-colors hover:bg-white [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:z-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            {/* Return Date */}
            <div className="w-full md:w-44 mt-2 md:mt-0">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Retour</label>
              <div className="relative">
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleFormChange}
                  required
                  className="w-full pl-3 pr-4 py-2.5 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-gray-800 font-medium transition-colors hover:bg-white [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:z-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-auto mt-4 md:mt-0 flex items-end">
              <button
                type="submit"
                className="w-full md:w-36 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Rechercher
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
