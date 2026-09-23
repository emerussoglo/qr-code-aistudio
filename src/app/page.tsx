'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-amber-500/20 mb-4 animate-bounce">
          Q
        </div>
      </div>
      <p className="text-base font-bold text-stone-900 tracking-tight">QResto Africa</p>
      <p className="text-xs text-stone-500 mt-1 font-medium">Chargement de votre expérience gastronomique...</p>
    </div>
  ),
});

export default function HomePage() {
  return <App />;
}
