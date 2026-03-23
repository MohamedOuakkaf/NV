import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Car, Calendar, Users, Plus, Trash2, Check, X,
  Clock, TrendingUp, AlertCircle, LogOut, ChevronDown, Upload, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const TABS = [
  { id: 'stats', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'cars', label: 'Voitures', icon: Car },
];

const STATUS_LABELS = {
  en_attente: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmée: { label: 'Confirmée', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  annulée: { label: 'Annulée', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  terminée: { label: 'Terminée', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${s.color}`}>{s.label}</span>;
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/reservations/stats');
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: 'Total Réservations', value: stats?.totalReservations, icon: Calendar, color: 'from-blue-600 to-blue-700' },
    { label: 'En Attente', value: stats?.pendingReservations, icon: Clock, color: 'from-yellow-600 to-yellow-700' },
    { label: 'Confirmées', value: stats?.confirmedReservations, icon: Check, color: 'from-green-600 to-green-700' },
    { label: 'Annulées', value: stats?.cancelledReservations, icon: X, color: 'from-red-600 to-red-700' },
    { label: 'Total Voitures', value: stats?.totalCars, icon: Car, color: 'from-purple-600 to-purple-700' },
    { label: 'Disponibles', value: stats?.availableCars, icon: Check, color: 'from-teal-600 to-teal-700' },
    { label: 'Revenu Total (DH)', value: stats?.totalRevenue?.toLocaleString('fr-MA'), icon: TrendingUp, color: 'from-orange-600 to-orange-700' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 font-playfair">Vue d'ensemble</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-xl p-5 shadow-lg`}>
            <Icon className="text-white/80 mb-3" size={24} />
            <div className="text-3xl font-bold text-white mb-1">{value ?? 0}</div>
            <div className="text-white/70 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reservations Tab ─────────────────────────────────────────────────────────
function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await api.get('/reservations', { params });
      setReservations(data.reservations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white font-playfair">Réservations</h2>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <button onClick={fetchReservations} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-gray-500 py-16">Aucune réservation trouvée.</div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r._id} className="bg-gray-750 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">{r.user?.name || 'Client inconnu'}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-sm text-gray-400">
                    🚗 <span className="text-gray-300">{r.car?.name || 'Voiture inconnue'}</span>
                    {' · '}📅 {new Date(r.startDate).toLocaleDateString('fr-MA')} → {new Date(r.endDate).toLocaleDateString('fr-MA')}
                    {' · '}💰 <span className="text-green-400 font-semibold">{r.totalPrice?.toLocaleString('fr-MA')} DH</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{r.user?.email} · {r.user?.phone}</div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {r.status === 'en_attente' && (
                    <>
                      <button
                        onClick={() => updateStatus(r._id, 'confirmée')}
                        disabled={updating === r._id}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        <Check size={14} /> Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(r._id, 'annulée')}
                        disabled={updating === r._id}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        <X size={14} /> Annuler
                      </button>
                    </>
                  )}
                  {r.status === 'confirmée' && (
                    <button
                      onClick={() => updateStatus(r._id, 'terminée')}
                      disabled={updating === r._id}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      <Check size={14} /> Terminer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cars Tab ─────────────────────────────────────────────────────────────────
function CarsTab() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', brand: '', price: '', category: 'berline', fuel: 'essence', transmission: 'manuelle', seats: 5, image: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cars');
      setCars(data.cars || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/cars', {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        category: form.category,
        fuel: form.fuel,
        transmission: form.transmission,
        seats: Number(form.seats),
        image: form.image,
      });
      setShowForm(false);
      setForm({ name: '', brand: '', price: '', category: 'berline', fuel: 'essence', transmission: 'manuelle', seats: 5, image: '' });
      fetchCars();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirmer la suppression de cette voiture ?')) return;
    setDeleting(id);
    try {
      await api.delete(`/cars/${id}`);
      fetchCars();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-playfair">Gestion des Voitures</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Ajouter une voiture
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAddCar} className="bg-gray-750 border border-gray-700 rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="md:col-span-2 text-lg font-bold text-white mb-1">Nouvelle voiture</h3>
          {[
            { name: 'name', label: 'Nom *', placeholder: 'ex: Clio 5' },
            { name: 'brand', label: 'Marque *', placeholder: 'ex: Renault' },
            { name: 'price', label: 'Prix / jour (DH) *', placeholder: '150', type: 'number' },
            { name: 'seats', label: 'Places', placeholder: '5', type: 'number' },
            { name: 'image', label: 'URL de l\'image', placeholder: 'https://...', colSpan: true },
          ].map(({ name, label, placeholder, type = 'text', colSpan }) => (
            <div key={name} className={colSpan ? 'md:col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Catégorie</label>
            <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              {['économique', 'berline', 'SUV', 'sport', 'luxe', 'utilitaire'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Carburant</label>
            <select name="fuel" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              {['essence', 'diesel', 'électrique', 'hybride'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Transmission</label>
            <select name="transmission" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              {['manuelle', 'automatique'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus size={16} /> Ajouter</>}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 rounded-lg transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Cars Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car._id} className="bg-gray-750 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition group">
              <div className="h-40 bg-gray-800 overflow-hidden relative">
                {car.image ? (
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600"><Car size={48} /></div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${car.availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                  {car.availability ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">{car.name}</h3>
                    <p className="text-sm text-gray-400">{car.brand} · {car.category}</p>
                  </div>
                  <span className="text-red-400 font-bold text-lg">{car.price} DH/j</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-500">{car.fuel} · {car.transmission} · {car.seats} places</span>
                  <button
                    onClick={() => handleDelete(car._id)}
                    disabled={deleting === car._id}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition text-xs disabled:opacity-50"
                  >
                    {deleting === car._id ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ onNavigate }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-gray-400 mb-6">Vous devez être administrateur pour accéder à cette page.</p>
          <button onClick={() => onNavigate('login')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => { logout(); onNavigate('home'); };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-700">
          <button onClick={() => onNavigate('home')} className="text-xl font-bold font-playfair text-white">
            LUX<span className="text-red-500">CAR</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === id ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition px-2 py-1.5 rounded hover:bg-gray-700">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-white font-playfair">LUX<span className="text-red-500">CAR</span> Admin</span>
        <div className="flex gap-2">
          {TABS.map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`p-2 rounded-lg transition ${activeTab === id ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
              <Icon size={18} />
            </button>
          ))}
          <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'reservations' && <ReservationsTab />}
          {activeTab === 'cars' && <CarsTab />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
