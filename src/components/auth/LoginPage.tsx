'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Utensils,
  LogIn,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Store,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
    <div className="min-h-screen bg-[#fbf9f5] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xl"
      >
        <div className="text-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('landing')}
            className="inline-flex items-center gap-2 cursor-pointer mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400 flex items-center justify-center text-stone-950 font-black text-xl shadow-md shadow-amber-500/25">
              Q
            </div>
          </motion.button>
          <h2 className="text-2xl font-black text-stone-950 tracking-tight font-display">
            Espace Restaurateur
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
            Connectez-vous pour gérer votre menu digital, vos commandes en temps réel et vos QR codes par table.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Adresse Email professionnelle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@chezmama.bj"
                className="w-full pl-10 pr-4 py-3 bg-stone-50/90 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-50/90 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>Se connecter à mon Dashboard</span>
          </motion.button>
        </form>

        {/* Quick Demo Logins for Fast Evaluation */}
        <div className="pt-4 border-t border-stone-100 text-left">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Accès démo 1-clic pour tester
            </p>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('owner@chezmama.bj', 'password123')}
              className="p-3 rounded-2xl bg-stone-100 hover:bg-amber-50 hover:border-amber-200 border border-transparent text-stone-800 text-xs font-semibold transition-all text-left cursor-pointer"
            >
              <div className="font-bold text-stone-900 truncate">Chez Mama Bénin</div>
              <div className="text-[10px] text-stone-500 mt-0.5">owner@chezmama.bj</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('contact@jardin-fidjrosse.bj', 'password123')}
              className="p-3 rounded-2xl bg-stone-100 hover:bg-amber-50 hover:border-amber-200 border border-transparent text-stone-800 text-xs font-semibold transition-all text-left cursor-pointer"
            >
              <div className="font-bold text-stone-900 truncate">Le Jardin Fidjrossè</div>
              <div className="text-[10px] text-stone-500 mt-0.5">contact@jardin...</div>
            </button>
          </div>
        </div>

        {/* Link to Registration */}
        <div className="text-center pt-1">
          <p className="text-xs text-stone-600">
            Vous n’avez pas encore digitalisé votre établissement ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('register-restaurant')}
              className="font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Créer mon restaurant
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
