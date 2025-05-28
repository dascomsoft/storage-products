

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

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("Utilisateur non trouvé.");
        return;
      }

      const role = userDoc.data().role;
      role === "boss" ? navigate("/dashboard-boss") : navigate("/app");

    } catch (err) {
      console.error(err);

      // Affiche l'erreur à l'écran selon le code Firebase
      switch (err.code) {
        case "auth/invalid-email":
          setError("Adresse e-mail invalide.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Email ou mot de passe incorrect.");
          break;
        default:
          setError("Une erreur est survenue. Veuillez réessayer.");
          break;
      }
    }
  };

  return (
    <div className="min-h-screen flex-col flex items-center justify-center bg-gray-300 px-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Bienvenue Chez DomseShop</h2>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

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
