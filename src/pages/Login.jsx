





// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom';
// import { useState } from 'react';

// export default function Login() {
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const email = `${phone}@domshop.com`;
//       const res = await signInWithEmailAndPassword(auth, email, password);
//       const docSnap = await getDoc(doc(db, 'users', res.user.uid));
//       const role = docSnap.data()?.role;
//       navigate(role === 'boss' ? '/dashboard' : '/app');
//     } catch (err) {
//       console.error(err);
//       setError('Identifiants incorrects. Veuillez réessayer.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Connexion à DomShop</h2>

//         {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Entrez votre numéro"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Entrez votre mot de passe"
//           />
//         </div>

//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//         >
//           Se connecter
//         </button>

//         <p className="text-sm text-center text-gray-600 mt-4">
//           Pas encore inscrit ?{' '}
//           <Link to="/signup" className="text-blue-600 hover:underline font-medium">
//             Créez un compte
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }






// src/pages/Login.jsx
import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupère le document utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("Utilisateur non trouvé.");
        return;
      }

      const role = userDoc.data().role;
      role === "boss" ? navigate("/dashboard-boss") : navigate("/app");

    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex-col flex items-center justify-center bg-gray-300 px-4">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Bienvenue Chez DomseShop</h2>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}

