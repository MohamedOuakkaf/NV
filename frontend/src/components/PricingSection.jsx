import React from 'react';
import { Check } from 'lucide-react';

function PricingSection({ onReserve }) {
  const plans = [
    {
      name: 'Économique',
      price: '200',
      features: [
        'Véhicules compacts et citadines',
        'Assurance de base incluse',
        'Kilométrage illimité',
        'Climatisation',
        'Annulation gratuite 24h avant'
      ],
      isPopular: false
    },
    {
      name: 'Confort',
      price: '320',
      features: [
        'Berlines et SUV compacts',
        'Assurance tous risques',
        'Kilométrage illimité',
        'GPS inclus',
        'Livraison aéroport gratuite',
        'Support prioritaire 24/7'
      ],
      isPopular: true
    },
    {
      name: 'Premium',
      price: '600',
      features: [
        'Véhicules haut de gamme',
        'Assurance tous risques + rachat franchise',
        'Kilométrage illimité',
        'GPS + siège bébé offerts',
        'Livraison partout au Maroc',
        'Conciergerie dédiée',
        'Véhicule de remplacement'
      ],
      isPopular: false
    }
  ];

  return (
    <section id="tarifs" className="py-24 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
            Nos <span className="text-red-500">Tarifs</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Des offres adaptées à chaque budget, sans frais cachés.
          </p>
          <div className="w-24 h-1 bg-red-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative bg-gray-800 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.isPopular 
                  ? 'border-2 border-red-500 shadow-2xl shadow-red-500/10 md:-mt-4 md:mb-4' 
                  : 'border border-gray-700 hover:border-gray-500 mt-4'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                    Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">à partir de</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-red-500">{plan.price}</span>
                  <span className="text-xl font-bold text-red-500 mb-1">Dhs</span>
                  <span className="text-gray-400 mb-2">/jour</span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <Check className="text-red-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onReserve && onReserve('')}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                    : 'bg-gray-700 hover:bg-gray-600 text-white hover:text-white border border-gray-600'
                }`}
              >
                Réserver
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
