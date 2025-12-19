






import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const ROLE_REDIRECT = {
  boss: "/dashboard-boss",
  employee: "/app",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      // 1️⃣ Auth Firebase
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Récupération du rôle
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("Profil utilisateur introuvable.");
        return;
      }

      const { role } = userDoc.data();

      // 3️⃣ Redirection sécurisée
      const redirectPath = ROLE_REDIRECT[role];

      if (!redirectPath) {
        setError("Rôle non reconnu. Contactez l’administrateur.");
        return;
      }

      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-email":
          setError("Adresse e-mail invalide.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Email ou mot de passe incorrect.");
          break;
        case "auth/too-many-requests":
          setError("Trop de tentatives. Réessayez plus tard.");
          break;
        default:
          setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300 px-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Bienvenue Chez DomseShop
      </h2>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Connexion
        </h2>

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
            disabled={loading}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
