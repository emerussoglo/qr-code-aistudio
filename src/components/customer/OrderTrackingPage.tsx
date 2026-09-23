'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../lib/storage';
import { FaIcon } from '../common/Icon';
import { Order, OrderStatus } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const {
    viewParams,
    trackingCodeInput,
    setTrackingCodeInput,
    searchTrackedOrder,
    trackedOrder,
    refreshTrackedOrder,
    navigateTo,
  } = useApp();

  const [searchInput, setSearchInput] = useState<string>(
    viewParams.trackingCode || trackingCodeInput || ''
  );
  const [currentOrder, setCurrentOrder] = useState<Order | null>(trackedOrder);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Initial lookup if tracking code was passed in viewParams or app state
  useEffect(() => {
    const code = viewParams.trackingCode || trackingCodeInput;
    if (code) {
      const found = storage.getOrderByTrackingCode(code);
      if (found) {
        setCurrentOrder(found);
      }
    }
  }, [viewParams.trackingCode, trackingCodeInput]);

  // Polling effect every 4 seconds to catch kitchen updates in real time
  useEffect(() => {
    if (!currentOrder || !autoRefresh) return;
    const interval = setInterval(() => {
      const updated = storage.getOrderByTrackingCode(currentOrder.trackingCode);
      if (updated && updated.status !== currentOrder.status) {
        setCurrentOrder(updated);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentOrder, autoRefresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = searchTrackedOrder(searchInput);
    if (found) {
      setCurrentOrder(found);
    }
  };

  const handleManualRefresh = () => {
    if (!currentOrder) return;
    refreshTrackedOrder();
    const updated = storage.getOrderByTrackingCode(currentOrder.trackingCode);
    if (updated) {
      setCurrentOrder(updated);
    }
  };

  // Steps definition for timeline
  const steps: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
    { status: 'NEW', label: 'Commande Reçue', icon: 'fa-solid fa-receipt', desc: 'Enregistrée sur le terminal du restaurant' },
    { status: 'CONFIRMED', label: 'Confirmée', icon: 'fa-solid fa-circle-check', desc: 'Validée par l\'équipe' },
    { status: 'PREPARING', label: 'En Préparation', icon: 'fa-solid fa-fire-burner', desc: 'Cuisson et dressage en cuisine' },
    { status: 'READY', label: 'Commande Prête', icon: 'fa-solid fa-bell-concierge', desc: 'Votre plat est prêt et chaud !' },
    { status: 'OUT_FOR_DELIVERY', label: 'En Livraison / Service', icon: 'fa-solid fa-motorcycle', desc: 'Le coursier est en route' },
    { status: 'DELIVERED', label: 'Livrée / Servie', icon: 'fa-solid fa-utensils', desc: 'Bon appétit !' },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'NEW':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* 1. Header & Tracking Code Input Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl mx-auto mb-4">
          <FaIcon name="fa-solid fa-route" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
          Suivi de Commande en Direct
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
          Saisissez votre code de suivi (ex : <strong>QR-7842</strong> ou <strong>QR-9310</strong>) pour connaître en direct l'état de votre commande.
        </p>

        {/* Search Session Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <FaIcon name="fa-solid fa-ticket" />
            </div>
            <input
              type="text"
              required
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Code de suivi (ex: QR-7842)"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <FaIcon name="fa-solid fa-magnifying-glass" />
            <span>Rechercher</span>
          </button>
        </form>

        {/* Quick Demo Codes */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-400">
          <span>Codes de démonstration :</span>
          <button
            type="button"
            onClick={() => {
              setSearchInput('QR-7842');
              const found = searchTrackedOrder('QR-7842');
              if (found) setCurrentOrder(found);
            }}
            className="font-mono font-bold text-amber-600 hover:underline bg-amber-50 px-2 py-0.5 rounded"
          >
            QR-7842 (En préparation)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchInput('QR-9310');
              const found = searchTrackedOrder('QR-9310');
              if (found) setCurrentOrder(found);
            }}
            className="font-mono font-bold text-amber-600 hover:underline bg-amber-50 px-2 py-0.5 rounded"
          >
            QR-9310 (Prête !)
          </button>
        </div>
      </div>

      {/* 2. Order Tracking Timeline & Details */}
      {currentOrder ? (
        <div className="space-y-6">
          {/* Status Alert Banner */}
          {currentOrder.status === 'READY' && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between gap-4 animate-bounce-subtle">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                  🎉
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Votre commande est prête !</h3>
                  <p className="text-xs text-white/90">
                    {currentOrder.type === 'DINE_IN'
                      ? `Le serveur vous apporte vos plats à la Table ${currentOrder.tableNumber || ''}.`
                      : currentOrder.type === 'DELIVERY'
                      ? 'Le plat est emballé, notre livreur est prêt à partir.'
                      : 'Vous pouvez vous présenter au comptoir pour récupérer votre commande.'}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white text-emerald-800 rounded-full text-xs font-black uppercase">
                Prêt
              </span>
            </div>
          )}

          {currentOrder.status === 'CANCELLED' && (
            <div className="p-5 rounded-3xl bg-red-600 text-white shadow-lg flex items-center gap-3">
              <FaIcon name="fa-solid fa-ban" className="text-2xl" />
              <div>
                <h3 className="text-lg font-bold">Commande annulée</h3>
                <p className="text-xs text-white/90">Cette commande a été annulée par le restaurant.</p>
              </div>
            </div>
          )}

          {/* Timeline Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono font-extrabold text-sm border border-amber-300">
                    {currentOrder.trackingCode}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-stone-900 mt-2">
                  {currentOrder.restaurantName}
                </h2>
                <p className="text-xs text-stone-500">
                  {currentOrder.type === 'DINE_IN'
                    ? `🍽️ Consommation sur place • Table ${currentOrder.tableNumber || 'N/A'}`
                    : currentOrder.type === 'DELIVERY'
                    ? `🛵 Livraison à : ${currentOrder.customerAddress || 'Cotonou'}`
                    : '🛍️ Retrait sur place'}
                </p>
              </div>

              {/* Refresh control */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FaIcon name="fa-solid fa-rotate" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="py-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                  {steps.map((step, idx) => {
                    const isDone = currentStepIdx >= idx && currentOrder.status !== 'CANCELLED';
                    const isCurrent = currentStepIdx === idx && currentOrder.status !== 'CANCELLED';

                    return (
                      <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100 scale-110'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          <FaIcon name={step.icon} />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-600' : isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-stone-400 md:hidden">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status History Logs */}
            {currentOrder.statusHistory && currentOrder.statusHistory.length > 0 && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Historique de la commande
                </h4>
                <div className="space-y-1.5">
                  {currentOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{h.note || `Statut passé à : ${h.status}`}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Items Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
              Détail des plats commandés
            </h3>
            <div className="divide-y divide-stone-100 mb-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-stone-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-extrabold text-stone-900">
              <span>Total payé / à régler :</span>
              <span className="text-amber-600">{currentOrder.total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
          <FaIcon name="fa-solid fa-receipt" className="text-3xl text-stone-300 mb-2" />
          <p className="text-stone-500 text-sm">Entrez votre code ci-dessus pour afficher votre commande.</p>
        </div>
      )}
    </div>
  );
};
