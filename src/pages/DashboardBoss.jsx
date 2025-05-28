


import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/domlogo.png";

export default function DashboardBoss() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({ name: "", quantity: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const productsCollection = collection(db, "products");
  const salesCollection = collection(db, "sales");

  // Temps réel : charger les produits
  useEffect(() => {
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    });

    return () => unsubscribe(); // Nettoyage
  }, []);

  // Charger les ventes une seule fois
  useEffect(() => {
    const loadSales = async () => {
      const snapshot = await getDocs(salesCollection);
      const list = snapshot.docs.map((doc) => doc.data());
      setSales(list);
    };
    loadSales();
  }, []);

  // Ajouter un produit
  const handleAddProduct = async () => {
    if (!formData.name || !formData.quantity) return;

    await addDoc(productsCollection, {
      name: formData.name,
      quantity: parseInt(formData.quantity),
      createdAt: serverTimestamp(),
    });

    setFormData({ name: "", quantity: "" });
  };

  // Modifier un produit
  const handleEditProduct = async () => {
    if (!formData.name || !formData.quantity) return;

    const productRef = doc(db, "products", editingProduct);
    await updateDoc(productRef, {
      name: formData.name,
      quantity: parseInt(formData.quantity),
    });

    setEditingProduct(null);
    setFormData({ name: "", quantity: "" });
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ name: product.name, quantity: product.quantity.toString() });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: "", quantity: "" });
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm("Supprimer ce produit ?");
    if (confirmed) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  // Vendre un produit
  const handleSale = async (product) => {
    if (product.quantity <= 0) return;

    const productRef = doc(db, "products", product.id);
    const now = new Date().toLocaleString();

    try {
      await updateDoc(productRef, {
        quantity: product.quantity - 1,
      });

      await addDoc(salesCollection, {
        name: product.name,
        time: now,
      });

      setSales((prev) => [...prev, { name: product.name, time: now }]);
    } catch (error) {
      console.error("Erreur lors de la vente :", error);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-[5rem]">
      <div className="flex flex-col items-center justify-center mb-6">
        <img src={logo} className="w-20 h-20 rounded-full mb-4" alt="logo" />
        <h1 className="text-3xl font-bold mb-2">DomseShop - Patron</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>

      {/* Formulaire */}
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingProduct ? "Modifier un produit" : "Ajouter un produit"}
        </h2>
        <input
          type="text"
          placeholder="Nom du produit"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantité"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />

        {editingProduct ? (
          <div className="flex gap-2">
            <button
              onClick={handleEditProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Enregistrer
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 w-full"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Ajouter
          </button>
        )}
      </div>

      {/* Liste des produits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Stock : {product.quantity}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => handleSale(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={product.quantity === 0}
              >
                Vendre
              </button>
              <button
                onClick={() => startEdit(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historique des ventes */}
      <div className="mt-10 bg-white p-4 rounded shadow max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Historique des ventes</h2>
        {sales.length === 0 ? (
          <p className="text-gray-600">Aucune vente enregistrée.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {sales.map((sale, index) => (
              <li key={index}>
                {sale.name} vendu le {sale.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



















