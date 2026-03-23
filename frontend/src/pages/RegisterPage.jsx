import React, { useState } from 'react';
import { User, Mail, Lock, Phone, UserPlus, Eye, EyeOff, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function RegisterPage({ onNavigate }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result?.success) {
      onNavigate('home');
    } else {
      setError(result?.message || 'Erreur lors de l\'inscription.');
    }
  };

  const fields = [
    { name: 'name', label: 'Nom complet', type: 'text', placeholder: 'Mohammed Alami', icon: User },
    { name: 'email', label: 'Adresse email', type: 'email', placeholder: 'votre@email.com', icon: Mail },
    { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6XX XX XX XX', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2">
            <Car size={32} className="text-red-500" />
            <span className="text-3xl font-bold font-playfair text-white">LUX<span className="text-red-500">CAR</span></span>
          </button>
          <p className="text-gray-400 mt-2">Créez votre compte client</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6 font-playfair">Inscription</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                  <Icon className="absolute left-3 top-3.5 text-gray-500" size={18} />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Répétez le mot de passe"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{' '}
            <button onClick={() => onNavigate('login')} className="text-red-400 hover:text-red-300 font-medium transition">
              Se connecter
            </button>
          </p>
        </div>

        <p className="text-center mt-4">
          <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-gray-400 text-sm transition">
            ← Retour à l'accueil
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
