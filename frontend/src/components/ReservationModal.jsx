import React, { useState } from 'react';
import { X, Car, User, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

function ReservationModal({ isOpen, onClose, carName }) {
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/mcharki697@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nom: reservationData.name,
          Email: reservationData.email,
          Telephone: reservationData.phone,
          Vehicule: carName,
          Date_Depart: reservationData.pickupDate,
          Date_Retour: reservationData.returnDate,
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Erreur de connexion. Veuillez vérifier votre connexion internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setReservationData({ name: '', email: '', phone: '', pickupDate: '', returnDate: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-red-500/20 shadow-2xl animate-fade-in-up relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white font-playfair">Réservez votre voiture</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="text-green-500 mb-4" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">Réservation envoyée !</h3>
            <p className="text-gray-400 mb-6">
              Votre demande pour <span className="text-red-400 font-semibold">{carName}</span> a été transmise. Nous vous recontacterons très prochainement.
            </p>
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Car Name (readonly) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Véhicule sélectionné</label>
              <div className="relative">
                <input
                  type="text"
                  value={carName}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none cursor-default"
                />
                <Car className="absolute left-3 top-3.5 text-red-500" size={18} />
              </div>
            </div>

            {/* Full Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet *</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={reservationData.name}
                  onChange={handleChange}
                  required
                  placeholder="Mohammed Alami"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <User className="absolute left-3 top-3.5 text-red-500" size={18} />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={reservationData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Mail className="absolute left-3 top-3.5 text-red-500" size={18} />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone *</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={reservationData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+212 6XX XX XX XX"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Phone className="absolute left-3 top-3.5 text-red-500" size={18} />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">Date de départ *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="pickupDate"
                    value={reservationData.pickupDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-2 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm"
                  />
                  <Calendar className="absolute left-3 top-3.5 text-red-500" size={16} />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">Date de retour *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="returnDate"
                    value={reservationData.returnDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-2 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm"
                  />
                  <Calendar className="absolute left-3 top-3.5 text-red-500" size={16} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                'Confirmer la réservation'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;
