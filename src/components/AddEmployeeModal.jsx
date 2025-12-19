// src/components/AddEmployeeModal.jsx
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setError("");

    if (!formData.name || !formData.surname || !formData.phone || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '').replace(/^\+/, '');
    const email = `${cleanPhone}@domshop.com`;

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, formData.password);

      await setDoc(doc(db, "users", res.user.uid), {
        name: formData.name,
        surname: formData.surname,
        phone: cleanPhone,
        role: "employee",
        createdAt: new Date(),
        status: "active",
        tempPassword: formData.password,
      });

      setCreatedEmployee({
        name: formData.name,
        surname: formData.surname,
        phone: cleanPhone,
        tempPassword: formData.password,
        email: email
      });

      setFormData({ name: "", surname: "", phone: "", password: "" });
      setLoading(false);

    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Ce numéro est déjà utilisé");
      } else {
        setError("Erreur : " + err.message);
      }
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    setCreatedEmployee(null);
    onEmployeeAdded();
    onClose();
  };

  if (!isOpen) return null;

  // Étape 2 : Afficher les identifiants créés
  if (createdEmployee) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Employé créé avec succès !</h3>
            <p className="text-gray-600">
              Voici les identifiants pour <strong>{createdEmployee.name}</strong>
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email de connexion :</p>
                <p className="font-mono text-lg bg-white p-2 rounded border">
                  {createdEmployee.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mot de passe temporaire :</p>
                <p className="font-mono text-lg bg-white p-2 rounded border">
                  {createdEmployee.tempPassword}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Important :</strong> Donnez ces identifiants à l'employé en main propre ou par WhatsApp.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const message = `Bonjour ${createdEmployee.name},\n\nVotre compte DomShop a été créé.\n\n🔐 Vos identifiants :\nEmail: ${createdEmployee.email}\nMot de passe: ${createdEmployee.tempPassword}\n\n🌐 Connectez-vous : https://domshop.app\n\n⚠️ Changez votre mot de passe après la première connexion.`;
                navigator.clipboard.writeText(message);
                alert("✅ Message copié ! Vous pouvez l'envoyer par WhatsApp.");
              }}
              className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <p className="font-semibold">Copier pour WhatsApp</p>
                <p className="text-sm opacity-90">Copie le message avec identifiants</p>
              </div>
            </button>

            <button
              onClick={handleFinalClose}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Terminer
            </button>

            <button
              onClick={() => {
                setCreatedEmployee(null);
                setFormData({ name: "", surname: "", phone: "", password: "" });
              }}
              className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Ajouter un autre employé
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Étape 1 : Formulaire de création
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">👤 Ajouter un employé</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              placeholder="Nom de famille"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              placeholder="Prénom"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone *
            </label>
            <input
              type="tel"
              placeholder="Ex: 694124189"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              L'email sera : 694124189@domshop.com
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe temporaire *
            </label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              minLength="6"
            />
            <p className="text-xs text-gray-500 mt-1">
              L'employé pourra changer ce mot de passe
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Création...
                </>
              ) : (
                <>
                  <span>➕</span> Créer l'employé
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </form>

        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Information :</strong> Après création, vous recevrez les identifiants à donner à l'employé.
          </p>
        </div>
      </div>
    </div>
  );
}