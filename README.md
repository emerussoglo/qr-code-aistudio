# QResto - Plateforme SaaS de Digitalisation de Restaurants & Menus QR

Bienvenue dans le code source de **QResto**, une solution SaaS complète et moderne construite avec **Next.js (App Router)**, **TypeScript**, et **Tailwind CSS**.

QResto permet aux restaurants, maquis, fast-foods et hôtels (au Bénin et en Afrique de l'Ouest) de digitaliser leurs menus avec des QR codes dynamiques par table, des visualisations 3D de plats, des paiements Mobile Money (MTN MoMo, Moov Money) et un tableau de bord multi-tenant complet pour les gérants.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18.18+ ou 20+
- npm, pnpm ou yarn

### Installation des dépendances
```bash
npm install
```

### Lancement du serveur de développement (Next.js)
```bash
npm run dev
```
Ouvrez ensuite votre navigateur sur : [http://localhost:3000](http://localhost:3000)

### Compilation pour la production
```bash
npm run build
npm start
```

---

## 🛠️ Stack Technique

- **Framework** : [Next.js](https://nextjs.org/) (App Router, React 19)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4 avec `@tailwindcss/postcss`
- **Iconographie** : FontAwesome 6 & Lucide Icons
- **Rendu 3D** : Visualiseur de plats 3D interactif Canvas/WebGL
- **QR Codes** : Générateur de QR codes haute définition imprimables (`qrcode`)
- **Stockage de données** : Architecture isolée multi-tenant avec persistance locale et prête pour intégration API / Base de données Cloud SQL / Firebase.

---

## 📂 Architecture du Projet

```text
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css           # Styles globaux & animations Tailwind CSS
│   │   ├── layout.tsx            # Root Layout avec métadonnées SEO & polices
│   │   └── page.tsx              # Page d'accueil & point d'entrée client
│   ├── components/               # Composants modulaires
│   │   ├── 3d/                   # Visualiseur 3D interactif de plats (Dish3DViewer)
│   │   ├── auth/                 # Connexion & Inscription restaurateurs
│   │   ├── common/               # Navbar, Footer, Toast, FaIcon
│   │   ├── customer/             # Vue client : Menus, Panier, Suivi commande
│   │   ├── dashboard/            # Dashboard restaurateur (KPIs, Kanban, Menus, Tables, QR)
│   │   ├── pages/                # Landing page, CGU, Confidentialité, Contact
│   │   └── qr/                   # Composant d'export et prévisualisation QR Code
│   ├── context/                  # AppContext (État global réactif)
│   ├── lib/                      # Gestion du stockage (storage.ts) & seed data
│   └── types/                    # Interfaces & types TypeScript
├── public/                       # Fichiers statiques, images et assets
├── next.config.mjs               # Configuration Next.js
├── postcss.config.mjs            # Configuration PostCSS pour Tailwind v4
└── tsconfig.json                 # Configuration TypeScript pour Next.js
```

---

## ✨ Fonctionnalités Clés

1. **Menus QR Dynamiques par Table** :
   - Génération instantanée de QR codes par numéro de table.
   - Les clients scannent sans installer d'application ni créer de compte.
2. **Visualisation 3D des Plats** :
   - Rotation 360°, zoom interactif sur les plats phares (Poulet braisé, Igname pilée, Poisson grillé, Wagashi).
3. **Paiements Locaux Adaptés** :
   - Support natif de MTN Mobile Money, Moov Money, Espèces à la livraison / à table et Carte bancaire.
4. **Dashboard Gérant Complet** :
   - Suivi du chiffre d'affaires et panier moyen en FCFA.
   - Graphiques de ventes sur 7 jours et affluence par heure.
   - Gestion des catégories, plats (prix, disponibilité, modélisation 3D).
   - Kanban des commandes en direct (Nouvelle → Confirmée → En cuisine → Prête → Livrée).
5. **Isolation Multi-Tenant** :
   - Chaque restaurateur dispose de son propre espace étanche et sécurisé.

---

© 2026 QResto Africa. Tous droits réservés.
