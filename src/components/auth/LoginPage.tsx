import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaIcon } from '../common/Icon';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsLoading(true);
      await login(email, password);
      // On success, redirect directly to their dashboard
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setIsLoading(true);
      await login(demoEmail, demoPass);
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        <div className="text-center">
          <div
            onClick={() => navigateTo('landing')}
            className="inline-flex items-center gap-2 cursor-pointer mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-white shadow-md">
              <FaIcon name="fa-solid fa-utensils" className="text-xl" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Espace Restaurateur
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500">
            Connectez-vous pour gérer votre menu digital, vos commandes en temps réel et vos QR codes.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <FaIcon name="fa-solid fa-circle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Adresse Email professionnelle
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: contact@chezmama.bj"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Mot de passe
              </label>
              <span className="text-xs text-amber-600 hover:underline cursor-pointer">
                Mot de passe oublié ?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <FaIcon name="fa-solid fa-spinner" className="animate-spin" />
            ) : (
              <FaIcon name="fa-solid fa-arrow-right-to-bracket" />
            )}
            <span>Se connecter à mon Dashboard</span>
          </button>
        </form>

        {/* Quick Demo Logins for Fast Evaluation */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider text-center mb-3">
            Comptes de test pré-configurés
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('owner@chezmama.bj', 'password123')}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 text-xs font-semibold transition-all text-left"
            >
              <div className="font-bold">Chez Mama Bénin</div>
              <div className="text-[10px] text-stone-400">owner@chezmama.bj</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('contact@jardin-fidjrosse.bj', 'password123')}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 text-xs font-semibold transition-all text-left"
            >
              <div className="font-bold">Le Jardin Fidjrossè</div>
              <div className="text-[10px] text-stone-400">contact@jardin-fidjrosse.bj</div>
            </button>
          </div>
        </div>

        {/* Link to Registration */}
        <div className="text-center pt-2">
          <p className="text-xs text-stone-600">
            Vous n'avez pas encore digitalisé votre restaurant ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('register-restaurant')}
              className="font-bold text-amber-600 hover:underline"
            >
              Créer mon restaurant
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
