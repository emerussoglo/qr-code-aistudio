export type UserRole = 'SUPER_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_STAFF' | 'DELIVERY_PARTNER';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  restaurantId?: string;
  createdAt: string;
}

export type SubscriptionPlan = 'FREE' | 'STARTER_5000' | 'PRO_8000';

export interface RestaurantSettings {
  soundNotifications: boolean;
  emailNotifications: boolean;
  acceptDelivery: boolean;
  acceptDineIn: boolean;
  acceptPickup: boolean;
  tableOrderDirect: boolean;
  autoConfirmOrders: boolean;
  momoNumber?: string;
  momoProvider?: 'MTN' | 'MOOV' | 'CELTIS';
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string; // e.g. Cotonou, Porto-Novo, Abomey-Calavi, Parakou
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  openingHours: string;
  isOpen: boolean;
  currency: string; // "FCFA"
  deliveryFee: number;
  minOrder: number;
  rating: number;
  reviewCount: number;
  category: string; // e.g. "Cuisine Béninoise & Africaine", "Grillades & Poissons", "Fast Food & Burgers"
  cuisineType?: string;
  ownerId: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string;
  settings: RestaurantSettings;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  icon?: string;
  order: number;
  active: boolean;
}

export interface Dish {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in FCFA
  originalPrice?: number;
  image: string;
  isAvailable: boolean;
  preparationTimeMin: number;
  allergens: string[];
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isSpecialty?: boolean;
  has3DModel?: boolean;
  model3DType?: 'poulet_braise' | 'poisson_grille' | 'igname_pile' | 'burger' | 'alloco' | 'cocktail';
  createdAt: string;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  number: number | string;
  name: string;
  capacity: number;
  active: boolean;
  createdAt: string;
}

export type OrderType = 'DINE_IN' | 'PICKUP' | 'DELIVERY';

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'CARD';

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  image?: string;
}

export interface Order {
  id: string;
  trackingCode: string; // e.g., "QR-4921"
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  type: OrderType;
  tableNumber?: string | number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID';
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  restaurantName?: string;
  city: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'restaurant' | 'client' | 'paiement';
}
