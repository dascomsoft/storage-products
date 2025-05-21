// import { useState, useEffect } from "react";
// import logo from './assets/domlogo.png';

// export default function App() {
//     const [products, setProducts] = useState([]);
//     const [sales, setSales] = useState([]);
//     const [newProduct, setNewProduct] = useState({ name: "", quantity: "" });

//     // Charger les données depuis localStorage au démarrage
//     useEffect(() => {
//         const storedProducts = JSON.parse(localStorage.getItem("dom_products")) || [];
//         const storedSales = JSON.parse(localStorage.getItem("dom_sales")) || [];
//         setProducts(storedProducts);
//         setSales(storedSales);
//     }, []);

//     // Sauvegarder les produits dans localStorage quand ils changent
//     useEffect(() => {
//         localStorage.setItem("dom_products", JSON.stringify(products));
//     }, [products]);

//     // Sauvegarder les ventes dans localStorage quand elles changent
//     useEffect(() => {
//         localStorage.setItem("dom_sales", JSON.stringify(sales));
//     }, [sales]);

//     const handleAddProduct = () => {
//         if (!newProduct.name || !newProduct.quantity) return;
//         const newId = Date.now(); // identifiant unique basé sur le temps
//         setProducts([...products, { id: newId, name: newProduct.name, quantity: parseInt(newProduct.quantity) }]);
//         setNewProduct({ name: "", quantity: "" });
//     };

//     const handleSale = (id) => {
//         const updatedProducts = products.map((product) => {
//             if (product.id === id && product.quantity > 0) {
//                 const updated = { ...product, quantity: product.quantity - 1 };
//                 setSales([...sales, { name: product.name, time: new Date().toLocaleString() }]);
//                 return updated;
//             }
//             return product;
//         });
//         setProducts(updatedProducts);
//     };

//     const handleDeleteProduct = (id) => {
//         const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
//         if (confirmed) {
//             const updated = products.filter(product => product.id !== id);
//             setProducts(updated);
//         }
//     };

//     return (
//         <div className="">
//             <div className="min-h-screen bg-gray-300 p-4 pt-[5rem]">
//                 <div className="flex flex-col items-center justify-center">
//                     <img className="w-20 h-20 rounded-full mb-4" src={logo} alt='dom logo' />
//                     <h1 className="text-3xl font-bold text-center mb-4">DomShop</h1>
//                 </div>

//                 {/* Formulaire d'ajout de produit */}
//                 <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-6">
//                     <h2 className="text-xl font-semibold mb-2">Ajouter un produit</h2>
//                     <input
//                         type="text"
//                         placeholder="Nom du produit"
//                         value={newProduct.name}
//                         onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                         className="w-full p-2 mb-2 border rounded"
//                     />
//                     <input
//                         type="number"
//                         placeholder="Quantité"
//                         value={newProduct.quantity}
//                         onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
//                         className="w-full p-2 mb-2 border rounded"
//                     />
//                     <button
//                         onClick={handleAddProduct}
//                         className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
//                     >
//                         Ajouter
//                     </button>
//                 </div>

//                 {/* Liste des produits */}
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {products.map((product) => (
//                         <div key={product.id} className="bg-white p-4 rounded shadow">
//                             <h3 className="text-lg font-semibold">{product.name}</h3>
//                             <p className="text-gray-700">Stock : {product.quantity}</p>
//                             <div className="flex gap-2 mt-2">
//                                 <button
//                                     onClick={() => handleSale(product.id)}
//                                     className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 disabled:opacity-50"
//                                     disabled={product.quantity === 0}
//                                 >
//                                     Vendre
//                                 </button>
//                                 <button
//                                     onClick={() => handleDeleteProduct(product.id)}
//                                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
//                                 >
//                                     Supprimer
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Historique des ventes */}
//                 <div className="mt-10 bg-white p-4 rounded shadow max-w-3xl mx-auto">
//                     <h2 className="text-xl font-bold mb-2">Historique des ventes</h2>
//                     {sales.length === 0 ? (
//                         <p className="text-gray-600">Aucune vente enregistrée.</p>
//                     ) : (
//                         <ul className="list-disc pl-5 space-y-1">
//                             {sales.map((sale, index) => (
//                                 <li key={index}>
//                                     {sale.name} vendu le {sale.time}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

































// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmployerApp from "./pages/EmployerApp"; // nom de ta page employé
import DashboardBoss from "./pages/DashboardBoss"; // patron

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<EmployerApp />} />
        <Route path="/dashboard-boss" element={<DashboardBoss />} />
      </Routes>
    </Router>
  );
}

