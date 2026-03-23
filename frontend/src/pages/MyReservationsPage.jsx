import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Car, MapPin, CheckCircle, Clock, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const STATUS_LABELS = {
  en_attente: { label: 'En attente', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  confirmée: { label: 'Confirmée', icon: CheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  annulée: { label: 'Annulée', icon: X, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  terminée: { label: 'Terminée', icon: CheckCircle, color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
};

function MyReservationsPage({ onNavigate }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reservations/my');
      setReservations(data.reservations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const handleCancel = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    setCancelling(id);
    try {
      await api.put(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (e) {
      alert(e.response?.data?.message || 'Impossible d\'annuler cette réservation.');
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour voir vos réservations.</p>
          <button onClick={() => onNavigate('login')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white font-playfair">Mes Réservations</h1>
            <p className="text-gray-400">Bonjour, {user.name} 👋</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
            <Car className="text-gray-600 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">Aucune réservation</h3>
            <p className="text-gray-400 mb-6">Vous n'avez pas encore effectué de réservation.</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition"
            >
              Réserver un véhicule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => {
              const s = STATUS_LABELS[r.status] || { label: r.status, icon: Clock, color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' };
              const StatusIcon = s.icon;
              const canCancel = ['en_attente', 'confirmée'].includes(r.status);

              return (
                <div key={r._id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition">
                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Car image */}
                    <div className="sm:w-44 h-36 sm:h-auto bg-gray-700 flex-shrink-0">
                      {r.car?.image ? (
                        <img src={r.car.image} alt={r.car.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500"><Car size={40} /></div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{r.car?.name || 'Véhicule'}</h3>
                          <p className="text-gray-400 text-sm">{r.car?.brand} · {r.car?.category}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
                          <StatusIcon size={12} />
                          {s.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={14} className="text-red-500" />
                          <span>
                            {new Date(r.startDate).toLocaleDateString('fr-MA')} →{' '}
                            {new Date(r.endDate).toLocaleDateString('fr-MA')}
                          </span>
                        </div>
                        {r.pickupLocation && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin size={14} className="text-red-500" />
                            <span>{r.pickupLocation}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                        <div>
                          <span className="text-gray-500 text-xs">Total · {r.totalDays} jour(s)</span>
                          <p className="text-green-400 font-bold text-lg">{r.totalPrice?.toLocaleString('fr-MA')} DH</p>
                        </div>
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(r._id)}
                            disabled={cancelling === r._id}
                            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            {cancelling === r._id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <><X size={14} /> Annuler</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservationsPage;
