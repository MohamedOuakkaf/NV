import React, { useState } from 'react';
import { Phone, Menu, X, LogOut, LayoutDashboard, CalendarDays, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navigation({ onOpenModal, onNavigate }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    onNavigate('home');
  };

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#flotte', label: 'Flotte' },
    { href: '#destinations', label: 'Destinations' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="text-2xl font-bold font-playfair text-white">
          LUX<span className="text-red-500">CAR</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="text-gray-300 hover:text-white transition text-sm font-medium">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="tel:+212600000000" className="hidden md:flex text-gray-400 items-center gap-1.5 hover:text-red-400 text-sm transition">
            <Phone size={16} /> +212 6 00 00 00 00
          </a>

          {/* Auth buttons */}
          {user ? (
            <>
              {user.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg transition"
                >
                  <LayoutDashboard size={15} /> Admin
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('my-reservations')}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg transition"
                >
                  <CalendarDays size={15} /> Mes réservations
                </button>
              )}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="text-gray-400 hover:text-red-400 transition p-1"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg transition"
              >
                <LogIn size={15} /> Connexion
              </button>
              <button
                onClick={() => { if (onOpenModal) onOpenModal(); else onNavigate('login'); }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 text-sm rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Réserver
              </button>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white ml-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-red-500/20 animate-fade-in-up">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm py-2 px-3 rounded hover:bg-gray-700 transition">
                {label}
              </a>
            ))}
            <hr className="border-gray-700 my-2" />
            {user ? (
              <>
                <span className="text-gray-500 text-xs px-3 pt-1">Connecté : {user.name}</span>
                {user.role === 'admin' ? (
                  <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }} className="text-left text-sm text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700 flex items-center gap-2 transition">
                    <LayoutDashboard size={16} /> Dashboard Admin
                  </button>
                ) : (
                  <button onClick={() => { onNavigate('my-reservations'); setMobileMenuOpen(false); }} className="text-left text-sm text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700 flex items-center gap-2 transition">
                    <CalendarDays size={16} /> Mes réservations
                  </button>
                )}
                <button onClick={handleLogout} className="text-left text-sm text-red-400 py-2 px-3 rounded hover:bg-gray-700 flex items-center gap-2 transition">
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="text-left text-sm text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700 flex items-center gap-2 transition">
                  <LogIn size={16} /> Se connecter
                </button>
                <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left text-sm text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700 flex items-center gap-2 transition">
                  <UserPlus size={16} /> S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
