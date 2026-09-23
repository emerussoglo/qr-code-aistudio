'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaIcon } from './Icon';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    currentUser,
    currentRestaurant,
    cartCount,
    logout,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('restaurants', { search: searchQuery.trim() });
    } else {
      navigateTo('restaurants');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Brand Logo - EXACT as Screenshot 1 */}
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-1 cursor-pointer select-none shrink-0 group focus:outline-hidden"
          >
            <span className="text-2xl sm:text-[26px] font-black tracking-tight text-stone-900 transition-transform group-hover:scale-[1.02]">
              Q<span className="text-amber-500">Resto</span>
            </span>
          </button>

          {/* Central Search Bar - EXACT as Screenshot 1 */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <FaIcon name="fa-solid fa-magnifying-glass" className="text-xs" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un restaurant ou un plat..."
                className="w-full pl-9 pr-4 py-2 bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-xs sm:text-sm text-stone-900 rounded-full border border-transparent focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all outline-hidden placeholder:text-stone-400 font-normal"
              />
            </form>
          </div>

          {/* Right Navigation Links & Action Button - EXACT as Screenshot 1 */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => navigateTo('restaurants')}
              className={`hidden sm:inline-block text-xs sm:text-sm font-semibold transition-colors ${
                currentView === 'restaurants'
                  ? 'text-amber-600 font-bold'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Restaurants
            </button>

            <button
              type="button"
              onClick={() => navigateTo('restaurants', { filter: 'nearby' })}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors"
            >
              À proximité
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-transform hover:scale-105"
              title="Mon panier"
            >
              <FaIcon name="fa-solid fa-bag-shopping" className="text-base sm:text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Connexion or Profile Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.firstName?.[0] || 'M'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {currentRestaurant?.name || currentUser.firstName}
                  </span>
                  <FaIcon name="fa-solid fa-chevron-down" className="text-[10px] text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                    </div>
                    {currentRestaurant && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigateTo('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
                      >
                        <FaIcon name="fa-solid fa-table-columns" className="text-amber-500" />
                        <span>Mon Dashboard Restaurant</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateTo('order-tracking');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <FaIcon name="fa-solid fa-route" className="text-stone-400" />
                      <span>Suivre une commande</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100 mt-1"
                    >
                      <FaIcon name="fa-solid fa-arrow-right-from-bracket" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02]"
              >
                Connexion
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900"
            >
              <FaIcon name={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Mobile Search and Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-3 animate-fade-in-up">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher restaurant ou plat..."
                className="w-full pl-9 pr-4 py-2 bg-stone-100 text-xs rounded-full border border-stone-200 outline-hidden"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <FaIcon name="fa-solid fa-magnifying-glass" className="text-xs" />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('restaurants');
                }}
                className="p-2 text-xs font-bold text-center bg-stone-100 rounded-xl text-stone-800"
              >
                Tous les restaurants
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('order-tracking');
                }}
                className="p-2 text-xs font-bold text-center bg-amber-50 text-amber-900 rounded-xl"
              >
                Suivre une commande
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
