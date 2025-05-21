
// // src/pages/EmployerApp.jsx
// import { useState, useEffect } from "react";
// import { auth, db } from "../firebase";
// import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import logo from '../assets/domlogo.png';

// export default function EmployerApp() {
//   const [products, setProducts] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [newProduct, setNewProduct] = useState({ name: "", quantity: "" });
//   const navigate = useNavigate();

//   const productsCollection = collection(db, "products");
//   const salesCollection = collection(db, "sales");

//   // Charger les produits depuis Firestore
//   const loadProducts = async () => {
//     const snapshot = await getDocs(productsCollection);
//     const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setProducts(loaded);
//   };

//   // Charger les ventes depuis Firestore
//   const loadSales = async () => {
//     const snapshot = await getDocs(salesCollection);
//     const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setSales(loaded);
//   };

//   useEffect(() => {
//     loadProducts();
//     loadSales();
//   }, []);

//   // Ajouter un produit dans Firestore
//   const handleAddProduct = async () => {
//     if (!newProduct.name || !newProduct.quantity) return;
//     await addDoc(productsCollection, {
//       name: newProduct.name,
//       quantity: parseInt(newProduct.quantity),
//     });
//     setNewProduct({ name: "", quantity: "" });
//     loadProducts();
//   };

//   // Vendre un produit : diminuer quantité + ajouter vente
//   const handleSale = async (id) => {
//     const productDoc = doc(db, "products", id);
//     const product = products.find(p => p.id === id);
//     if (!product || product.quantity <= 0) return;

//     // Met à jour la quantité
//     await updateDoc(productDoc, { quantity: product.quantity - 1 });

//     // Ajoute une vente
//     await addDoc(salesCollection, {
//       name: product.name,
//       time: new Date().toLocaleString(),
//     });

//     loadProducts();
//     loadSales();
//   };

//   // Supprimer un produit
//   const handleDeleteProduct = async (id) => {
//     const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
//     if (confirmed) {
//       await deleteDoc(doc(db, "products", id));
//       loadProducts();
//     }
//   };

//   // Déconnexion
//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-300 p-4 pt-[5rem]">
//       <div className="flex flex-col items-center justify-center">
//         <img className="w-20 h-20 rounded-full mb-4" src={logo} alt="dom logo" />
//         <h1 className="text-3xl font-bold text-center mb-4">DomseShop - Employé</h1>
//         <button
//           onClick={handleLogout}
//           className="mb-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//         >
//           Se déconnecter
//         </button>
//       </div>

//       <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-6">
//         <h2 className="text-xl font-semibold mb-2">Ajouter un produit</h2>
//         <input
//           type="text"
//           placeholder="Nom du produit"
//           value={newProduct.name}
//           onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//         />
//         <input
//           type="number"
//           placeholder="Quantité"
//           value={newProduct.quantity}
//           onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//         />
//         <button
//           onClick={handleAddProduct}
//           className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
//         >
//           Ajouter
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
//         {products.map((product) => (
//           <div key={product.id} className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold">{product.name}</h3>
//             <p className="text-gray-700">Stock : {product.quantity}</p>
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={() => handleSale(product.id)}
//                 className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 disabled:opacity-50"
//                 disabled={product.quantity === 0}
//               >
//                 Vendre
//               </button>
//               <button
//                 onClick={() => handleDeleteProduct(product.id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
//               >
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-10 bg-white p-4 rounded shadow max-w-3xl mx-auto">
//         <h2 className="text-xl font-bold mb-2">Historique des ventes</h2>
//         {sales.length === 0 ? (
//           <p className="text-gray-600">Aucune vente enregistrée.</p>
//         ) : (
//           <ul className="list-disc pl-5 space-y-1">
//             {sales.map((sale, index) => (
//               <li key={index}>
//                 {sale.name} vendu le {sale.time}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


















// src/pages/EmployerApp.jsx
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/domlogo.png";

export default function EmployerApp() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "" });
  const navigate = useNavigate();

  const productsCollection = collection(db, "products");
  const salesCollection = collection(db, "sales");
  const logsCollection = collection(db, "logs"); // 📌 Nouvelle collection

  const loadProducts = async () => {
    const snapshot = await getDocs(productsCollection);
    const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(loaded);
  };

  const loadSales = async () => {
    const snapshot = await getDocs(salesCollection);
    const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSales(loaded);
  };

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  // 📌 Fonction pour enregistrer une action dans les logs
  const logAction = async (type, message) => {
    await addDoc(logsCollection, {
      type,
      message,
      time: new Date().toLocaleString(),
      user: "employé"
    });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.quantity) return;
    await addDoc(productsCollection, {
      name: newProduct.name,
      quantity: parseInt(newProduct.quantity),
    });
    await logAction("ajout", `Ajout du produit "${newProduct.name}" (${newProduct.quantity})`);
    setNewProduct({ name: "", quantity: "" });
    loadProducts();
  };

  const handleSale = async (id) => {
    const productDoc = doc(db, "products", id);
    const product = products.find((p) => p.id === id);
    if (!product || product.quantity <= 0) return;

    await updateDoc(productDoc, { quantity: product.quantity - 1 });

    await addDoc(salesCollection, {
      name: product.name,
      time: new Date().toLocaleString(),
    });

    await logAction("vente", `Vente d'un "${product.name}" - stock restant : ${product.quantity - 1}`);

    loadProducts();
    loadSales();
  };

  const handleDeleteProduct = async (id) => {
    const product = products.find((p) => p.id === id);
    const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
    if (confirmed) {
      await deleteDoc(doc(db, "products", id));
      await logAction("suppression", `Suppression du produit "${product.name}"`);
      loadProducts();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4 pt-[5rem]">
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20 rounded-full mb-4" src={logo} alt="dom logo" />
        <h1 className="text-3xl font-bold text-center mb-4">DomseShop - Employé</h1>
        <button
          onClick={handleLogout}
          className="mb-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Se déconnecter
        </button>
      </div>

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Stock : {product.quantity}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSale(product.id)}
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

