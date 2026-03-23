import React, { useState, useEffect } from 'react';
import { Calendar, User as UserIcon, Mail, Phone, MapPin, CheckCircle, Car as CarIcon, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

function ReservationPage({ searchData, onBack, onNavigate }) {
  const { user } = useAuth();
  const [selectedCar, setSelectedCar] = useState(null);
  const [loadingCar, setLoadingCar] = useState(true);
  
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    pickupLocation: searchData?.city || 'Casablanca',
    returnLocation: searchData?.city || 'Casablanca',
    pickupDate: searchData?.pickupDate || '',
    returnDate: searchData?.returnDate || '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch the selected car details from backend
  useEffect(() => {
    const fetchCar = async () => {
      if (!searchData?.carId) {
        setError('Aucun véhicule sélectionné.');
        setLoadingCar(false);
        return;
      }
      try {
        const { data } = await api.get(`/cars/${searchData.carId}`);
        setSelectedCar(data.car);
      } catch (err) {
        setError('Impossible de récupérer les détails du véhicule.');
      } finally {
        setLoadingCar(false);
      }
    };
    fetchCar();
  }, [searchData?.carId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onNavigate('login');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const reservationPayload = {
        carId: selectedCar._id,
        startDate: form.pickupDate,
        endDate: form.returnDate,
        pickupLocation: form.pickupLocation,
        returnLocation: form.returnLocation,
        notes: form.notes
      };

      const { data } = await api.post('/reservations', reservationPayload);
      
      if (data.success) {
        // Envoi d'un email de notification (Optionnel mais demandé)
        try {
          await fetch("https://formsubmit.co/ajax/mcharki697@gmail.com", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              Type: "Nouvelle Réservation (Base de données)",
              Client: form.fullName,
              Email: form.email,
              Vehicule: selectedCar.name,
              Depart: form.pickupDate,
              Retour: form.returnDate,
              Lieu: form.pickupLocation,
              Notes: form.notes
            })
          });
        } catch (emailErr) {
          console.error("Erreur notification email:", emailErr);
        }

        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCar) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-green-500/10 p-6 rounded-full mb-6">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 font-playfair">Réservation Confirmée !</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Merci {form.fullName}. Votre demande de réservation pour la <strong>{selectedCar.name}</strong> a été enregistrée. 
          Vous pouvez suivre l'état de votre commande dans votre espace client.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('my-reservations')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
          >
            Voir mes réservations
          </button>
          <button
            onClick={onBack}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all border border-gray-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour à la recherche
          </button>
          <h2 className="text-3xl font-bold text-white font-playfair">Finaliser votre réservation</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 mb-8 rounded flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Car Details */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden sticky top-24 border border-gray-800">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedCar?.image || 'https://images.unsplash.com/photo-1555353540-64fd1b19584a?q=80&w=800&auto=format&fit=crop'})` }}
              >
                {!selectedCar?.availability && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">Indisponible</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedCar?.name}</h3>
                    <p className="text-gray-500 capitalize">{selectedCar?.brand} · {selectedCar?.category}</p>
                  </div>
                  <div className="bg-red-500/20 text-red-500 font-bold px-3 py-1 rounded-lg border border-red-500/30">
                    {selectedCar?.price} DH/j
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <div className="flex items-center text-gray-400">
                    <CarIcon className="w-5 h-5 mr-3 text-red-500" />
                    <span>Carburant: <strong className="text-gray-200">{selectedCar?.fuel}</strong></span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <RefreshCw className="w-5 h-5 mr-3 text-red-500" />
                    <span>Transmission: <strong className="text-gray-200">{selectedCar?.transmission}</strong></span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <UserIcon className="w-5 h-5 mr-3 text-red-500" />
                    <span>Places: <strong className="text-gray-200">{selectedCar?.seats || 5}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Reservation Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6 font-playfair">Détails de la réservation</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info (Only if not logged in, but we'll show it as read-only if logged in) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-800">
                  <div className="md:col-span-2 flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Vos coordonnées</h4>
                    {!user && (
                      <button type="button" onClick={() => onNavigate('login')} className="text-red-500 text-sm hover:underline">
                        Déjà un compte ? Se connecter
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        disabled={!!user}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white disabled:opacity-60 transition-all"
                        placeholder="John Doe"
                      />
                      <UserIcon className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={!!user}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white disabled:opacity-60 transition-all"
                        placeholder="john@example.com"
                      />
                      <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                   <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Lieu et Dates</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Ville de départ *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pickupLocation"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white transition-all"
                      />
                      <MapPin className="absolute left-3 top-3.5 text-red-500 w-5 h-5" />
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Ville de retour *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="returnLocation"
                        value={form.returnLocation}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white transition-all"
                      />
                      <MapPin className="absolute left-3 top-3.5 text-red-500 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date de départ *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="pickupDate"
                        value={form.pickupDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white transition-all"
                      />
                      <Calendar className="absolute left-3 top-3.5 text-red-500 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date de retour *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="returnDate"
                        value={form.returnDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white transition-all"
                      />
                      <Calendar className="absolute left-3 top-3.5 text-red-500 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notes ou demandes particulières (Optionnel)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 text-white transition-all resize-none"
                    placeholder="Équipement supplémentaire, livraison à l'hôtel, etc."
                  ></textarea>
                </div>

                <div className="pt-4">
                  {!user && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-lg mb-4 text-sm flex items-center gap-3">
                      <AlertCircle size={18} />
                      Veuillez vous connecter pour confirmer votre réservation.
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedCar || !selectedCar.availability}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-xl text-lg flex justify-center items-center gap-3 transform hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="animate-spin h-5 w-5" />
                        Traitement...
                      </>
                    ) : (
                      user ? 'Confirmer la réservation' : 'Se connecter et Réserver'
                    )}
                  </button>
                  <p className="text-center text-gray-500 text-xs mt-4">
                    En cliquant sur confirmer, vous acceptez nos conditions générales de location.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper to keep icons consistent
function RefreshCw(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

export default ReservationPage;
