import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Restaurant,
  Dish,
  Order,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../types';
import { storage } from '../lib/storage';

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export type DashboardTab =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'categories'
  | 'dishes'
  | 'tables'
  | 'qrcodes'
  | 'restaurant'
  | 'analytics'
  | 'team'
  | 'subscription'
  | 'settings';

export type AppView =
  | 'landing'
  | 'restaurants'
  | 'restaurant-detail'
  | 'dish-detail'
  | 'cart'
  | 'order-tracking'
  | 'login'
  | 'register'
  | 'register-restaurant'
  | 'dashboard'
  | 'cgu'
  | 'privacy'
  | 'contact';

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  navigateTo: (view: AppView, params?: Record<string, any>) => void;
  viewParams: Record<string, any>;

  // Authentication & Multi-Tenant
  currentUser: User | null;
  currentRestaurant: Restaurant | null; // For logged-in restaurant owner
  login: (email: string, password?: string) => Promise<User>;
  registerOwnerAndRestaurant: (ownerData: any, restaurantData: any) => Promise<{ user: User; restaurant: Restaurant }>;
  logout: () => void;

  // Cart
  cart: CartItem[];
  cartRestaurantId: string | null;
  addToCart: (dish: Dish, quantity?: number, notes?: string) => void;
  updateCartQuantity: (dishId: string, delta: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Ordering
  placeOrder: (orderData: {
    type: OrderType;
    tableNumber?: string | number;
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerNotes?: string;
    paymentMethod: PaymentMethod;
  }) => Promise<Order>;

  // Tracking
  trackedOrder: Order | null;
  trackingCodeInput: string;
  setTrackingCodeInput: (code: string) => void;
  searchTrackedOrder: (code: string) => Order | null;
  refreshTrackedOrder: () => void;

  // Dashboard Operations (strictly isolated to currentRestaurant)
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  updateRestaurantStatus: (status: OrderStatus, orderId: string) => void;
  reloadRestaurantData: () => void;

  // Toasts
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(() => {
    const user = storage.getCurrentUser();
    if (user && user.restaurantId) {
      return storage.getRestaurantById(user.restaurantId) || null;
    }
    return null;
  });

  // Cart State (stored in session/localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('qresto_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cartRestaurantId, setCartRestaurantId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('qresto_cart_rest_id') || null;
    } catch {
      return null;
    }
  });

  // Tracking State
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Dashboard State
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('qresto_cart', JSON.stringify(cart));
    if (cart.length === 0) {
      localStorage.removeItem('qresto_cart_rest_id');
      setCartRestaurantId(null);
    } else if (cartRestaurantId) {
      localStorage.setItem('qresto_cart_rest_id', cartRestaurantId);
    }
  }, [cart, cartRestaurantId]);

  // View Navigation Helper
  const navigateTo = (view: AppView, params: Record<string, any> = {}) => {
    // Multi-tenant protection for dashboard
    if (view === 'dashboard') {
      const user = currentUser || storage.getCurrentUser();
      if (!user) {
        showToast('Veuillez vous connecter pour accéder à votre espace restaurant.', 'info');
        setCurrentView('login');
        return;
      }
      if (!user.restaurantId && user.role !== 'SUPER_ADMIN') {
        showToast('Aucun restaurant n\'est rattaché à ce compte.', 'error');
        setCurrentView('register-restaurant');
        return;
      }
    }

    setViewParams(params);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login
  const login = async (email: string, password?: string): Promise<User> => {
    const user = storage.loginUser(email, password);
    setCurrentUser(user);
    if (user.restaurantId) {
      const rest = storage.getRestaurantById(user.restaurantId);
      setCurrentRestaurant(rest || null);
    } else {
      setCurrentRestaurant(null);
    }
    showToast(`Bienvenue ${user.firstName} !`, 'success');
    return user;
  };

  // Register Owner + Restaurant
  const registerOwnerAndRestaurant = async (ownerData: any, restaurantData: any) => {
    const slug = restaurantData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 1. Create Restaurant first
    const newRestaurant = storage.createRestaurant({
      name: restaurantData.name,
      slug: slug || `restaurant-${Date.now()}`,
      description: restaurantData.description || 'Restaurant & Menu digital authentique',
      address: restaurantData.address || 'Cotonou, Bénin',
      city: restaurantData.city || 'Cotonou',
      phone: restaurantData.phone || ownerData.phone,
      email: ownerData.email,
      logo: restaurantData.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      coverImage: restaurantData.coverImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      openingHours: restaurantData.openingHours || '11h00 - 23h00',
      isOpen: true,
      currency: 'FCFA',
      deliveryFee: Number(restaurantData.deliveryFee) || 1000,
      minOrder: Number(restaurantData.minOrder) || 2000,
      rating: 5.0,
      reviewCount: 1,
      category: restaurantData.category || 'Cuisine Africaine & Grillades',
      ownerId: 'temp',
      subscriptionPlan: 'FREE',
      settings: {
        soundNotifications: true,
        emailNotifications: true,
        acceptDelivery: true,
        acceptDineIn: true,
        acceptPickup: true,
        tableOrderDirect: true,
        autoConfirmOrders: false,
        momoNumber: restaurantData.momoNumber || ownerData.phone,
        momoProvider: restaurantData.momoProvider || 'MTN',
      },
    });

    // 2. Create Owner User
    const newUser = storage.registerUser({
      email: ownerData.email,
      password: ownerData.password,
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      phone: ownerData.phone,
      role: 'RESTAURANT_OWNER',
      restaurantId: newRestaurant.id,
    });

    // Update restaurant ownerId
    storage.updateRestaurant(newRestaurant.id, { ownerId: newUser.id });
    newRestaurant.ownerId = newUser.id;

    // Seed initial default categories and sample tables for the new restaurant
    storage.createCategory({ restaurantId: newRestaurant.id, name: 'Spécialités de la Maison', order: 1, active: true });
    storage.createCategory({ restaurantId: newRestaurant.id, name: 'Plats Principaux & Grillades', order: 2, active: true });
    storage.createCategory({ restaurantId: newRestaurant.id, name: 'Boissons & Rafraîchissements', order: 3, active: true });

    storage.createTable({ restaurantId: newRestaurant.id, number: 1, name: 'Table Terrasse 1', capacity: 4, active: true });
    storage.createTable({ restaurantId: newRestaurant.id, number: 2, name: 'Table Salle 2', capacity: 2, active: true });

    setCurrentUser(newUser);
    setCurrentRestaurant(newRestaurant);
    showToast(`Félicitations ! Votre restaurant ${newRestaurant.name} est créé.`, 'success');
    return { user: newUser, restaurant: newRestaurant };
  };

  // Logout
  const logout = () => {
    storage.logout();
    setCurrentUser(null);
    setCurrentRestaurant(null);
    showToast('Vous êtes déconnecté.', 'info');
    setCurrentView('landing');
  };

  // Cart Operations
  const addToCart = (dish: Dish, quantity: number = 1, notes?: string) => {
    // If cart has items from another restaurant, ask or reset
    if (cartRestaurantId && cartRestaurantId !== dish.restaurantId && cart.length > 0) {
      if (
        !window.confirm(
          'Votre panier contient déjà des plats d\'un autre restaurant. Voulez-vous le réinitialiser pour commander dans ce nouvel établissement ?'
        )
      ) {
        return;
      }
      setCart([{ dish, quantity, notes }]);
      setCartRestaurantId(dish.restaurantId);
      showToast(`${dish.name} ajouté au panier !`, 'success');
      return;
    }

    setCartRestaurantId(dish.restaurantId);
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { dish, quantity, notes }];
    });

    showToast(`${dish.name} ajouté au panier !`, 'success');
  };

  const updateCartQuantity = (dishId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
    showToast('Plat retiré du panier.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurantId(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order
  const placeOrder = async (orderData: {
    type: OrderType;
    tableNumber?: string | number;
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerNotes?: string;
    paymentMethod: PaymentMethod;
  }): Promise<Order> => {
    if (!cartRestaurantId || cart.length === 0) {
      throw new Error('Votre panier est vide');
    }

    const rest = storage.getRestaurantById(cartRestaurantId);
    if (!rest) {
      throw new Error('Restaurant introuvable');
    }

    const subtotal = cartTotal;
    const deliveryFee = orderData.type === 'DELIVERY' ? rest.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    const items = cart.map((item) => ({
      dishId: item.dish.id,
      name: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity,
      notes: item.notes,
      image: item.dish.image,
    }));

    const order = storage.createOrder({
      restaurantId: rest.id,
      restaurantName: rest.name,
      restaurantPhone: rest.phone,
      type: orderData.type,
      tableNumber: orderData.tableNumber,
      items,
      subtotal,
      deliveryFee,
      total,
      status: rest.settings.autoConfirmOrders ? 'CONFIRMED' : 'NEW',
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      customerNotes: orderData.customerNotes,
      paymentMethod: orderData.paymentMethod,
      paymentStatus:
        orderData.paymentMethod === 'MTN_MOMO' || orderData.paymentMethod === 'MOOV_MONEY'
          ? 'PAID'
          : 'PENDING',
    });

    // Clear cart after placing order
    clearCart();

    // Set as active tracked order
    setTrackedOrder(order);
    setTrackingCodeInput(order.trackingCode);

    showToast(`Commande ${order.trackingCode} enregistrée avec succès !`, 'success');
    return order;
  };

  // Search Tracked Order
  const searchTrackedOrder = (code: string): Order | null => {
    if (!code || !code.trim()) return null;
    const found = storage.getOrderByTrackingCode(code);
    if (found) {
      setTrackedOrder(found);
      setTrackingCodeInput(found.trackingCode);
      return found;
    }
    showToast('Aucune commande trouvée avec ce code.', 'error');
    return null;
  };

  const refreshTrackedOrder = () => {
    if (!trackedOrder) return;
    const updated = storage.getOrderByTrackingCode(trackedOrder.trackingCode);
    if (updated) {
      setTrackedOrder(updated);
      showToast('Statut de la commande actualisé.', 'info');
    }
  };

  // Dashboard Helpers
  const updateRestaurantStatus = (status: OrderStatus, orderId: string) => {
    const updated = storage.updateOrderStatus(orderId, status);
    if (updated) {
      showToast(`Statut de la commande mis à jour : ${status}`, 'success');
      // If currently tracked order is this one, update it too
      if (trackedOrder && trackedOrder.id === orderId) {
        setTrackedOrder(updated);
      }
    }
  };

  const reloadRestaurantData = () => {
    if (currentUser?.restaurantId) {
      const rest = storage.getRestaurantById(currentUser.restaurantId);
      setCurrentRestaurant(rest || null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        viewParams,
        currentUser,
        currentRestaurant,
        login,
        registerOwnerAndRestaurant,
        logout,
        cart,
        cartRestaurantId,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        placeOrder,
        trackedOrder,
        trackingCodeInput,
        setTrackingCodeInput,
        searchTrackedOrder,
        refreshTrackedOrder,
        dashboardTab,
        setDashboardTab,
        updateRestaurantStatus,
        reloadRestaurantData,
        toastMessage,
        toastType,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
