'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-900 flex items-center justify-center font-black text-xl shadow-lg mb-4 animate-bounce">
        Q
      </div>
      <p className="text-sm font-bold text-stone-800">QResto Africa</p>
      <p className="text-xs text-stone-400 mt-1">Chargement de votre expérience gourmande...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-900 flex items-center justify-center font-black text-xl shadow-lg mb-4 animate-bounce">
            Q
          </div>
          <p className="text-sm font-bold text-stone-800">QResto Africa</p>
        </div>
      }
    >
      <App />
    </Suspense>
  );
}
