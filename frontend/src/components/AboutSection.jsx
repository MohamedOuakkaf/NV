import React from 'react';

function AboutSection() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 font-playfair">
          À propos de <span className="text-red-500">LUXCAR</span>
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          LUXCAR est le leader de la location de voitures au Maroc depuis 2015. Nous offrons une expérience premium avec une flotte moderne et un service client exceptionnel. Notre mission est de faire de chaque voyage au Maroc une expérience inoubliable.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div>
            <div className="text-3xl font-bold text-red-500 font-playfair">500+</div>
            <div className="text-gray-400 text-sm">Voitures</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 font-playfair">50K+</div>
            <div className="text-gray-400 text-sm">Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 font-playfair">9</div>
            <div className="text-gray-400 text-sm">Villes</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
