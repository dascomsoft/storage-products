


import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const bossPhone = "694124189"; // Remplace par le numéro exact du boss

export default function Signup() {
  const [data, setData] = useState({
    name: '',
    surname: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!data.name || !data.surname || !data.phone || !data.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (data.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const email = `${data.phone}@domshop.com`; // Email simulé

    try {
      // Tentative de création du compte
      const res = await createUserWithEmailAndPassword(auth, email, data.password);

      const role = data.phone === bossPhone ? 'boss' : 'employee';

      await setDoc(doc(db, 'users', res.user.uid), {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        role,
      });

      navigate(role === 'boss' ? '/dashboard-boss' : '/app');
    } catch (err) {
      // Gestion des erreurs Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError("Numéro de téléphone déjà utilisé ayant généré une adresse email.");
      } else {
        setError("Erreur d'inscription. Veuillez vérifier vos informations.");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex-col flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Bienvenue Chez DomseShop</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Créer un compte</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            onChange={e => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            placeholder="Entrez votre prénom"
            onChange={e => setData({ ...data, surname: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="text"
            placeholder="Numéro de téléphone"
            onChange={e => setData({ ...data, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            placeholder="Créez un mot de passe"
            onChange={e => setData({ ...data, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          S'inscrire
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}
