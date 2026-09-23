import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaIcon } from '../common/Icon';

export const RegisterRestaurantPage: React.FC = () => {
  const { registerOwnerAndRestaurant, navigateTo } = useApp();

  // Step 1: Owner Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Restaurant Details
  const [restaurantName, setRestaurantName] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Cuisine Béninoise & Grillades');
  const [description, setDescription] = useState('');
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'MOOV'>('MTN');
  const [momoNumber, setMomoNumber] = useState('');
  const [plan, setPlan] = useState<'STARTER_5000' | 'PRO_8000'>('PRO_8000');
  const [logoPreview, setLogoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'
  );
  const [coverPreview, setCoverPreview] = useState<string>(
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload reader for logo or cover
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (target === 'logo') setLogoPreview(result);
        else setCoverPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!restaurantName.trim()) {
      setError('Veuillez saisir le nom de votre établissement.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      setIsLoading(true);
      await registerOwnerAndRestaurant(
        {
          firstName,
          lastName,
          email,
          phone,
          password,
        },
        {
          name: restaurantName,
          city,
          address: address || `${city}, Bénin`,
          category,
          description: description || `Bienvenue au restaurant ${restaurantName}`,
          logo: logoPreview,
          coverImage: coverPreview,
          momoProvider,
          momoNumber: momoNumber || phone,
          subscriptionPlan: plan,
        }
      );

      // Redirect straight to dashboard
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl mx-auto mb-3 shadow-md shadow-amber-500/20">
            <FaIcon name="fa-solid fa-store" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Digitalisez votre restaurant
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Créez votre menu digital QR, configurez vos tables et commencez à recevoir des commandes dès aujourd'hui au Bénin.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <FaIcon name="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informations Responsable */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100">
              <FaIcon name="fa-solid fa-user" />
              <span>1. Responsable & Compte d'accès</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reine"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dossou"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email professionnel *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: contact@chezmama.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Téléphone de contact *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +229 97 00 11 22"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Mot de passe secret *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Informations du Restaurant */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100">
              <FaIcon name="fa-solid fa-utensils" />
              <span>2. Profil de l'Établissement</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nom du restaurant *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chez Mama Cotonou"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Ville au Bénin *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Cotonou">Cotonou</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                    <option value="Parakou">Parakou</option>
                    <option value="Ouidah">Ouidah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Catégorie culinaire *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Cuisine Béninoise & Grillades">Cuisine Béninoise & Grillades</option>
                    <option value="Poissons & Grillades Marines">Poissons & Grillades Marines</option>
                    <option value="Burgers & Street Food Africaine">Burgers & Street Food Africaine</option>
                    <option value="Lounge, Cocktails & Tapas">Lounge, Cocktails & Tapas</option>
                    <option value="Pâtisserie & Salon de thé">Pâtisserie & Salon de thé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Adresse ou Quartier *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Haie Vive, Rue 340"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Courte description</label>
                <textarea
                  rows={2}
                  placeholder="Vos spécialités phares, ambiance..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Logo & Banner image picker/upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-2">Logo du restaurant</label>
                  <div className="flex items-center gap-3">
                    <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-xl object-cover border" />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'logo')}
                        className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                      />
                      <span className="text-[10px] text-stone-400 block mt-1">PNG, JPG jusqu'à 5Mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-2">Image de couverture / Bannière</label>
                  <div className="flex items-center gap-3">
                    <img src={coverPreview} alt="Couverture" className="w-14 h-14 rounded-xl object-cover border" />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'cover')}
                        className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                      />
                      <span className="text-[10px] text-stone-400 block mt-1">Photo de salle ou plat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Choix de l'abonnement (5000F ou 8000F) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100">
              <FaIcon name="fa-solid fa-credit-card" />
              <span>3. Formule d'abonnement au Bénin</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPlan('STARTER_5000')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  plan === 'STARTER_5000'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900 text-sm">Formule Starter</span>
                  <span className="text-sm font-extrabold text-amber-600">5 000 FCFA/m</span>
                </div>
                <p className="text-xs text-stone-500">Menu digital, jusqu'à 15 tables QR, commandes en direct.</p>
              </div>

              <div
                onClick={() => setPlan('PRO_8000')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  plan === 'PRO_8000'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-sm">Formule Pro Illimitée</span>
                    <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">Populaire</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-600">8 000 FCFA/m</span>
                </div>
                <p className="text-xs text-stone-500">Tables illimitées, 3D interactive, analytics avancés, support 7j/7.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Réception des paiements Mobile Money */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-4 flex items-center gap-2 pb-2 border-b border-stone-100">
              <FaIcon name="fa-solid fa-money-bill-transfer" />
              <span>4. Réception des paiements Mobile Money</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Opérateur principal</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomoProvider('MTN')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      momoProvider === 'MTN'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    MTN MoMo 🟡
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomoProvider('MOOV')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      momoProvider === 'MOOV'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Moov Money 🔵
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Numéro MoMo pour recevoir les fonds</label>
                <input
                  type="tel"
                  placeholder="Ex: +229 97 00 11 22"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaIcon name="fa-solid fa-spinner" className="animate-spin" />
                <span>Création de votre restaurant en cours...</span>
              </>
            ) : (
              <>
                <FaIcon name="fa-solid fa-rocket" />
                <span>Créer mon restaurant et ouvrir mon Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
