'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaIcon } from '../common/Icon';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqItems = [
    {
      q: "Comment fonctionne QResto pour mon restaurant ?",
      a: "QResto vous permet de créer votre menu digital en quelques clics. Vous obtenez un lien web unique et des QR codes à disposer sur vos tables. Vos clients scannent le QR code avec leur smartphone pour consulter la carte, visualiser les plats en 3D et commander directement en cuisine ou en livraison, sans avoir à télécharger d'application."
    },
    {
      q: "Ai-je besoin d'une application à installer ?",
      a: "Non, aucune application n'est nécessaire ni pour vous, ni pour vos clients ! QResto fonctionne directement dans le navigateur mobile (Chrome, Safari, etc.) sur n'importe quel smartphone (Android, iPhone), garantissant un accès instantané en moins de 2 secondes."
    },
    {
      q: "Comment mes clients paient-ils ?",
      a: "Vos clients peuvent régler selon vos préférences : par MTN Mobile Money, Moov Money, carte bancaire ou directement en espèces lors du service à table ou à la livraison."
    },
    {
      q: "Puis-je modifier mon menu à tout moment ?",
      a: "Oui, absolument. Depuis votre tableau de bord restaurant, vous pouvez ajouter ou retirer un plat, modifier un prix, marquer un plat en rupture ou activer une promotion en temps réel. Les QR codes déjà imprimés sur vos tables restent valables et se mettent à jour instantanément."
    },
    {
      q: "Combien ça coûte ?",
      a: "Nous proposons une formule Starter Gratuite pour démarrer en toute sérénité, puis une formule Pro à 5 000 FCFA / mois et Business à 8 000 FCFA / mois avec fonctionnalités avancées (analytics en direct, visualisation 3D, multi-établissements) sans aucun engagement."
    },
    {
      q: "Mes clients ont-ils besoin de créer un compte ?",
      a: "Non, les clients n'ont aucun compte à créer. Ils s'installent à table, scannent, choisissent leurs plats et commandent. C'est simple, rapide et sans friction."
    }
  ];

  return (
    <div className="w-full bg-white overflow-hidden text-stone-900">
      {/* 1. HERO SECTION (Screenshot 1) */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50/70 via-white to-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-6 shadow-xs animate-fade-in-up">
            <span className="text-amber-600">📍</span>
            <span>La digitalisation des restaurants au Bénin</span>
          </div>

          {/* Centered Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight leading-[1.15] mb-6 text-center animate-fade-in-up">
            Découvrez. Commandez.<br />
            <span className="text-amber-500">Savourez.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-stone-600 font-normal max-w-2xl mx-auto leading-relaxed mb-8 text-center animate-fade-in-up">
            QResto connecte les restaurants et clients via une expérience digitale moderne, fluide et innovante.
          </p>

          {/* 3 Centered CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14 animate-fade-in-up">
            {/* Button 1: Trouver un restaurant */}
            <button
              type="button"
              onClick={() => navigateTo('restaurants')}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Trouver un restaurant</span>
              <FaIcon name="fa-solid fa-arrow-right" className="text-xs" />
            </button>

            {/* Button 2: Suivre une commande */}
            <button
              type="button"
              onClick={() => navigateTo('order-tracking')}
              className="px-5 sm:px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 font-bold text-sm border border-stone-200 shadow-xs transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            >
              <FaIcon name="fa-solid fa-box" className="text-stone-700 text-xs" />
              <span>Suivre une commande</span>
            </button>

            {/* Button 3: Créer mon restaurant */}
            <button
              type="button"
              onClick={() => navigateTo('register-restaurant')}
              className="px-4 py-3.5 text-stone-700 hover:text-stone-950 font-bold text-sm transition-colors"
            >
              Créer mon restaurant
            </button>
          </div>

          {/* 5 Process Steps Horizontal Flow */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 pt-4">
            {/* Step 1 */}
            <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left relative flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-3.5 group-hover:scale-110 transition-transform">
                  <FaIcon name="fa-solid fa-magnifying-glass" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Recherche</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Trouvez un restaurant ou un plat près de vous.
                </p>
              </div>
              <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs pointer-events-none z-10">
                →
              </div>
            </div>

            {/* Step 2 */}
            <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left relative flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-3.5 group-hover:scale-110 transition-transform">
                  <FaIcon name="fa-solid fa-utensils" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Menu digital</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Parcourez le menu interactif du restaurant.
                </p>
              </div>
              <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs pointer-events-none z-10">
                →
              </div>
            </div>

            {/* Step 3 */}
            <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left relative flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-3.5 group-hover:scale-110 transition-transform">
                  <FaIcon name="fa-solid fa-cube" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Visualisation 3D</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Admirez vos plats en 3D avant de commander.
                </p>
              </div>
              <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs pointer-events-none z-10">
                →
              </div>
            </div>

            {/* Step 4 */}
            <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left relative flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-3.5 group-hover:scale-110 transition-transform">
                  <FaIcon name="fa-solid fa-bag-shopping" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Commande</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Ajoutez au panier et commandez en quelques clics.
                </p>
              </div>
              <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs pointer-events-none z-10">
                →
              </div>
            </div>

            {/* Step 5 */}
            <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-3.5 group-hover:scale-110 transition-transform">
                  <FaIcon name="fa-solid fa-motorcycle" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Livraison</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Suivez votre commande en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIGITIZE FEATURES SECTION (Screenshot 2) */}
      <section className="py-20 md:py-28 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Tout ce qu'il faut pour digitaliser votre restaurant
          </h2>
          <p className="text-base sm:text-lg text-stone-500 max-w-2xl mx-auto mb-14">
            Une plateforme complète, pensée pour les restaurateurs africains.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1: QR Code table */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform">
                <FaIcon name="fa-solid fa-qrcode" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">QR Code table</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Vos clients scannent, voient le menu et commandent depuis leur téléphone.
              </p>
            </div>

            {/* Card 2: Plats en 3D */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform">
                <FaIcon name="fa-solid fa-cube" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Plats en 3D</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Une expérience immersive unique sur les fiches produits.
              </p>
            </div>

            {/* Card 3: Gestion de menu */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform">
                <FaIcon name="fa-solid fa-utensils" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Gestion de menu</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Créez plats, catégories et menus en toute simplicité.
              </p>
            </div>

            {/* Card 4: Analytics temps réel */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform">
                <FaIcon name="fa-solid fa-wand-magic-sparkles" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Analytics temps réel</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Suivez votre chiffre d'affaires et vos plats populaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MOSAIC PHOTO GALLERY (Screenshot 3) */}
      <section className="py-16 md:py-24 bg-stone-50/50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-3">
            Une expérience qui donne faim
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto mb-12">
            Des plats sublimés, des restaurants accueillants — découvrez l'univers QResto en images.
          </p>

          {/* Bento grid layout matching Screenshot 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Large Vertical Photo */}
            <div className="md:col-span-6 rounded-3xl overflow-hidden shadow-sm relative group h-80 md:h-[500px] border border-stone-200 bg-stone-100">
              <img
                src="/src/assets/images/resto_ambiance_1790196207320.jpg"
                alt="Ambiance restaurant moderne"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-sm font-semibold">Ambiance chaleureuse & accueil soigné</p>
              </div>
            </div>

            {/* Right 2x2 Grid */}
            <div className="md:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              {/* Photo 1: Chicken */}
              <div className="rounded-3xl overflow-hidden shadow-sm relative group h-40 md:h-[238px] border border-stone-200 bg-stone-100">
                <img
                  src="/src/assets/images/poulet_braise_1790196218496.jpg"
                  alt="Poulet braisé croustillant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Photo 2: Pizza */}
              <div className="rounded-3xl overflow-hidden shadow-sm relative group h-40 md:h-[238px] border border-stone-200 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                  alt="Pizza artisanale au feu de bois"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Photo 3: Fries */}
              <div className="rounded-3xl overflow-hidden shadow-sm relative group h-40 md:h-[238px] border border-stone-200 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80"
                  alt="Frites croustillantes dorées"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Photo 4: Fresh salad & Juice */}
              <div className="rounded-3xl overflow-hidden shadow-sm relative group h-40 md:h-[238px] border border-stone-200 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
                  alt="Salade fraîche et jus d'orange pressé"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LOCAL GASTRONOMY SECTION (Screenshot 4) */}
      <section className="py-20 md:py-28 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-3">
            Une cuisine 100% locale
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto mb-14">
            Du wagashi au poulet braisé, QResto met en valeur la richesse de la gastronomie béninoise.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Category 1: Grillades & braisés */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/poulet_braise_1790196218496.jpg"
                  alt="Grillades et braisés"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-lg font-black text-white">Grillades & braisés</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Poulet braisé, poisson grillé, viandes au feu de bois
                </p>
              </div>
            </div>

            {/* Category 2: Plats traditionnels */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/wagashi_amiwo_1790196228866.jpg"
                  alt="Plats traditionnels béninois"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-lg font-black text-white">Plats traditionnels</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Wagashi, atassi, amiwo, et tous les classiques du Bénin
                </p>
              </div>
            </div>

            {/* Category 3: Street-food & snacks (Fixed with authentic image!) */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/akara_streetfood_1790196240482.jpg"
                  alt="Street-food & snacks"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-lg font-black text-white">Street-food & snacks</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Atassi, akara, beignets et douceurs locales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION (Screenshot 5) */}
      <section className="py-20 md:py-28 bg-stone-50/60 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-3">
            Ils digitalisent déjà avec QResto
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto mb-14">
            Des restaurateurs africains qui ont transformé leur quotidien.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-3xl font-serif font-black leading-none block mb-3">”</span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  "Depuis QResto, mes clients consultent le menu sur leur téléphone et commandent sans attendre un serveur. Mon chiffre d'affaires a augmenté de 30%."
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <img
                    src="/src/assets/images/chef_avatar_aicha_1790196251027.jpg"
                    alt="Aïcha Diallo"
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Aïcha Diallo</h4>
                    <p className="text-[11px] text-stone-400">Le Baobab Gourmand, Cotonou</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-3xl font-serif font-black leading-none block mb-3">”</span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  "Le QR code sur les tables a tout changé. Les clients adorent voir les plats en 3D avant de commander. Vraiment moderne."
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                    KA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Koffi Adjahi</h4>
                    <p className="text-[11px] text-stone-400">Chez Mama Adjoa, Porto-Novo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-3xl font-serif font-black leading-none block mb-3">”</span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  "Je gère mon menu, mes commandes et mes livraisons depuis un seul tableau de bord. Simple, rapide, efficace."
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs shrink-0">
                    FA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Fatou Akotègnon</h4>
                    <p className="text-[11px] text-stone-400">Saveurs du Terroir, Parakou</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-3xl font-serif font-black leading-none block mb-3">”</span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  "La digitalisation de mon menu s'est faite en 10 minutes. Je partage le lien partout sur mes réseaux sociaux."
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-stone-300">★</span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-800 font-bold flex items-center justify-center text-xs shrink-0">
                    IT
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Ibrahim Touré</h4>
                    <p className="text-[11px] text-stone-400">Wagashi Express, Abomey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Screenshot 6) */}
      <section className="py-20 md:py-28 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-4">
            <span>✨</span>
            <span>Questions fréquentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-3">
            Tout ce que vous voulez savoir
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-xl mx-auto mb-12">
            Une question avant de vous lancer ? On a sûrement la réponse.
          </p>

          {/* Accordion list */}
          <div className="space-y-3 text-left mb-12">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:border-stone-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-sm sm:text-base font-bold text-stone-900">
                      {item.q}
                    </span>
                    <FaIcon
                      name="fa-solid fa-chevron-down"
                      className={`text-stone-400 text-xs transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50 animate-fade-in-up">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Prompt & Button */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-stone-500 mb-3">Prêt à digitaliser votre restaurant ?</p>
            <button
              type="button"
              onClick={() => navigateTo('register-restaurant')}
              className="px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Créer mon restaurant gratuitement</span>
              <FaIcon name="fa-solid fa-arrow-right" className="text-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. STATS & DARK CTA BANNER (Screenshot 7) */}
      <section className="py-16 md:py-24 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 4 Stat Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-500 mb-1">500+</h3>
              <p className="text-xs text-stone-500 font-medium">Restaurants</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-500 mb-1">50K+</h3>
              <p className="text-xs text-stone-500 font-medium">Commandes / mois</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-500 mb-1">12</h3>
              <p className="text-xs text-stone-500 font-medium">Villes couvertes</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-500 mb-1">98%</h3>
              <p className="text-xs text-stone-500 font-medium">Satisfaction</p>
            </div>
          </div>

          {/* Dark CTA Banner */}
          <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 md:p-16 text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
                Prêt à rejoindre QResto ?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mb-8 max-w-md mx-auto leading-relaxed">
                Digitalisez votre restaurant et recevez vos commandes en quelques minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('register-restaurant')}
                  className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02]"
                >
                  Créer mon restaurant
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('restaurants')}
                  className="px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm border border-stone-700 transition-all duration-200 hover:scale-[1.02]"
                >
                  Explorer les restaurants
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
