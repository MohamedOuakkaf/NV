import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginPage({ onNavigate }) {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result?.success) {
      onNavigate(result.role === 'admin' ? 'admin' : 'home');
    } else {
      setError(result?.message || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition">
            <Car size={32} />
            <span className="text-3xl font-bold font-playfair text-white">LUX<span className="text-red-500">CAR</span></span>
          </button>
          <p className="text-gray-400 mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6 font-playfair">Connexion</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Adresse email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Pas encore de compte ?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-red-400 hover:text-red-300 font-medium transition"
            >
              S'inscrire
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-400 mb-1">Comptes de démonstration :</p>
          <p>👤 Admin : <span className="text-gray-300">admin@carrental.com</span> / <span className="text-gray-300">Admin@123456</span></p>
          <p>🧑 Client : <span className="text-gray-300">client@test.com</span> / <span className="text-gray-300">client123</span></p>
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

export default LoginPage;
