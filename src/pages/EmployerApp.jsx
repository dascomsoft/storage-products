
// // src/pages/EmployerApp.jsx
// import { useState, useEffect } from "react";
// import { auth, db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc
// } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/domlogo.png";

// export default function EmployerApp() {
//   const [products, setProducts] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [newProduct, setNewProduct] = useState({ name: "", quantity: "" });
//   const navigate = useNavigate();

//   const productsCollection = collection(db, "products");
//   const salesCollection = collection(db, "sales");
//   const logsCollection = collection(db, "logs"); // 📌 Nouvelle collection

//   const loadProducts = async () => {
//     const snapshot = await getDocs(productsCollection);
//     const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setProducts(loaded);
//   };

//   const loadSales = async () => {
//     const snapshot = await getDocs(salesCollection);
//     const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setSales(loaded);
//   };

//   useEffect(() => {
//     loadProducts();
//     loadSales();
//   }, []);

//   // 📌 Fonction pour enregistrer une action dans les logs
//   const logAction = async (type, message) => {
//     await addDoc(logsCollection, {
//       type,
//       message,
//       time: new Date().toLocaleString(),
//       user: "employé"
//     });
//   };

//   const handleAddProduct = async () => {
//     if (!newProduct.name || !newProduct.quantity) return;
//     await addDoc(productsCollection, {
//       name: newProduct.name,
//       quantity: parseInt(newProduct.quantity),
//     });
//     await logAction("ajout", `Ajout du produit "${newProduct.name}" (${newProduct.quantity})`);
//     setNewProduct({ name: "", quantity: "" });
//     loadProducts();
//   };

//   const handleSale = async (id) => {
//     const productDoc = doc(db, "products", id);
//     const product = products.find((p) => p.id === id);
//     if (!product || product.quantity <= 0) return;

//     await updateDoc(productDoc, { quantity: product.quantity - 1 });

//     await addDoc(salesCollection, {
//       name: product.name,
//       time: new Date().toLocaleString(),
//     });

//     await logAction("vente", `Vente d'un "${product.name}" - stock restant : ${product.quantity - 1}`);

//     loadProducts();
//     loadSales();
//   };

//   const handleDeleteProduct = async (id) => {
//     const product = products.find((p) => p.id === id);
//     const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
//     if (confirmed) {
//       await deleteDoc(doc(db, "products", id));
//       await logAction("suppression", `Suppression du produit "${product.name}"`);
//       loadProducts();
//     }
//   };

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
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/domlogo.png";
import SaleModal from "../components/SaleModal"; // AJOUTER CET IMPORT

export default function EmployerApp() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    quantity: "", 
    price: "" // AJOUTER price
  });
  
  // ÉTATS POUR LE MODAL DE VENTE
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [productToSell, setProductToSell] = useState(null);
  
  const navigate = useNavigate();

  const productsCollection = collection(db, "products");
  const salesCollection = collection(db, "sales");
  const logsCollection = collection(db, "logs");

  // Charger les produits en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        price: doc.data().price || 0
      }));
      setProducts(loaded);
    });

    return () => unsubscribe();
  }, []);

  // Charger les ventes
  const loadSales = async () => {
    const snapshot = await getDocs(salesCollection);
    const loaded = snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    setSales(loaded);
  };

  useEffect(() => {
    loadSales();
  }, []);

  // Fonction pour enregistrer une action dans les logs
  const logAction = async (type, message) => {
    try {
      await addDoc(logsCollection, {
        type,
        message,
        time: new Date().toLocaleString('fr-FR'),
        user: "employé"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du log:", error);
    }
  };

  // MODIFIER CETTE FONCTION : Ajouter un produit avec prix
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.price) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await addDoc(productsCollection, {
        name: newProduct.name,
        quantity: parseInt(newProduct.quantity),
        price: parseInt(newProduct.price), // AJOUTER
        createdAt: serverTimestamp(),
      });

      await logAction("ajout", `Ajout du produit "${newProduct.name}" (${newProduct.quantity} unités, ${newProduct.price} FCFA)`);
      
      setNewProduct({ name: "", quantity: "", price: "" });
      
      alert("✅ Produit ajouté avec succès!");
      
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("❌ Erreur lors de l'ajout du produit");
    }
  };

  // MODIFIER CETTE FONCTION : Ouvrir modal au lieu de vendre directement
  const handleSaleClick = (product) => {
    setProductToSell(product);
    setSaleModalOpen(true);
  };

  // NOUVELLE FONCTION : Gérer la confirmation de vente avec prix
  const handleConfirmSale = async (saleData) => {
    try {
      // 1. Mettre à jour le stock
      const productRef = doc(db, "products", saleData.productId);
      const newQuantity = productToSell.quantity - saleData.quantity;
      
      await updateDoc(productRef, { 
        quantity: newQuantity 
      });

      // 2. Créer la vente avec TOUS les détails
      const saleRecord = {
        productId: saleData.productId,
        productName: saleData.productName,
        soldPrice: saleData.soldPrice,
        referencePrice: saleData.referencePrice,
        quantity: saleData.quantity,
        total: saleData.total,
        discount: saleData.discount,
        customerType: saleData.customerType,
        paymentMethod: saleData.paymentMethod,
        seller: "employé",
        timestamp: saleData.timestamp,
        date: saleData.date,
        month: saleData.month,
        year: saleData.year,
        shop: "cameroon_shop_1"
      };

      await addDoc(salesCollection, saleRecord);

      // 3. Enregistrer dans les logs
      await logAction(
        "vente", 
        `Vente de ${saleData.quantity}x "${saleData.productName}" à ${saleData.soldPrice.toLocaleString()} FCFA (Total: ${saleData.total.toLocaleString()} FCFA)`
      );

      // 4. Mettre à jour l'état local
      setProducts(prev => prev.map(p => 
        p.id === saleData.productId 
          ? { ...p, quantity: newQuantity }
          : p
      ));
      
      // 5. Ajouter aux ventes affichées
      setSales(prev => [...prev, saleRecord]);
      
      alert(`✅ Vente enregistrée : ${saleData.quantity}x ${saleData.productName} à ${saleData.soldPrice.toLocaleString()} FCFA`);
      
      // 6. Fermer le modal
      setSaleModalOpen(false);
      
    } catch (error) {
      console.error("Erreur lors de la vente:", error);
      alert("❌ Erreur lors de l'enregistrement de la vente");
    }
  };

  // Supprimer un produit (inchangé)
  const handleDeleteProduct = async (id) => {
    const product = products.find((p) => p.id === id);
    const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ce produit ?");
    
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "products", id));
        await logAction("suppression", `Suppression du produit "${product.name}"`);
        
        // Mettre à jour l'état local
        setProducts(prev => prev.filter(p => p.id !== id));
        
        alert("✅ Produit supprimé avec succès!");
        
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("❌ Erreur lors de la suppression");
      }
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Navigation vers les statistiques
  const handleGoToStatistics = () => {
    navigate("/statistics");
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4 pt-[5rem]">
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20 rounded-full mb-4" src={logo} alt="dom logo" />
        <h1 className="text-3xl font-bold text-center mb-4">DomseShop - Employé</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Se déconnecter
          </button>
          <button
            onClick={handleGoToStatistics}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
          >
            📊 Statistiques
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout de produit MODIFIÉ */}
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
          placeholder="Prix (FCFA)"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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

      {/* Liste des produits MODIFIÉE */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Prix : {product.price?.toLocaleString() || "0"} FCFA</p>
            <p className="text-gray-700">Stock : {product.quantity}</p>
            <div className="flex gap-2 mt-2">
              {/* MODIFIER CE BOUTON */}
              <button
                onClick={() => handleSaleClick(product)}
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

      {/* Historique des ventes MODIFIÉ */}
      <div className="mt-10 bg-white p-4 rounded shadow max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historique des ventes récentes</h2>
          <button
            onClick={handleGoToStatistics}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Voir toutes les statistiques →
          </button>
        </div>
        {sales.length === 0 ? (
          <p className="text-gray-600">Aucune vente enregistrée.</p>
        ) : (
          <ul className="space-y-2">
            {sales.slice(0, 10).map((sale, index) => (
              <li key={index} className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">{sale.productName || sale.name}</span>
                  <span className="text-green-600 font-bold">
                    {sale.total?.toLocaleString() || sale.soldPrice?.toLocaleString() || "0"} FCFA
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {sale.quantity || 1}x à {sale.soldPrice?.toLocaleString() || "?"} FCFA • {sale.timestamp}
                  {sale.discount > 0 && (
                    <span className="text-red-500 ml-2">
                      (Réduction: -{sale.discount?.toLocaleString()} FCFA)
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODAL DE VENTE */}
      {saleModalOpen && (
        <SaleModal
          product={productToSell}
          isOpen={saleModalOpen}
          onClose={() => setSaleModalOpen(false)}
          onConfirmSale={handleConfirmSale}
        />
      )}
    </div>
  );
}