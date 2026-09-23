'use client';

import React, { useState } from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { storage } from '../../lib/storage';
import { FaIcon } from '../common/Icon';
import { QRCodeViewer } from '../qr/QRCodeViewer';
import { OrderStatus, Dish } from '../../types';

export const RestaurantDashboard: React.FC = () => {
  const {
    currentUser,
    currentRestaurant,
    dashboardTab,
    setDashboardTab,
    updateRestaurantStatus,
    navigateTo,
    logout,
    showToast,
  } = useApp();

  // Desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);
  const [demoModeWithData, setDemoModeWithData] = useState<boolean>(false);

  // Search input in topbar
  const [topSearch, setTopSearch] = useState('');

  // Modals state
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState<number>(3500);
  const [dishCategoryId, setDishCategoryId] = useState<string>('');
  const [dishPrepTime, setDishPrepTime] = useState<number>(20);
  const [dishImage, setDishImage] = useState<string>(
    '/src/assets/images/poulet_braise_1790196218496.jpg'
  );
  const [dishHas3D, setDishHas3D] = useState<boolean>(false);
  const [dish3DType, setDish3DType] = useState<any>('poulet_braise');

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableNumberInput, setTableNumberInput] = useState<string>('');
  const [tableNameInput, setTableNameInput] = useState<string>('');
  const [tableCapacityInput, setTableCapacityInput] = useState<number>(4);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState<string>('');

  const [activeQrTable, setActiveQrTable] = useState<any>(null);

  // If user is not associated with a restaurant or not logged in
  if (!currentUser || !currentRestaurant) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mb-4">
          <FaIcon name="fa-solid fa-lock" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Accès Restreint</h2>
        <p className="text-stone-500 text-sm max-w-sm mb-6">
          Vous devez être connecté avec un compte restaurateur pour accéder à ce tableau de bord.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('login')}
          className="px-6 py-3 rounded-full bg-stone-900 text-white font-bold text-sm shadow-md hover:bg-stone-800 transition-all"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const restaurantId = currentRestaurant.id;
  const allRestaurants = storage.getRestaurants();
  const rawOrders = storage.getOrders(restaurantId);
  const rawDishes = storage.getDishes(restaurantId);
  const rawCategories = storage.getCategories(restaurantId);
  const rawTables = storage.getTables(restaurantId);

  // If user toggles pristine 0-state (as in Screenshot 9) vs live data
  const orders = demoModeWithData ? rawOrders : [];
  const dishes = rawDishes;
  const categories = rawCategories;
  const tables = rawTables;

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const totalClientsCount = orders.length > 0 ? new Set(orders.map((o) => o.customerPhone || o.customerName)).size : 0;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'CONFIRMED' || o.status === 'PREPARING'
  ).length;

  // Public menu URL
  const publicMenuUrl = `https://qresto.africa/restaurants/${currentRestaurant.slug}`;
  const handleCopyMenuLink = () => {
    navigator.clipboard.writeText(publicMenuUrl);
    showToast('Lien public copié !', 'success');
  };

  // Nav items matching Screenshot 9
  const navItems: { id: DashboardTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: 'fa-solid fa-table-cells-large' },
    { id: 'orders', label: 'Commandes', icon: 'fa-solid fa-receipt', badge: pendingOrdersCount },
    { id: 'categories', label: 'Catégories', icon: 'fa-solid fa-tags' },
    { id: 'dishes', label: 'Plats', icon: 'fa-solid fa-utensils' },
    { id: 'tables', label: 'Tables', icon: 'fa-solid fa-border-all' },
    { id: 'qrcodes', label: 'QR Codes', icon: 'fa-solid fa-qrcode' },
    { id: 'restaurant', label: 'Restaurant', icon: 'fa-solid fa-store' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-simple' },
    { id: 'team', label: 'Équipe', icon: 'fa-solid fa-user-group' },
    { id: 'subscription', label: 'Abonnement', icon: 'fa-solid fa-credit-card' },
    { id: 'settings', label: 'Paramètres', icon: 'fa-solid fa-gear' },
  ];

  // Dish actions
  const openNewDishModal = () => {
    setEditingDish(null);
    setDishName('');
    setDishDesc('');
    setDishPrice(3500);
    setDishCategoryId(categories[0]?.id || '');
    setDishPrepTime(20);
    setDishHas3D(false);
    setDishImage('/src/assets/images/poulet_braise_1790196218496.jpg');
    setDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    const slug = dishName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    if (editingDish) {
      storage.updateDish(editingDish.id, {
        name: dishName,
        slug,
        description: dishDesc,
        price: Number(dishPrice),
        categoryId: dishCategoryId || categories[0]?.id || '',
        preparationTimeMin: Number(dishPrepTime),
        image: dishImage,
        has3DModel: dishHas3D,
        model3DType: dishHas3D ? dish3DType : undefined,
      });
      showToast('Plat modifié avec succès !', 'success');
    } else {
      storage.createDish({
        restaurantId,
        name: dishName,
        slug,
        description: dishDesc,
        price: Number(dishPrice),
        categoryId: dishCategoryId || categories[0]?.id || '',
        preparationTimeMin: Number(dishPrepTime),
        image: dishImage,
        isAvailable: true,
        allergens: [],
        has3DModel: dishHas3D,
        model3DType: dishHas3D ? dish3DType : undefined,
      });
      showToast('Nouveau plat ajouté au menu !', 'success');
    }
    setDishModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;
    storage.createCategory({
      restaurantId,
      name: categoryNameInput.trim(),
      order: categories.length + 1,
      active: true,
    });
    setCategoryNameInput('');
    setCategoryModalOpen(false);
    showToast('Nouvelle catégorie ajoutée !', 'success');
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumberInput) return;
    storage.createTable({
      restaurantId,
      number: tableNumberInput,
      name: tableNameInput || `Table ${tableNumberInput}`,
      capacity: Number(tableCapacityInput) || 4,
      active: true,
    });
    setTableNumberInput('');
    setTableNameInput('');
    setTableModalOpen(false);
    showToast(`Table ${tableNumberInput} créée !`, 'success');
  };

  // Status advance helper for Kanban orders
  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    storage.updateOrderStatus(orderId, nextStatus);
    showToast(`Commande passée en "${nextStatus}"`, 'success');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-stone-900 font-sans">
      {/* 1. DESKTOP SIDEBAR (White Background - EXACT as Screenshot 9) */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-stone-200 transition-all duration-300 shrink-0 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-stone-100 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div
              onClick={() => navigateTo('landing')}
              className="cursor-pointer select-none group"
            >
              <span className="text-2xl font-black tracking-tight text-stone-900">
                Q<span className="text-amber-500">Resto</span>
              </span>
            </div>
          ) : (
            <span className="text-2xl font-black text-stone-900 mx-auto">Q</span>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-stone-400 hover:text-stone-700 p-1 text-xs"
            title={sidebarCollapsed ? 'Déplier' : 'Replier'}
          >
            <FaIcon name={sidebarCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'} />
          </button>
        </div>

        {/* Nav list - Active: Black container, Inactive: Text with hover */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = dashboardTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDashboardTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <FaIcon
                  name={item.icon}
                  className={`text-base shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`}
                />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-amber-500 text-stone-900' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-stone-100">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  M
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {currentRestaurant.name}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                title="Déconnexion"
              >
                <FaIcon name="fa-solid fa-arrow-right-from-bracket" className="text-sm" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="w-full text-stone-400 hover:text-red-600 py-2 flex justify-center text-sm"
              title="Déconnexion"
            >
              <FaIcon name="fa-solid fa-arrow-right-from-bracket" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. TOPBAR & MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50/50">
        {/* Topbar matching Screenshot 9 */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <FaIcon name="fa-solid fa-magnifying-glass" className="text-xs" />
            </div>
            <input
              type="text"
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-xs sm:text-sm text-stone-900 rounded-full border border-stone-200/60 focus:border-stone-400 outline-hidden transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Right Action Icons & Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Simulation toggle button */}
            <button
              type="button"
              onClick={() => {
                setDemoModeWithData(!demoModeWithData);
                showToast(
                  !demoModeWithData
                    ? 'Mode simulation avec commandes activé !'
                    : 'Mode restaurant initial (0F) activé.',
                  'info'
                );
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              title="Basculer entre la vue initiale 0F et la simulation d'activité"
            >
              <span className={`w-2 h-2 rounded-full ${demoModeWithData ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              <span>{demoModeWithData ? 'Activité : Démo' : 'Activité : Réel (0F)'}</span>
            </button>

            {/* Restaurant Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRestaurantDropdownOpen(!restaurantDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-stone-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <FaIcon name="fa-solid fa-store" className="text-stone-500 text-xs" />
                <span className="max-w-[140px] truncate">{currentRestaurant.name}</span>
                <FaIcon name="fa-solid fa-chevron-down" className="text-[10px] text-stone-400" />
              </button>

              {restaurantDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in-up">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Changer de restaurant
                  </div>
                  {allRestaurants.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        storage.setCurrentUser({
                          ...currentUser,
                          restaurantId: r.id,
                        });
                        setRestaurantDropdownOpen(false);
                        window.location.reload();
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                        r.id === currentRestaurant.id
                          ? 'bg-amber-50 text-amber-800'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{r.name}</span>
                      {r.id === currentRestaurant.id && (
                        <FaIcon name="fa-solid fa-check" className="text-amber-600 text-xs" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRestaurantDropdownOpen(false);
                        navigateTo('restaurant-detail', { slug: currentRestaurant.slug });
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <FaIcon name="fa-solid fa-eye" className="text-stone-400" />
                      <span>Voir le menu client</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Badge */}
            <button
              type="button"
              onClick={() => setDashboardTab('orders')}
              className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
              title="Notifications"
            >
              <FaIcon name="fa-regular fa-bell" className="text-base" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            </button>

            {/* User Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center select-none">
              M
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD OVERVIEW (Screenshot 9) */}
          {dashboardTab === 'overview' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Bonjour 👋
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Voici l'activité de <span className="font-semibold text-stone-700">{currentRestaurant.name}</span> .
                </p>
              </div>

              {/* 4 Metric Cards (Screenshot 9) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Chiffre d'affaires */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-500">Chiffre d'affaires</p>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">
                      {totalRevenue.toLocaleString()} F
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                    <FaIcon name="fa-solid fa-wallet" />
                  </div>
                </div>

                {/* 2. Commandes */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-500">Commandes</p>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">
                      {totalOrdersCount}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                    <FaIcon name="fa-solid fa-bag-shopping" />
                  </div>
                </div>

                {/* 3. Panier moyen */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-500">Panier moyen</p>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">
                      {averageOrderValue.toLocaleString()} F
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                    <FaIcon name="fa-solid fa-arrow-trend-up" />
                  </div>
                </div>

                {/* 4. Clients */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-500">Clients</p>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">
                      {totalClientsCount}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg shrink-0">
                    <FaIcon name="fa-solid fa-users" />
                  </div>
                </div>
              </div>

              {/* 2 Charts Side by Side (Screenshot 9) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Ventes sur 7 jours */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-stone-900">Ventes sur 7 jours</h3>
                  </div>

                  <div className="relative h-56 w-full flex items-end">
                    {/* Y-Axis Labels */}
                    <div className="h-full flex flex-col justify-between text-[11px] text-stone-400 pr-3 pb-6">
                      <span>4</span>
                      <span>3</span>
                      <span>2</span>
                      <span>1</span>
                      <span>0</span>
                    </div>

                    {/* Chart Area with SVG Curve and Grid */}
                    <div className="flex-1 h-full relative flex flex-col justify-between">
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-200 h-0" />

                      {/* SVG Line with smooth curve */}
                      <svg
                        className="absolute inset-0 w-full h-full pb-6 overflow-visible pointer-events-none"
                        viewBox="0 0 350 150"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <path
                          d={
                            demoModeWithData
                              ? 'M 10,130 C 50,110 80,60 120,70 C 160,80 200,40 240,45 C 280,50 310,20 340,30 L 340,145 L 10,145 Z'
                              : 'M 10,140 L 340,140 L 340,145 L 10,145 Z'
                          }
                          fill="url(#chartGrad)"
                        />

                        <path
                          d={
                            demoModeWithData
                              ? 'M 10,130 C 50,110 80,60 120,70 C 160,80 200,40 240,45 C 280,50 310,20 340,30'
                              : 'M 10,140 L 340,140'
                          }
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />

                        {demoModeWithData && (
                          <>
                            <circle cx="120" cy="70" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                            <circle cx="240" cy="45" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                            <circle cx="340" cy="30" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                          </>
                        )}
                      </svg>

                      {/* X-Axis Labels */}
                      <div className="flex justify-between text-[11px] text-stone-400 pt-2 border-t border-transparent">
                        <span>Jeu</span>
                        <span>Ven</span>
                        <span>Sam</span>
                        <span>Dim</span>
                        <span>Lun</span>
                        <span>Mar</span>
                        <span>Mer</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart 2: Commandes par heure */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-stone-900">Commandes par heure</h3>
                  </div>

                  <div className="relative h-56 w-full flex items-end">
                    {/* Y-Axis Labels */}
                    <div className="h-full flex flex-col justify-between text-[11px] text-stone-400 pr-3 pb-6">
                      <span>4</span>
                      <span>3</span>
                      <span>2</span>
                      <span>1</span>
                      <span>0</span>
                    </div>

                    {/* Bars and X-Axis */}
                    <div className="flex-1 h-full flex flex-col justify-between">
                      {/* Grid lines */}
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-100 h-0" />
                      <div className="w-full border-b border-stone-200 h-0" />

                      {/* Bars Container */}
                      <div className="absolute inset-0 pb-6 pl-6 flex items-end justify-between gap-1">
                        {[
                          { hour: '9h', val: demoModeWithData ? 15 : 0 },
                          { hour: '10h', val: demoModeWithData ? 25 : 0 },
                          { hour: '11h', val: demoModeWithData ? 40 : 0 },
                          { hour: '12h', val: demoModeWithData ? 85 : 0 },
                          { hour: '13h', val: demoModeWithData ? 95 : 0 },
                          { hour: '14h', val: demoModeWithData ? 50 : 0 },
                          { hour: '15h', val: demoModeWithData ? 20 : 0 },
                          { hour: '16h', val: demoModeWithData ? 30 : 0 },
                          { hour: '17h', val: demoModeWithData ? 45 : 0 },
                          { hour: '18h', val: demoModeWithData ? 60 : 0 },
                          { hour: '19h', val: demoModeWithData ? 90 : 0 },
                          { hour: '20h', val: demoModeWithData ? 75 : 0 },
                        ].map((b, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div
                              style={{ height: `${b.val}%` }}
                              className="w-full max-w-[14px] bg-amber-400/80 group-hover:bg-amber-500 rounded-t-sm transition-all duration-500"
                            />
                          </div>
                        ))}
                      </div>

                      {/* X-Axis */}
                      <div className="flex justify-between text-[10px] text-stone-400 pt-2">
                        <span>9h</span>
                        <span>10h</span>
                        <span>11h</span>
                        <span>12h</span>
                        <span>13h</span>
                        <span>14h</span>
                        <span>15h</span>
                        <span>16h</span>
                        <span>17h</span>
                        <span>18h</span>
                        <span>19h</span>
                        <span>20h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMANDES (Screenshot 10) */}
          {dashboardTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Commandes
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Suivez et gérez les commandes de {currentRestaurant.name} en temps réel.
                </p>
              </div>

              {/* 6 Kanban Columns (Screenshot 10) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    status: 'NEW' as OrderStatus,
                    label: 'Nouvelles',
                    badgeBg: 'bg-blue-100 text-blue-700',
                    next: 'CONFIRMED' as OrderStatus,
                    btnLabel: 'Confirmer',
                  },
                  {
                    status: 'CONFIRMED' as OrderStatus,
                    label: 'Confirmées',
                    badgeBg: 'bg-indigo-100 text-indigo-700',
                    next: 'PREPARING' as OrderStatus,
                    btnLabel: 'En cuisine',
                  },
                  {
                    status: 'PREPARING' as OrderStatus,
                    label: 'En préparation',
                    badgeBg: 'bg-amber-100 text-amber-700',
                    next: 'READY' as OrderStatus,
                    btnLabel: 'Prête !',
                  },
                  {
                    status: 'READY' as OrderStatus,
                    label: 'Prêtes',
                    badgeBg: 'bg-emerald-100 text-emerald-700',
                    next: 'OUT_FOR_DELIVERY' as OrderStatus,
                    btnLabel: 'Expédier',
                  },
                  {
                    status: 'OUT_FOR_DELIVERY' as OrderStatus,
                    label: 'En livraison',
                    badgeBg: 'bg-purple-100 text-purple-700',
                    next: 'DELIVERED' as OrderStatus,
                    btnLabel: 'Livrée',
                  },
                  {
                    status: 'DELIVERED' as OrderStatus,
                    label: 'Livrées',
                    badgeBg: 'bg-stone-100 text-stone-700',
                    next: null,
                    btnLabel: null,
                  },
                ].map((col) => {
                  const colOrders = orders.filter((o) => o.status === col.status);
                  return (
                    <div key={col.status} className="flex flex-col space-y-3">
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                          {col.label}
                        </span>
                        <span className="text-xs font-bold text-stone-400">{colOrders.length}</span>
                      </div>

                      {/* Column Body: '-' if 0 orders, or order cards */}
                      <div className="space-y-3">
                        {colOrders.length === 0 ? (
                          <div className="h-28 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-300 text-xl font-bold">
                            -
                          </div>
                        ) : (
                          colOrders.map((ord) => (
                            <div
                              key={ord.id}
                              className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-900 font-mono">
                                  #{ord.trackingCode}
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-stone-800">{ord.customerName}</p>
                                <p className="text-[11px] text-stone-400">
                                  {ord.type === 'DINE_IN' ? `Table ${ord.tableNumber || 'N/A'}` : 'À emporter / Livraison'}
                                </p>
                              </div>

                              <div className="text-[11px] text-stone-600 border-t border-stone-100 pt-2 space-y-0.5">
                                {ord.items.map((it, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span className="truncate">{it.quantity}x {it.name}</span>
                                    <span className="font-semibold">{it.price * it.quantity} F</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-1 font-bold text-xs text-stone-900">
                                <span>Total</span>
                                <span>{ord.total.toLocaleString()} FCFA</span>
                              </div>

                              {col.next && (
                                <button
                                  type="button"
                                  onClick={() => advanceOrderStatus(ord.id, col.next!)}
                                  className="w-full py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
                                >
                                  {col.btnLabel} →
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATÉGORIES (Screenshot 11) */}
          {dashboardTab === 'categories' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Catégories
                  </h1>
                  <p className="text-sm text-stone-500 mt-1">
                    Organisez le menu de {currentRestaurant.name} .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all"
                >
                  <FaIcon name="fa-solid fa-plus" className="text-xs" />
                  <span>Nouvelle catégorie</span>
                </button>
              </div>

              {/* Empty state or categories list */}
              {categories.length === 0 ? (
                <div className="py-20 text-center text-stone-400 text-sm">
                  Aucune catégorie.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((cat, idx) => {
                    const catDishesCount = dishes.filter((d) => d.categoryId === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-stone-900">{cat.name}</h3>
                            <p className="text-xs text-stone-400">{catDishesCount} plats associés</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            storage.deleteCategory(cat.id);
                            showToast('Catégorie supprimée', 'info');
                          }}
                          className="text-stone-300 hover:text-red-500 p-2 transition-colors"
                          title="Supprimer"
                        >
                          <FaIcon name="fa-solid fa-trash-can" className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PLATS (Screenshot 12) */}
          {dashboardTab === 'dishes' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Plats
                  </h1>
                  <p className="text-sm text-stone-500 mt-1">
                    Gérez le menu de {currentRestaurant.name} .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNewDishModal}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all"
                >
                  <FaIcon name="fa-solid fa-plus" className="text-xs" />
                  <span>Nouveau plat</span>
                </button>
              </div>

              {/* Dashed card empty state OR list of dishes */}
              {dishes.length === 0 ? (
                <div className="py-24 border-2 border-dashed border-stone-200 rounded-3xl bg-white text-center flex flex-col items-center justify-center p-6">
                  <p className="text-sm text-stone-500 mb-4">
                    Aucun plat. Créez votre premier plat !
                  </p>
                  <button
                    type="button"
                    onClick={openNewDishModal}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
                  >
                    <FaIcon name="fa-solid fa-plus" className="text-xs" />
                    <span>Créer un plat</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishes.map((dish) => {
                    const cat = categories.find((c) => c.id === dish.categoryId);
                    return (
                      <div
                        key={dish.id}
                        className="rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-44 bg-stone-100 overflow-hidden">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                            />
                            {dish.has3DModel && (
                              <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                                <FaIcon name="fa-solid fa-cube" className="text-amber-400 text-[10px]" />
                                <span>3D Actif</span>
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                                {cat?.name || 'Général'}
                              </span>
                              <span className="text-sm font-extrabold text-stone-900">
                                {dish.price.toLocaleString()} FCFA
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-stone-900">{dish.name}</h3>
                            <p className="text-xs text-stone-500 line-clamp-2">{dish.description}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              storage.updateDish(dish.id, { isAvailable: !dish.isAvailable });
                              showToast(
                                dish.isAvailable ? 'Plat marqué épuisé' : 'Plat disponible',
                                'info'
                              );
                            }}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              dish.isAvailable
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {dish.isAvailable ? '✓ Disponible' : '✕ Épuisé'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDish(dish);
                                setDishName(dish.name);
                                setDishDesc(dish.description);
                                setDishPrice(dish.price);
                                setDishCategoryId(dish.categoryId);
                                setDishPrepTime(dish.preparationTimeMin);
                                setDishImage(dish.image);
                                setDishHas3D(dish.has3DModel || false);
                                setDishModalOpen(true);
                              }}
                              className="text-stone-400 hover:text-stone-900 p-1 text-xs"
                              title="Modifier"
                            >
                              <FaIcon name="fa-solid fa-pen" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                storage.deleteDish(dish.id);
                                showToast('Plat supprimé', 'info');
                              }}
                              className="text-stone-400 hover:text-red-500 p-1 text-xs"
                              title="Supprimer"
                            >
                              <FaIcon name="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TABLES */}
          {dashboardTab === 'tables' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Tables
                  </h1>
                  <p className="text-sm text-stone-500 mt-1">
                    Gérez les tables physiques de votre établissement.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTableModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all"
                >
                  <FaIcon name="fa-solid fa-plus" className="text-xs" />
                  <span>Nouvelle table</span>
                </button>
              </div>

              {tables.length === 0 ? (
                <div className="py-20 text-center text-stone-400 text-sm">
                  Aucune table active. Créez des tables d'abord.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tables.map((tbl) => (
                    <div
                      key={tbl.id}
                      className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-400 uppercase">
                          Table {tbl.number}
                        </span>
                        <h3 className="text-base font-black text-stone-900">{tbl.name}</h3>
                        <p className="text-xs text-stone-500">Capacité : {tbl.capacity} personnes</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveQrTable(tbl)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <FaIcon name="fa-solid fa-qrcode" className="text-amber-600" />
                        <span>Voir QR</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: QR CODES & PARTAGE (Screenshot 13) */}
          {dashboardTab === 'qrcodes' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  QR Codes & Partage
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Partagez votre menu digital et imprimez vos QR codes de table.
                </p>
              </div>

              {/* Amber Highlight Box (Screenshot 13) */}
              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <FaIcon name="fa-solid fa-link" className="text-amber-600" />
                  <span>Lien de votre menu digital</span>
                </div>
                <p className="text-xs text-stone-500">
                  Partagez ce lien sur vos réseaux sociaux, votre site ou vos supports marketing.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={publicMenuUrl}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-700 font-mono outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMenuLink}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0"
                  >
                    Copier
                  </button>
                </div>
              </div>

              {/* QR Codes par table section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FaIcon name="fa-solid fa-qrcode" className="text-amber-600" />
                  <span>QR Codes par table</span>
                </h3>

                {tables.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 text-sm border border-stone-200 rounded-2xl bg-white">
                    <FaIcon name="fa-solid fa-qrcode" className="text-3xl text-stone-300 mb-2 block" />
                    Aucune table active. Créez des tables d'abord.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {tables.map((tbl) => (
                      <div
                        key={tbl.id}
                        className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center"
                      >
                        <div className="w-40 h-40 bg-white p-2 rounded-xl border border-stone-100 shadow-2xs flex items-center justify-center mb-4">
                          <QRCodeViewer
                            url={`${publicMenuUrl}?table=${tbl.number}`}
                            restaurantName={currentRestaurant.name}
                            tableNumber={tbl.number}
                          />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{tbl.name}</h4>
                        <p className="text-xs text-stone-400 mb-4">Table #{tbl.number}</p>
                        <button
                          type="button"
                          onClick={() => setActiveQrTable(tbl)}
                          className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                        >
                          Imprimer le QR Code
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: RESTAURANT */}
          {dashboardTab === 'restaurant' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Restaurant
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Coordonnées et présentation de {currentRestaurant.name}.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nom du restaurant</label>
                    <input
                      type="text"
                      defaultValue={currentRestaurant.name}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Téléphone (MTN / Moov)</label>
                    <input
                      type="text"
                      defaultValue={currentRestaurant.phone}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Ville</label>
                    <input
                      type="text"
                      defaultValue={currentRestaurant.city}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Frais de livraison (FCFA)</label>
                    <input
                      type="number"
                      defaultValue={currentRestaurant.deliveryFee}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Adresse complète</label>
                  <input
                    type="text"
                    defaultValue={currentRestaurant.address}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Informations du restaurant sauvegardées !', 'success')}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm hover:bg-stone-800 transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS */}
          {dashboardTab === 'analytics' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Analytics
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Performances des ventes et préférences des clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-medium text-stone-500">Moyen de paiement favori</span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">MTN Mobile Money (68%)</h3>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-medium text-stone-500">Plat le plus commandé</span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">Poulet braisé royal</h3>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-medium text-stone-500">Taux de conversion QR</span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">94.2%</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ÉQUIPE */}
          {dashboardTab === 'team' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Équipe
                  </h1>
                  <p className="text-sm text-stone-500 mt-1">
                    Gérez les accès de vos serveurs et cuisiniers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Invitation membre envoyée !', 'success')}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm"
                >
                  + Ajouter un membre
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs divide-y divide-stone-100">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-xs text-stone-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Propriétaire
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: ABONNEMENT (Screenshot 14) */}
          {dashboardTab === 'subscription' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Abonnement
                </h1>
              </div>

              {/* 3 Pricing Cards matching Screenshot 14 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan 1: Starter (Current Plan highlighted) */}
                <div className="p-7 rounded-3xl bg-amber-50/20 border-2 border-amber-400 shadow-xs flex flex-col justify-between relative">
                  <div>
                    <div className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Starter</span>
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-stone-900">Gratuit</span>
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-stone-700 mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>1 restaurant</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>Menu digital</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>Commandes illimitées</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>QR codes de table</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl bg-stone-100 text-stone-400 font-bold text-xs sm:text-sm cursor-not-allowed"
                  >
                    Plan actuel
                  </button>
                </div>

                {/* Plan 2: Pro */}
                <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Pro</span>
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-stone-900">5 000 F</span>
                      <span className="text-xs text-stone-400 font-medium">/mois</span>
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-stone-700 mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Tout Starter +</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Restaurants illimités</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Analytics avancés</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Paiement en ligne</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Support prioritaire</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      storage.updateRestaurant(currentRestaurant.id, { subscriptionPlan: 'STARTER_5000' });
                      showToast('Abonnement Pro 5000F activé avec succès !', 'success');
                    }}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                  >
                    Choisir
                  </button>
                </div>

                {/* Plan 3: Business */}
                <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Business</span>
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-stone-900">8 000 F</span>
                      <span className="text-xs text-stone-400 font-medium">/mois</span>
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-stone-700 mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Tout Pro +</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Multi-établissements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Visualisation 3D</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>API & intégrations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-stone-900 font-bold">✓</span>
                        <span>Support dédié</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      storage.updateRestaurant(currentRestaurant.id, { subscriptionPlan: 'PRO_8000' });
                      showToast('Abonnement Business 8000F activé avec succès !', 'success');
                    }}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                  >
                    Choisir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: PARAMÈTRES */}
          {dashboardTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Paramètres
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Préférences système et notifications sonores.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Alertes sonores commandes</h4>
                    <p className="text-xs text-stone-500">Jouer un carillon dès qu'un client passe commande</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Accepter les commandes à emporter</h4>
                    <p className="text-xs text-stone-500">Permettre aux clients de récupérer sur place</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Devise de facturation</h4>
                    <p className="text-xs text-stone-500">Franc CFA (XOF / FCFA)</p>
                  </div>
                  <span className="text-xs font-bold bg-stone-100 px-3 py-1 rounded-lg">FCFA</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: NOUVEAU PLAT / MODIFIER PLAT */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900">
                {editingDish ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
              </h3>
              <button
                type="button"
                onClick={() => setDishModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <FaIcon name="fa-solid fa-xmark" className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nom du plat</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="ex: Poulet Braisé Royal"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-stone-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-stone-900 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Temps prep. (min)</label>
                  <input
                    type="number"
                    value={dishPrepTime}
                    onChange={(e) => setDishPrepTime(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-stone-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catégorie</label>
                <select
                  value={dishCategoryId}
                  onChange={(e) => setDishCategoryId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-stone-900 outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Ingrédients, accompagnements..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-stone-900 outline-hidden"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Visualisation 3D Interactive</h4>
                  <p className="text-[11px] text-stone-400">Activer le modèle 3D rotatif pour ce plat</p>
                </div>
                <input
                  type="checkbox"
                  checked={dishHas3D}
                  onChange={(e) => setDishHas3D(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVELLE CATÉGORIE */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <h3 className="text-base font-black text-stone-900">Ajouter une catégorie</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <input
                type="text"
                required
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                placeholder="ex: Grillades & Braisés"
                className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm outline-hidden"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVELLE TABLE */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <h3 className="text-base font-black text-stone-900">Ajouter une table</h3>
            <form onSubmit={handleSaveTable} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Numéro de table</label>
                <input
                  type="text"
                  required
                  value={tableNumberInput}
                  onChange={(e) => setTableNumberInput(e.target.value)}
                  placeholder="ex: 12"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nom personnalisé</label>
                <input
                  type="text"
                  value={tableNameInput}
                  onChange={(e) => setTableNameInput(e.target.value)}
                  placeholder="ex: Terrasse VIP"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm outline-hidden"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE PRINT PREVIEW */}
      {activeQrTable && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                {currentRestaurant.name}
              </span>
              <button
                type="button"
                onClick={() => setActiveQrTable(null)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <FaIcon name="fa-solid fa-xmark" className="text-lg" />
              </button>
            </div>

            <div className="py-2 flex justify-center">
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
                <QRCodeViewer
                  url={`${publicMenuUrl}?table=${activeQrTable.number}`}
                  restaurantName={currentRestaurant.name}
                  tableNumber={activeQrTable.number}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">Table #{activeQrTable.number}</h3>
              <p className="text-xs text-stone-500 mt-1">
                Scannez pour commander sans attente
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <FaIcon name="fa-solid fa-print" />
                <span>Imprimer</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${publicMenuUrl}?table=${activeQrTable.number}`);
                  showToast('Lien de table copié !', 'success');
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <FaIcon name="fa-solid fa-link" />
                <span>Copier le lien</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
