import React from 'react';

function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-playfair">LUXCAR</h3>
            <p className="text-gray-400 text-sm">Location de voitures premium au Maroc depuis 2015</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#accueil" className="hover:text-red-500 transition">Accueil</a></li>
              <li><a href="#flotte" className="hover:text-red-500 transition">Flotte</a></li>
              <li><a href="#services" className="hover:text-red-500 transition">Services</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-red-500 transition">Conditions générales</a></li>
              <li><a href="#" className="hover:text-red-500 transition">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-red-500 transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Réseaux Sociaux</h4>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-red-500 transition"><i className="fab fa-facebook text-lg"></i></a>
              <a href="#" className="hover:text-red-500 transition"><i className="fab fa-instagram text-lg"></i></a>
              <a href="#" className="hover:text-red-500 transition"><i className="fab fa-twitter text-lg"></i></a>
              <a href="#" className="hover:text-red-500 transition"><i className="fab fa-linkedin text-lg"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 LUXCAR. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
