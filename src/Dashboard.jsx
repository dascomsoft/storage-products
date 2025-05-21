import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import logo from "./assets/domlogo.png";

export default function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "" });

  const productsCollection = collection(db, "products");
  const salesCollection = collection(db, "sales");

  // Charger les données en temps réel
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(productsCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });

    const unsubscribeSales = onSnapshot(salesCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data());
      setSales(items);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSales();
    };
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.quantity) return;

    await addDoc(productsCollection, {
      name: newProduct.name,
      quantity: parseInt(newProduct.quantity)
    });

    setNewProduct({ name: "", quantity: "" });
  };

  const handleSale = async (id, name, quantity) => {
    if (quantity <= 0) return;

    const productRef = doc(db, "products", id);

    await updateDoc(productRef, {
      quantity: quantity - 1
    });

    await addDoc(salesCollection, {
      name,
      time: new Date().toLocaleString()
    });
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
    if (!confirmed) return;

    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4 pt-[5rem]">
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20 rounded-full mb-4" src={logo} alt='dom logo' />
        <h1 className="text-3xl font-bold text-center mb-4">DomShop (Dashboard)</h1>
      </div>

      {/* Formulaire d'ajout de produit */}
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-2">Ajouter un produit</h2>
        <input
          type="text"
          placeholder="Nom du produit"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantité"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des produits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Stock : {product.quantity}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSale(product.id, product.name, product.quantity)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 disabled:opacity-50"
                disabled={product.quantity === 0}
              >
                Vendre
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
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
