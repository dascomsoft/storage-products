// import { useState } from 'react';
// import { auth, db } from '../firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom';

// const bossPhone = "694124189";

// export default function Signup() {
//   const [data, setData] = useState({
//     name: '',
//     surname: '',
//     phone: '',
//     password: '',
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e?.preventDefault();
//     if (loading) return;

//     setError('');

//     if (!data.name || !data.surname || !data.phone || !data.password) {
//       setError("Veuillez remplir tous les champs.");
//       return;
//     }

//     if (data.password.length < 6) {
//       setError("Le mot de passe doit contenir au moins 6 caractères.");
//       return;
//     }

//     const email = `${data.phone}@domshop.com`;

//     try {
//       setLoading(true);

//       const res = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         data.password
//       );

//       const role = data.phone === bossPhone ? 'boss' : 'employee';

//       await setDoc(doc(db, 'users', res.user.uid), {
//         name: data.name,
//         surname: data.surname,
//         phone: data.phone,
//         role,
//         createdAt: new Date(),
//       });

//       navigate(role === 'boss' ? '/dashboard-boss' : '/app');

//     } catch (err) {
//       console.error(err);

//       if (err.code === 'auth/email-already-in-use') {
//         setError("Ce numéro de téléphone est déjà utilisé.");
//       } else {
//         setError("Erreur d'inscription. Veuillez vérifier vos informations.");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
//       <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//         Bienvenue Chez DomseShop
//       </h2>

//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//           Créer un compte
//         </h2>

//         {error && (
//           <p className="text-red-500 text-sm mb-4 text-center">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSignup}>
//           {['name', 'surname', 'phone', 'password'].map((field, i) => (
//             <div className="mb-4" key={i}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {field === 'name' && 'Nom'}
//                 {field === 'surname' && 'Prénom'}
//                 {field === 'phone' && 'Téléphone'}
//                 {field === 'password' && 'Mot de passe'}
//               </label>

//               <input
//                 type={field === 'password' ? 'password' : 'text'}
//                 disabled={loading}
//                 onChange={e =>
//                   setData({ ...data, [field]: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60"
//               />
//             </div>
//           ))}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Inscription...
//               </>
//             ) : (
//               "S'inscrire"
//             )}
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-600 mt-4">
//           Déjà un compte ?{' '}
//           <Link to="/login" className="text-green-600 hover:underline font-medium">
//             Connectez-vous ici
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }












































import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const bossPhone = "694124189";

// 🎨 Classe input UNIQUE (évite les bugs de style navigateur)
const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 " +
  "disabled:opacity-60";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    // ✅ Validation simple
    if (!data.name || !data.surname || !data.phone || !data.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (data.password.length < 6) {
      setError("Mot de passe minimum : 6 caractères.");
      return;
    }

    const email = `${data.phone}@domshop.com`;

    try {
      setLoading(true);

      // 1️⃣ Création compte Firebase
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        data.password
      );

      // 2️⃣ Attribution du rôle
      const role = data.phone === bossPhone ? "boss" : "employee";

      // 3️⃣ Sauvegarde Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        role,
        createdAt: new Date(),
      });

      // 4️⃣ Déconnexion volontaire
      await signOut(auth);

      // 5️⃣ Retour LOGIN
      navigate("/login", { replace: true });

    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Ce numéro de téléphone est déjà utilisé.");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Créer un compte
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            disabled={loading}
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Prénom"
            disabled={loading}
            onChange={(e) =>
              setData({ ...data, surname: e.target.value })
            }
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Téléphone"
            disabled={loading}
            onChange={(e) =>
              setData({ ...data, phone: e.target.value })
            }
            className={inputClass}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            disabled={loading}
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
            className={inputClass}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md
                       hover:bg-green-700 disabled:bg-green-400
                       disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
