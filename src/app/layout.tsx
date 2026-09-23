import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QResto - Digitalisation Restaurants & Menus QR Afrique',
  description:
    'Plateforme SaaS complète pour les restaurants au Bénin et en Afrique : menus digitaux QR interactifs, commandes sans inscription, suivi en temps réel, dashboard multi-tenant sécurisé.',
  openGraph: {
    title: 'QResto - Digitalisation Restaurants & Menus QR Afrique',
    description:
      'Plateforme SaaS complète pour les restaurants au Bénin et en Afrique : menus digitaux QR interactifs, commandes sans inscription, suivi en temps réel, dashboard multi-tenant sécurisé.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QResto - Digitalisation Restaurants & Menus QR Afrique',
    description:
      'Plateforme SaaS complète pour les restaurants au Bénin et en Afrique : menus digitaux QR interactifs, commandes sans inscription, suivi en temps réel, dashboard multi-tenant sécurisé.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
