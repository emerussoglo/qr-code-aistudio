import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../lib/storage';
import { FaIcon } from '../common/Icon';

export const RestaurantsPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const restaurants = storage.getRestaurants();

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Search matches name, description, category or city
      const matchSearch =
        !searchTerm.trim() ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCity = selectedCity === 'all' || r.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedCategory === 'all' || r.category.includes(selectedCategory);
      const matchOpen = !onlyOpen || r.isOpen;

      return matchSearch && matchCity && matchCategory && matchOpen;
    });
  }, [restaurants, searchTerm, selectedCity, selectedCategory, onlyOpen]);

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
          Restaurants & Menus Digitaux au Bénin
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Commandez vos plats favoris à table ou faites-vous livrer sans télécharger d'application.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm mb-10 space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
            <FaIcon name="fa-solid fa-magnifying-glass" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un restaurant, igname pilée, poisson braisé, amiwo..."
            className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 text-xs"
            >
              <FaIcon name="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* City pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">Ville :</span>
            {[
              { id: 'all', label: 'Toutes les villes' },
              { id: 'cotonou', label: 'Cotonou' },
              { id: 'porto-novo', label: 'Porto-Novo' },
              { id: 'abomey-calavi', label: 'Abomey-Calavi' },
            ].map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCity === city.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          {/* Toggle Open */}
          <button
            type="button"
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              onlyOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyOpen ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            <span>Ouverts actuellement</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} disponible{filteredRestaurants.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl mb-4">
            <FaIcon name="fa-solid fa-utensils" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Aucun restaurant trouvé</h3>
          <p className="text-stone-500 text-xs mb-6">
            Essayez de modifier votre recherche ou vos filtres pour découvrir nos établissements partenaires.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('all');
              setOnlyOpen(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigateTo('restaurant-detail', { slug: restaurant.slug })}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold shadow-md">
                    <FaIcon name="fa-solid fa-star" className="text-amber-500" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-stone-400 font-normal">({restaurant.reviewCount})</span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                      restaurant.isOpen ? 'bg-emerald-500 text-white' : 'bg-stone-800 text-stone-300'
                    }`}>
                      {restaurant.isOpen ? '● Ouvert' : 'Fermé'}
                    </span>
                  </div>

                  {/* Logo overlay on bottom left */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                    />
                    <div className="text-white">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/40 backdrop-blur-md">
                        📍 {restaurant.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors mb-1.5">
                    {restaurant.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold mb-2">
                    {restaurant.category}
                  </p>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <FaIcon name="fa-solid fa-motorcycle" className="text-stone-400" />
                      <span>Livraison : {restaurant.deliveryFee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaIcon name="fa-solid fa-clock" className="text-stone-400" />
                      <span className="truncate max-w-[120px]">{restaurant.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-stone-900 group-hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FaIcon name="fa-solid fa-book-open" />
                  <span>Voir le Menu Digital & Commander</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
