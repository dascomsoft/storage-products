

// import { useState } from "react";
// import { auth, db } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";

// const bossPhone = "694124189";

// // 🎨 Classe input UNIQUE (évite les bugs de style navigateur)
// const inputClass =
//   "w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 " +
//   "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 " +
//   "disabled:opacity-60";

// export default function Signup() {
//   const [data, setData] = useState({
//     name: "",
//     surname: "",
//     phone: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setError("");

//     // ✅ Validation simple
//     if (!data.name || !data.surname || !data.phone || !data.password) {
//       setError("Veuillez remplir tous les champs.");
//       return;
//     }

//     if (data.password.length < 6) {
//       setError("Mot de passe minimum : 6 caractères.");
//       return;
//     }

//     const email = `${data.phone}@domshop.com`;

//     try {
//       setLoading(true);

//       // 1️⃣ Création compte Firebase
//       const res = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         data.password
//       );

//       // 2️⃣ Attribution du rôle
//       const role = data.phone === bossPhone ? "boss" : "employee";

//       // 3️⃣ Sauvegarde Firestore
//       await setDoc(doc(db, "users", res.user.uid), {
//         name: data.name,
//         surname: data.surname,
//         phone: data.phone,
//         role,
//         createdAt: new Date(),
//       });

//       // 4️⃣ Déconnexion volontaire
//       await signOut(auth);

//       // 5️⃣ Retour LOGIN
//       navigate("/login", { replace: true });

//     } catch (err) {
//       console.error(err);
//       if (err.code === "auth/email-already-in-use") {
//         setError("Ce numéro de téléphone est déjà utilisé.");
//       } else {
//         setError("Erreur lors de l'inscription.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           Créer un compte
//         </h2>

//         {error && (
//           <p className="text-red-500 text-sm text-center mb-4">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSignup} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Nom"
//             disabled={loading}
//             onChange={(e) =>
//               setData({ ...data, name: e.target.value })
//             }
//             className={inputClass}
//           />

//           <input
//             type="text"
//             placeholder="Prénom"
//             disabled={loading}
//             onChange={(e) =>
//               setData({ ...data, surname: e.target.value })
//             }
//             className={inputClass}
//           />

//           <input
//             type="text"
//             placeholder="Téléphone"
//             disabled={loading}
//             onChange={(e) =>
//               setData({ ...data, phone: e.target.value })
//             }
//             className={inputClass}
//           />

//           <input
//             type="password"
//             placeholder="Mot de passe"
//             disabled={loading}
//             onChange={(e) =>
//               setData({ ...data, password: e.target.value })
//             }
//             className={inputClass}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2 rounded-md
//                        hover:bg-green-700 disabled:bg-green-400
//                        disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? "Création..." : "S'inscrire"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-sm text-gray-600">
//           Déjà un compte ?{" "}
//           <Link
//             to="/login"
//             className="text-green-600 hover:underline font-medium"
//           >
//             Connexion
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

// 🎨 Classe input UNIQUE
const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 " +
  "disabled:opacity-60";

// 🎨 Composant Modal de confirmation
function ConfirmationModal({ email, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inscription réussie ! ✅
          </h3>
          
          <p className="text-gray-600 mb-4">
            Votre compte a été créé avec succès. Voici vos informations de connexion :
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500 mb-1">Votre email de connexion :</p>
            <p className="text-lg font-mono text-blue-600 break-all">
              {email}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              ⚠️ Notez bien cet email, vous en aurez besoin pour vous connecter
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-2 rounded-md
                       hover:bg-green-700 transition-colors font-medium"
            >
              Continuer vers la connexion
            </button>
            
            <button
              onClick={() => {
                // Copier l'email dans le presse-papier
                navigator.clipboard.writeText(email);
                alert("Email copié dans le presse-papier !");
              }}
              className="w-full border border-green-600 text-green-600 py-2 rounded-md
                       hover:bg-green-50 transition-colors text-sm"
            >
              📋 Copier l'email
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            <strong>Rappel :</strong> Votre mot de passe est celui que vous venez de choisir.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");

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

    // Nettoyer le numéro de téléphone (enlever espaces, +, etc.)
    const cleanPhone = data.phone.replace(/\s+/g, '').replace(/^\+/, '');
    const email = `${cleanPhone}@domshop.com`;

    try {
      setLoading(true);

      // 1️⃣ Création compte Firebase
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        data.password
      );

      // 2️⃣ Attribution du rôle
      const role = cleanPhone === bossPhone ? "boss" : "employee";

      // 3️⃣ Sauvegarde Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        name: data.name,
        surname: data.surname,
        phone: cleanPhone,
        role,
        createdAt: new Date(),
      });

      // 4️⃣ Stocker l'email généré pour l'affichage
      setGeneratedEmail(email);

      // 5️⃣ Déconnexion volontaire (sécurité)
      await signOut(auth);

      // 6️⃣ Afficher la modal de confirmation
      setShowConfirmation(true);

    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Ce numéro de téléphone est déjà utilisé.");
      } else if (err.code === "auth/invalid-email") {
        setError("Numéro de téléphone invalide.");
      } else {
        setError("Erreur lors de l'inscription : " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowConfirmation(false);
    // Rediriger vers la page de login
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Créer un compte
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Inscrivez-vous pour accéder à votre espace personnel
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              placeholder="Votre nom"
              disabled={loading}
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              placeholder="Votre prénom"
              disabled={loading}
              value={data.surname}
              onChange={(e) =>
                setData({ ...data, surname: e.target.value })
              }
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              placeholder="Ex: 694124189"
              disabled={loading}
              value={data.phone}
              onChange={(e) =>
                setData({ ...data, phone: e.target.value })
              }
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce numéro servira à créer votre identifiant de connexion
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              disabled={loading}
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              className={inputClass}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-md
                       hover:bg-green-700 disabled:bg-green-400
                       disabled:cursor-not-allowed flex items-center justify-center
                       font-medium transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Création en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Se connecter
          </Link>
        </p>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <ConfirmationModal 
          email={generatedEmail} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}