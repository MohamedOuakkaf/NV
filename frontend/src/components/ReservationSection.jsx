import React, { useState } from 'react';
import { Calendar, MapPin, Car, CheckCircle } from 'lucide-react';

const CAR_MODELS = [
  {
    name: "BMW Series 3",
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=800&q=80",
    price: "800",
    fuel: "Diesel",
    transmission: "Automatique",
    passengers: "5 Places"
  },
  {
    name: "Mercedes C-Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    price: "900",
    fuel: "Diesel",
    transmission: "Automatique",
    passengers: "5 Places"
  },
  {
    name: "Audi A4",
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=80",
    price: "850",
    fuel: "Diesel",
    transmission: "Automatique",
    passengers: "5 Places"
  },
  {
    name: "Toyota Corolla",
    image: "https://images.unsplash.com/photo-1629897048514-3dd74152e9fc?auto=format&fit=crop&w=800&q=80",
    price: "400",
    fuel: "Hybride",
    transmission: "Automatique",
    passengers: "5 Places"
  }
];

const CITIES = ["Casablanca", "Rabat", "Fès", "Marrakech", "Tanger", "Agadir"];

function ReservationSection({ onOpenModal }) {
  const [uiState, setUiState] = useState('idle'); // idle | loading | results | submitting | success
  
  const [searchParams, setSearchParams] = useState({
    city: '',
    carModel: '',
    pickupDate: '',
    returnDate: ''
  });

  const [reservationData, setReservationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const selectedCar = CAR_MODELS.find(c => c.name === searchParams.carModel);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleReservationChange = (e) => {
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchParams.city || !searchParams.carModel || !searchParams.pickupDate || !searchParams.returnDate) {
      alert("Veuillez remplir tous les champs de recherche");
      return;
    }
    setUiState('loading');
    setTimeout(() => {
      setUiState('results');
    }, 1200);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setUiState('submitting');
    
    // FormSubmit Integration
    try {
      const response = await fetch("https://formsubmit.co/ajax/mcharki697@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nom: reservationData.fullName,
            Email: reservationData.email,
            Telephone: reservationData.phone,
            Vehicule: searchParams.carModel,
            Ville: searchParams.city,
            Date_Depart: searchParams.pickupDate,
            Date_Retour: searchParams.returnDate,
            Message: reservationData.message
        })
      });

      if (response.ok) {
        setUiState('success');
      } else {
        alert("Une erreur s'est produite. Veuillez réessayer.");
        setUiState('results');
      }
    } catch (error) {
      alert("Une erreur s'est produite. Veuillez vérifier votre connexion.");
      setUiState('results');
    }
  };

  // 1. Idle State: Compact Search Bar
  if (uiState === 'idle') {
    return (
      <section className="bg-white py-6 px-4 md:px-8 -mt-24 relative z-20 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-2xl transition-all duration-500">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="w-full md:w-1/4 relative">
            <select
              name="city"
              value={searchParams.city}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700 appearance-none shadow-sm"
            >
              <option value="">Ville de départ</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <MapPin className="absolute left-4 top-3.5 text-red-500" size={16} />
          </div>

          <div className="w-full md:w-1/4 relative">
            <select
              name="carModel"
              value={searchParams.carModel}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700 appearance-none shadow-sm"
            >
              <option value="">Sélectionner un véhicule</option>
              {CAR_MODELS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <Car className="absolute left-4 top-3.5 text-red-500" size={16} />
          </div>

          <div className="w-full md:w-1/4 relative flex gap-2">
            <div className="relative w-1/2">
               <input
                 type="date"
                 name="pickupDate"
                 value={searchParams.pickupDate}
                 onChange={handleSearchChange}
                 className="w-full pl-8 pr-2 py-3 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 shadow-sm"
               />
               <Calendar className="absolute left-3 top-3.5 text-red-500" size={14} />
            </div>
            <div className="relative w-1/2">
               <input
                 type="date"
                 name="returnDate"
                 value={searchParams.returnDate}
                 onChange={handleSearchChange}
                 className="w-full pl-8 pr-2 py-3 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 shadow-sm"
               />
               <Calendar className="absolute left-3 top-3.5 text-red-500" size={14} />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Rechercher
            </button>
          </div>

        </form>
      </section>
    );
  }

  // 2. Loading State
  if (uiState === 'loading') {
    return (
      <section className="bg-white py-16 px-4 md:px-8 -mt-24 relative z-20 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Recherche de véhicules disponibles...</p>
      </section>
    );
  }

  // 4. Success State
  if (uiState === 'success') {
    return (
      <section className="bg-white py-16 px-4 md:px-8 -mt-24 relative z-20 mx-4 md:mx-auto max-w-4xl rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center animate-fade-in-up">
        <CheckCircle className="text-green-500 mb-6" size={80} />
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">Réservation envoyée avec succès !</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Nous avons bien reçu votre demande pour le véhicule <span className="font-semibold">{searchParams.carModel}</span>. 
          Un agent vous contactera très prochainement pour confirmer votre réservation.
        </p>
        <button
          onClick={() => {
            setUiState('idle');
            setSearchParams({ city: '', carModel: '', pickupDate: '', returnDate: '' });
          }}
          className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-full transition-all"
        >
          Faire une nouvelle recherche
        </button>
      </section>
    );
  }

  // 3. Results Layout (Left: Car, Right: Form)
  return (
    <section className="bg-white p-6 md:p-10 -mt-24 relative z-20 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-2xl animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold font-playfair text-gray-900 flex items-center gap-2">
          Résultats de votre recherche
        </h2>
        <button onClick={() => setUiState('idle')} className="text-sm text-red-500 hover:underline font-medium">
          Modifier la recherche
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: Car Details */}
        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="h-64 sm:h-80 overflow-hidden relative">
            <img 
              src={selectedCar?.image} 
              alt={selectedCar?.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              {selectedCar?.price} DH/jour
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">{selectedCar?.name}</h3>
            
            <div className="flex flex-col gap-4 text-gray-700">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <MapPin className="text-red-500" size={20} />
                <span className="font-medium">Agence: <span className="text-gray-900">{searchParams.city}</span></span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <Calendar className="text-red-500" size={20} />
                <span className="font-medium">Dates: <span className="text-gray-900">{searchParams.pickupDate} au {searchParams.returnDate}</span></span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
               <div className="flex flex-col items-center text-gray-600">
                 <i className="fas fa-gas-pump text-red-500 mb-2 text-xl"></i>
                 <span className="text-sm font-medium">{selectedCar?.fuel}</span>
               </div>
               <div className="flex flex-col items-center text-gray-600">
                 <i className="fas fa-cog text-red-500 mb-2 text-xl"></i>
                 <span className="text-sm font-medium">{selectedCar?.transmission}</span>
               </div>
               <div className="flex flex-col items-center text-gray-600">
                 <i className="fas fa-users text-red-500 mb-2 text-xl"></i>
                 <span className="text-sm font-medium">{selectedCar?.passengers}</span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Reservation Form */}
        <div className="bg-white flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-playfair border-b pb-2">Finaliser la réservation</h3>
          <form onSubmit={handleReservationSubmit} className="space-y-5 flex-1 flex flex-col">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                type="text"
                name="fullName"
                required
                value={reservationData.fullName}
                onChange={handleReservationChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Mohammed Alami"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={reservationData.email}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={reservationData.phone}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+212 6XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optionnel)</label>
              <textarea
                name="message"
                value={reservationData.message}
                onChange={handleReservationChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Demandes particulières..."
              ></textarea>
            </div>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={uiState === 'submitting'}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
              >
                {uiState === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </span>
                ) : (
                  "Confirmer la réservation"
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                 <CheckCircle size={14} className="text-green-500"/> Vos données sont sécurisées
              </p>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}

export default ReservationSection;
