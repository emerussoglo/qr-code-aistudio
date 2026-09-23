import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../lib/storage';
import { FaIcon } from '../common/Icon';
import { Dish3DViewer } from '../3d/Dish3DViewer';
import { Dish } from '../../types';

export const RestaurantDetailPage: React.FC = () => {
  const { viewParams, navigateTo, addToCart, cartCount, showToast } = useApp();
  const slug = viewParams.slug || 'chez-mama-benin';
  const tableParam = viewParams.table; // e.g. "4" if scanned from table QR

  const restaurant = storage.getRestaurantBySlug(slug) || storage.getRestaurants()[0];
  const categories = storage.getCategories(restaurant?.id);
  const dishes = storage.getDishes(restaurant?.id);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [active3DDish, setActive3DDish] = useState<Dish | null>(null);

  const filteredDishes = useMemo(() => {
    if (activeCategoryId === 'all') return dishes;
    return dishes.filter((d) => d.categoryId === activeCategoryId);
  }, [dishes, activeCategoryId]);

  const handleShareMenu = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Lien du menu copié ! Partagez-le avec vos amis.', 'success');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Regarde le menu digital de ${restaurant.name} sur QResto : ${window.location.origin}/?slug=${restaurant.slug}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!restaurant) {
    return (
      <div className="py-20 text-center">
        <p className="text-stone-500">Restaurant non trouvé.</p>
        <button
          onClick={() => navigateTo('restaurants')}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
        >
          Retour aux restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* 1. HERO COVER & RESTAURANT BANNER */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-stone-900 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            onClick={() => navigateTo('restaurants')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-semibold transition-all border border-white/10"
          >
            <FaIcon name="fa-solid fa-arrow-left" />
            <span>Tous les restaurants</span>
          </button>
        </div>

        {/* Action icons (Share & WhatsApp) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            title="Partager sur WhatsApp"
          >
            <FaIcon name="fa-brands fa-whatsapp" className="text-sm" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShareMenu}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10 transition-all"
            title="Copier le lien"
          >
            <FaIcon name="fa-solid fa-share-nodes" />
          </button>
        </div>

        {/* Restaurant Header Information */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
            />
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {restaurant.name}
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-white text-[11px] font-bold">
                  ● Ouvert
                </span>
              </div>
              <p className="text-amber-300 text-xs sm:text-sm font-semibold mb-1">
                {restaurant.category}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <FaIcon name="fa-solid fa-location-dot" className="text-amber-400" />
                  {restaurant.address}, {restaurant.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaIcon name="fa-solid fa-phone" className="text-amber-400" />
                  {restaurant.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Rating and delivery card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white shrink-0">
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
              <FaIcon name="fa-solid fa-star" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-xs text-stone-300 font-normal">({restaurant.reviewCount} avis)</span>
            </div>
            <div className="text-xs text-stone-300">
              Frais livraison : <strong>{restaurant.deliveryFee.toLocaleString()} FCFA</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DINE-IN TABLE ALERT BANNER (If scanned via Table QR code) */}
      {tableParam && (
        <div className="bg-amber-500 text-stone-950 font-bold py-3.5 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center shrink-0">
                <FaIcon name="fa-solid fa-qrcode" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-extrabold">
                  Bienvenue à la Table {tableParam} !
                </p>
                <p className="text-xs text-stone-900/80 font-medium">
                  Vos commandes seront automatiquement enregistrées et servies directement à votre table.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-stone-950 text-white rounded-full text-xs font-extrabold uppercase">
              Table {tableParam}
            </span>
          </div>
        </div>
      )}

      {/* 3. MENU CATEGORIES TABS */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryId === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Tous les plats ({dishes.length})
          </button>

          {categories.map((cat) => {
            const count = dishes.filter((d) => d.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategoryId === cat.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DISHES LIST / GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Dish Photo */}
                <div className="relative h-48 overflow-hidden bg-stone-100 group">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 3D Model Badge (Click to open 3D interactive viewer) */}
                  {dish.has3DModel && (
                    <button
                      type="button"
                      onClick={() => setActive3DDish(dish)}
                      className="absolute top-3 left-3 px-3 py-1.5 bg-stone-900/90 hover:bg-stone-950 backdrop-blur-md rounded-full text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 shadow-lg transition-transform hover:scale-105"
                    >
                      <FaIcon name="fa-solid fa-cube" className="animate-spin" />
                      <span>Vue 3D 360°</span>
                    </button>
                  )}

                  {dish.isPopular && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-full shadow">
                      ★ Populaire
                    </div>
                  )}
                </div>

                {/* Dish Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {dish.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaIcon name="fa-solid fa-stopwatch" />
                      <span>~{dish.preparationTimeMin} min</span>
                    </span>
                    {dish.allergens.length > 0 && (
                      <span className="truncate">Allergènes : {dish.allergens.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart button */}
              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-stone-900">
                    {dish.price.toLocaleString()} FCFA
                  </span>
                  {dish.originalPrice && (
                    <span className="block text-xs text-stone-400 line-through">
                      {dish.originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {dish.has3DModel && (
                    <button
                      type="button"
                      onClick={() => setActive3DDish(dish)}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
                      title="Inspecter en 3D"
                    >
                      <FaIcon name="fa-solid fa-cube" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => addToCart(dish, 1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                  >
                    <FaIcon name="fa-solid fa-plus" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FLOATING CART BAR ON MOBILE */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => navigateTo('cart', { table: tableParam })}
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 text-white font-extrabold text-sm shadow-2xl flex items-center justify-between border border-amber-500/50 hover:bg-black transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                {cartCount}
              </span>
              <span>Voir mon panier</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span>Commander</span>
              <FaIcon name="fa-solid fa-arrow-right" />
            </div>
          </button>
        </div>
      )}

      {/* 6. MODAL 3D DISH VIEWER */}
      {active3DDish && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 relative text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActive3DDish(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-sm transition-colors"
            >
              <FaIcon name="fa-solid fa-xmark" />
            </button>

            <div className="mb-4">
              <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
                Visualisation 3D Interactive
              </div>
              <h3 className="text-xl font-extrabold text-white">{active3DDish.name}</h3>
              <p className="text-xs text-stone-400">{active3DDish.description}</p>
            </div>

            {/* 3D Canvas */}
            <Dish3DViewer
              modelType={active3DDish.model3DType || 'poulet_braise'}
              dishName={active3DDish.name}
            />

            <div className="mt-5 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-amber-400">
                  {active3DDish.price.toLocaleString()} FCFA
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(active3DDish, 1);
                  setActive3DDish(null);
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <FaIcon name="fa-solid fa-bag-shopping" />
                <span>Ajouter ce plat au panier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
