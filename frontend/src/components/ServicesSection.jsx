import React from 'react';

function ServicesSection() {
  const services = [
    { icon: 'fas fa-plane', title: 'Livraison à l\'aéroport', desc: 'Service gratuit à tous les aéroports du Maroc' },
    { icon: 'fas fa-headset', title: 'Support 24/7', desc: 'Assistance disponible jour et nuit' },
    { icon: 'fas fa-shield-alt', title: 'Assurance complète', desc: 'Couverture complète avec franchise zéro' },
    { icon: 'fas fa-road', title: 'Kilométrage illimité', desc: 'Roulez sans restrictions au Maroc' },
    { icon: 'fas fa-wifi', title: 'GPS et WiFi', desc: 'Équipement complet dans tous les véhicules' },
    { icon: 'fas fa-gas-pump', title: 'Carburant gratuit', desc: 'Plein d\'essence inclus dans votre réservation' },
  ];

  return (
    <section id="services" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Nos <span className="text-red-500">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6 bg-gray-800/50 border border-red-500/10 rounded-lg hover:bg-gray-800/80 hover:border-red-500 transition-all hover:-translate-y-2">
              <div className="text-4xl text-red-500 mb-4">
                <i className={service.icon}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-playfair">{service.title}</h3>
              <p className="text-gray-400 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
