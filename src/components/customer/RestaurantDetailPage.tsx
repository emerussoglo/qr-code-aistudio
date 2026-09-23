'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Star,
  MapPin,
  Phone,
  QrCode,
  Clock,
  Plus,
  ShoppingBag,
  X,
  RotateCw,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../lib/storage';
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
    const text = encodeURIComponent(
      `Regarde le menu digital de ${restaurant?.name || 'ce restaurant'} sur QResto : ${window.location.origin}/#menu-${restaurant?.slug || slug}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!restaurant) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-500 mb-4">Restaurant non trouvé.</p>
        <button
          onClick={() => navigateTo('restaurants')}
          className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
        >
          Retour aux restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] pb-28">
      {/* 1. HERO COVER & RESTAURANT BANNER */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-stone-950 overflow-hidden">
        <img
          src={restaurant.coverImage || '/images/resto_ambiance_1790196207320.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('restaurants')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tous les restaurants</span>
          </motion.button>
        </div>

        {/* Action icons (Share & WhatsApp) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Partager sur WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </motion.button>

          <button
            type="button"
            onClick={handleShareMenu}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
            title="Copier le lien"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Restaurant Header Information */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={restaurant.logo || '/images/resto_ambiance_1790196207320.jpg'}
              alt={restaurant.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-2xl bg-white shrink-0"
            />
            <div className="text-white text-left">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-display">
                  {restaurant.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                  ● Ouvert
                </span>
              </div>
              <p className="text-amber-300 text-xs sm:text-sm font-semibold mb-1">
                {restaurant.category} · {restaurant.cuisineType || 'Spécialités Africaines'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {restaurant.address}, {restaurant.city}
                  </span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{restaurant.phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Rating and delivery card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white shrink-0 text-left sm:text-right">
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-xs text-stone-300 font-normal">
                ({restaurant.reviewCount || 140} avis)
              </span>
            </div>
            <div className="text-xs text-stone-300 font-medium">
              Frais livraison :{' '}
              <strong className="text-white">{restaurant.deliveryFee.toLocaleString()} FCFA</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DINE-IN TABLE ALERT BANNER (If scanned via Table QR code) */}
      {tableParam && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold py-3.5 px-4 shadow-md"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm sm:text-base font-extrabold leading-tight">
                  Bienvenue à la Table #{tableParam} !
                </p>
                <p className="text-xs text-stone-900/80 font-medium">
                  Votre commande sera transmise directement en cuisine et servie à cette table.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-stone-950 text-white rounded-full text-xs font-black uppercase tracking-wider">
              Table #{tableParam}
            </span>
          </div>
        </motion.div>
      )}

      {/* 3. MENU CATEGORIES TABS */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-stone-200/80 py-3.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/70'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryId === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/70'
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
          {filteredDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Dish Photo */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />

                  {/* 3D Model Badge */}
                  {dish.has3DModel && (
                    <button
                      type="button"
                      onClick={() => setActive3DDish(dish)}
                      className="absolute top-3 left-3 px-3 py-1.5 bg-stone-950/85 hover:bg-black backdrop-blur-md rounded-xl text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Vue 3D 360°</span>
                    </button>
                  )}

                  {dish.isPopular && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-stone-950 text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>Populaire</span>
                    </div>
                  )}
                </div>

                {/* Dish Info */}
                <div className="p-5 text-left">
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 leading-snug mb-1 font-display group-hover:text-amber-700 transition-colors">
                    {dish.name}
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2 font-normal">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>~{dish.preparationTimeMin || 15} min</span>
                    </span>
                    {dish.allergens && dish.allergens.length > 0 && (
                      <span className="truncate">Allergènes : {dish.allergens.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart button */}
              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-lg font-black text-stone-950 font-display">
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
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                      title="Inspecter en 3D"
                    >
                      <RotateCw className="w-4 h-4 text-amber-700" />
                    </button>
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(dish, 1);
                      showToast(`"${dish.name}" ajouté à votre panier !`, 'success');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. FLOATING CART BAR ON MOBILE */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo('cart', { table: tableParam })}
              className="w-full py-4 px-6 rounded-2xl bg-stone-950 text-white font-black text-sm shadow-2xl flex items-center justify-between border border-amber-500/50 hover:bg-black transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-black text-xs">
                  {cartCount}
                </span>
                <span>Voir mon panier</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>Commander</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MODAL 3D DISH VIEWER */}
      <AnimatePresence>
        {active3DDish && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative text-white shadow-2xl text-left"
            >
              <button
                type="button"
                onClick={() => setActive3DDish(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Visualisation 3D Interactive</span>
                </div>
                <h3 className="text-2xl font-black text-white font-display mb-1">
                  {active3DDish.name}
                </h3>
                <p className="text-xs text-stone-400">{active3DDish.description}</p>
              </div>

              {/* 3D Canvas */}
              <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 mb-5">
                <Dish3DViewer
                  modelType={active3DDish.model3DType || 'poulet_braise'}
                  dishName={active3DDish.name}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                <div>
                  <span className="text-2xl font-black text-amber-400 font-display">
                    {active3DDish.price.toLocaleString()} FCFA
                  </span>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    addToCart(active3DDish, 1);
                    showToast(`"${active3DDish.name}" ajouté à votre commande !`, 'success');
                    setActive3DDish(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
