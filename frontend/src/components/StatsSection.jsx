import React, { useEffect, useState } from 'react';

function StatsSection() {
  const [cars, setCars] = useState(0);
  const [clients, setClients] = useState(0);
  const [cities, setCities] = useState(0);
  const [years, setYears] = useState(0);

  useEffect(() => {
    const animateCounter = (targetValue, setterFunction, duration = 2000) => {
      let currentValue = 0;
      const increment = targetValue / (duration / 30);
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          setterFunction(targetValue);
          clearInterval(interval);
        } else {
          setterFunction(Math.floor(currentValue));
        }
      }, 30);
    };

    animateCounter(500, setCars);
    animateCounter(50000, setClients);
    animateCounter(9, setCities);
    animateCounter(9, setYears);
  }, []);

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-red-500 mb-2 font-playfair">{cars}+</div>
            <div className="text-gray-400 text-sm">Voitures disponibles</div>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-red-500 mb-2 font-playfair">{clients}+</div>
            <div className="text-gray-400 text-sm">Clients satisfaits</div>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-red-500 mb-2 font-playfair">{cities}</div>
            <div className="text-gray-400 text-sm">Villes couvertes</div>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-red-500 mb-2 font-playfair">{years}</div>
            <div className="text-gray-400 text-sm">Années d'expérience</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
