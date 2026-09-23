'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { storage } from '../../lib/storage';
import { FaIcon } from '../common/Icon';
import { OrderType, PaymentMethod } from '../../types';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartRestaurantId,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    navigateTo,
    viewParams,
  } = useApp();

  const restaurant = cartRestaurantId ? storage.getRestaurantById(cartRestaurantId) : null;
  const initialTable = viewParams.table || '';

  // Checkout Form State
  const [orderType, setOrderType] = useState<OrderType>(initialTable ? 'DINE_IN' : 'DELIVERY');
  const [tableNumber, setTableNumber] = useState<string>(initialTable ? String(initialTable) : '');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MTN_MOMO');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const deliveryFee = orderType === 'DELIVERY' && restaurant ? restaurant.deliveryFee : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setFormError('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }
    if (orderType === 'DELIVERY' && !customerAddress.trim()) {
      setFormError('Veuillez préciser votre adresse de livraison exacte.');
      return;
    }
    if (orderType === 'DINE_IN' && !tableNumber.trim()) {
      setFormError('Veuillez indiquer votre numéro de table en salle.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await placeOrder({
        type: orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
        customerName,
        customerPhone,
        customerAddress: orderType === 'DELIVERY' ? customerAddress : undefined,
        customerNotes,
        paymentMethod,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti errors
      }

      // Navigate to order tracking page
      navigateTo('order-tracking', { trackingCode: newOrder.trackingCode });
    } catch (err: any) {
      setFormError(err.message || 'Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mb-4">
          <FaIcon name="fa-solid fa-basket-shopping" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Votre panier est vide</h2>
        <p className="text-stone-500 text-sm max-w-sm mb-6">
          Découvrez les meilleurs restaurants de Cotonou et ajoutez vos spécialités préférées !
        </p>
        <button
          type="button"
          onClick={() => navigateTo('restaurants')}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
        >
          Explorer les restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Finaliser la commande</h1>
          {restaurant && (
            <p className="text-sm text-stone-500 mt-1">
              Commande auprès de : <strong className="text-stone-800">{restaurant.name}</strong> ({restaurant.city})
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Cart Items (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Articles sélectionnés ({cart.length})</span>
              <span className="text-xs font-semibold text-amber-600">
                {restaurant?.name}
              </span>
            </h3>

            <div className="divide-y divide-stone-100">
              {cart.map(({ dish, quantity }) => (
                <div key={dish.id} className="py-3.5 flex items-center gap-3">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{dish.name}</h4>
                    <p className="text-xs text-amber-600 font-semibold">
                      {(dish.price * quantity).toLocaleString()} FCFA
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(dish.id, -1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-stone-900 px-1">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(dish.id, 1)}
                        className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(dish.id)}
                    className="text-stone-400 hover:text-red-500 p-1 text-xs"
                    title="Supprimer"
                  >
                    <FaIcon name="fa-solid fa-trash-can" />
                  </button>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 mt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total plats</span>
                <span className="font-semibold">{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Frais de livraison</span>
                <span className="font-semibold">
                  {orderType === 'DELIVERY' ? `${deliveryFee.toLocaleString()} FCFA` : 'Gratuit (Sur place)'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total à régler</span>
                <span className="text-amber-600">{grandTotal.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Delivery Mode & Customer Details (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckout} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <FaIcon name="fa-solid fa-circle-exclamation" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Choose Order Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                1. Mode de consommation
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'DINE_IN', label: 'Sur place (Table)', icon: 'fa-solid fa-utensils' },
                  { id: 'DELIVERY', label: 'Livraison', icon: 'fa-solid fa-motorcycle' },
                  { id: 'PICKUP', label: 'À emporter', icon: 'fa-solid fa-bag-shopping' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setOrderType(mode.id as OrderType)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      orderType === mode.id
                        ? 'border-amber-500 bg-amber-50/50 text-amber-800 font-bold shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <FaIcon name={mode.icon} className={`text-base ${orderType === mode.id ? 'text-amber-600' : 'text-stone-400'}`} />
                    <span className="text-xs">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* If Dine In: Table Number */}
            {orderType === 'DINE_IN' && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Numéro de table en salle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 4, Table VIP, Pergola 2..."
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}

            {/* 2. Customer Information (No account needed!) */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                2. Vos coordonnées (Sans inscription)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kofi Mensah"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Téléphone béninois *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +229 97 00 11 22"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {orderType === 'DELIVERY' && (
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Adresse précise de livraison à Cotonou / Bénin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Quartier, Rue, Repère (Ex: Haie Vive, Rue 340 face pharmacie)"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Instructions pour la cuisine / livreur (Optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Piment à part, bien doré, sauce chaude..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                3. Mode de paiement
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'MTN_MOMO',
                    label: 'MTN MoMo',
                    desc: 'Paiement mobile instantané',
                    badge: 'Recommandé',
                    color: 'text-yellow-600 bg-yellow-50',
                  },
                  {
                    id: 'MOOV_MONEY',
                    label: 'Moov Money',
                    desc: 'Paiement mobile rapide',
                    color: 'text-blue-600 bg-blue-50',
                  },
                  {
                    id: 'CASH_ON_DELIVERY',
                    label: 'Espèces',
                    desc: 'À la livraison ou à table',
                    color: 'text-stone-700 bg-stone-100',
                  },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${pm.color}`}>
                        {pm.label}
                      </span>
                      {paymentMethod === pm.id && (
                        <FaIcon name="fa-solid fa-circle-check" className="text-amber-500 text-sm" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{pm.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaIcon name="fa-solid fa-spinner" className="animate-spin text-lg" />
                  <span>Validation de la commande en cours...</span>
                </>
              ) : (
                <>
                  <FaIcon name="fa-solid fa-lock" />
                  <span>Confirmer la commande ({grandTotal.toLocaleString()} FCFA)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center">
              🔒 Vous recevrez un code de suivi immédiat (ex: QR-7842) pour suivre l'avancement en temps réel.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
