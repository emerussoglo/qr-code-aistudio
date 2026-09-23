'use client';

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/pages/LandingPage';
import { RestaurantsPage } from './components/customer/RestaurantsPage';
import { RestaurantDetailPage } from './components/customer/RestaurantDetailPage';
import { CartPage } from './components/customer/CartPage';
import { OrderTrackingPage } from './components/customer/OrderTrackingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterRestaurantPage } from './components/auth/RegisterRestaurantPage';
import { RestaurantDashboard } from './components/dashboard/RestaurantDashboard';
import { CguPage, PrivacyPage, ContactPage } from './components/pages/StaticPages';

const MainRouter: React.FC = () => {
  const { currentView, navigateTo } = useApp();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle URL hash routing if user opens a shared table QR link (e.g. /#menu-chez-mama-benin?table=4)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#menu-')) {
        const full = hash.replace('#menu-', '');
        const [slugPart, queryPart] = full.split('?');
        const urlParams = new URLSearchParams(queryPart || '');
        const table = urlParams.get('table') || undefined;
        navigateTo('restaurant-detail', { slug: slugPart, table });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigateTo]);

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'restaurants':
        return <RestaurantsPage />;
      case 'restaurant-detail':
        return <RestaurantDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'login':
        return <LoginPage />;
      case 'register-restaurant':
        return <RegisterRestaurantPage />;
      case 'dashboard':
        return <RestaurantDashboard />;
      case 'cgu':
        return <CguPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LandingPage />;
    }
  };

  const isDashboard = currentView === 'dashboard';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-white">
      {/* Global Navbar (Only hidden in dashboard to maximize workspace) */}
      {!isDashboard && <Navbar />}

      {/* Main View Container */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Global Footer (Only hidden in dashboard) */}
      {!isDashboard && <Footer />}

      {/* Global notification toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
