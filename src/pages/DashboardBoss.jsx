// src/pages/DashboardBoss.jsx
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
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/domlogo.png";
import SaleModal from "../components/SaleModal";
import AddEmployeeModal from "../components/AddEmployeeModal";

export default function DashboardBoss() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", quantity: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [productToSell, setProductToSell] = useState(null);
  
  const navigate = useNavigate();

  const productsCollection = collection(db, "products");
  const salesCollection = collection(db, "sales");
  const usersCollection = collection(db, "users");

  // Charger les produits en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        price: doc.data().price || 0
      }));
      setProducts(list);
    });
    return () => unsubscribe();
  }, []);

  // Charger les ventes
  useEffect(() => {
    const loadSales = async () => {
      const snapshot = await getDocs(salesCollection);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSales(list);
    };
    loadSales();
  }, []);

  // Charger les employés
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const q = query(usersCollection, where("role", "==", "employee"));
        const snapshot = await getDocs(q);
        const employeesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesList);
      } catch (error) {
        console.error("Erreur chargement employés:", error);
      }
    };
    loadEmployees();
  }, []);

  // Ajouter un produit
  const handleAddProduct = async () => {
    if (!formData.name || !formData.quantity || !formData.price) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await addDoc(productsCollection, {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        price: parseInt(formData.price),
        createdAt: serverTimestamp(),
      });

      setFormData({ name: "", quantity: "", price: "" });
      alert("✅ Produit ajouté avec succès");
    } catch (error) {
      console.error("Erreur ajout produit:", error);
      alert("❌ Erreur lors de l'ajout du produit");
    }
  };

  // Modifier un produit
  const handleEditProduct = async () => {
    if (!formData.name || !formData.quantity || !formData.price) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const productRef = doc(db, "products", editingProduct);
      await updateDoc(productRef, {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        price: parseInt(formData.price),
        updatedAt: serverTimestamp(),
      });

      setEditingProduct(null);
      setFormData({ name: "", quantity: "", price: "" });
      alert("✅ Produit modifié avec succès");
    } catch (error) {
      console.error("Erreur modification produit:", error);
      alert("❌ Erreur lors de la modification du produit");
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id, name) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      alert("✅ Produit supprimé avec succès");
    } catch (error) {
      console.error("Erreur suppression produit:", error);
      alert("❌ Erreur lors de la suppression du produit");
    }
  };

  // Supprimer un employé
  const handleDeleteEmployee = async (employeeId, employeeName) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'employé "${employeeName}" ?\n\nAttention : Cette action est irréversible.`
    );
    
    if (!confirmed) return;

    try {
      const employeeRef = doc(db, "users", employeeId);
      await updateDoc(employeeRef, {
        status: "inactive",
        deletedAt: serverTimestamp(),
      });
      
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      alert(`✅ Employé "${employeeName}" désactivé avec succès`);
    } catch (error) {
      console.error("Erreur suppression employé:", error);
      alert("❌ Erreur lors de la suppression de l'employé");
    }
  };

  // Supprimer tout l'historique des ventes
  const handleClearAllSales = async () => {
    const confirmed = window.confirm(
      "⚠️ ATTENTION !\n\nÊtes-vous ABSOLUMENT sûr de vouloir supprimer TOUT l'historique des ventes ?\n\nCette action est IRREVERSIBLE et supprimera toutes les données de vente.\n\nTapez 'SUPPRIMER' pour confirmer."
    );
    
    if (!confirmed) return;
    
    const userInput = prompt("Pour confirmer, tapez 'SUPPRIMER' :");
    if (userInput !== "SUPPRIMER") {
      alert("❌ Suppression annulée");
      return;
    }

    try {
      const salesSnapshot = await getDocs(salesCollection);
      const deletePromises = salesSnapshot.docs.map(docRef => 
        deleteDoc(doc(db, "sales", docRef.id))
      );
      
      await Promise.all(deletePromises);
      setSales([]);
      alert("✅ Toutes les ventes ont été supprimées avec succès");
    } catch (error) {
      console.error("Erreur suppression historique:", error);
      alert("❌ Erreur lors de la suppression de l'historique");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ 
      name: product.name, 
      quantity: product.quantity.toString(),
      price: product.price?.toString() || ""
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: "", quantity: "", price: "" });
  };

  const handleSaleClick = (product) => {
    setProductToSell(product);
    setSaleModalOpen(true);
  };

  const handleConfirmSale = async (saleData) => {
    try {
      const productRef = doc(db, "products", saleData.productId);
      const newQuantity = productToSell.quantity - saleData.quantity;
      
      await updateDoc(productRef, { quantity: newQuantity });

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
        seller: "boss",
        timestamp: saleData.timestamp,
        date: saleData.date,
        month: saleData.month,
        year: saleData.year,
        shop: "cameroon_shop_1"
      };

      await addDoc(salesCollection, saleRecord);

      setProducts(prev => prev.map(p => 
        p.id === saleData.productId 
          ? { ...p, quantity: newQuantity }
          : p
      ));
      
      setSales(prev => [...prev, saleRecord]);
      
      alert(`✅ Vente enregistrée : ${saleData.quantity}x ${saleData.productName} à ${saleData.soldPrice.toLocaleString()} FCFA`);
      setSaleModalOpen(false);
      
    } catch (error) {
      console.error("Erreur lors de la vente:", error);
      alert("❌ Erreur lors de l'enregistrement de la vente");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleGoToStatistics = () => {
    navigate("/statistics");
  };

  const handleRefreshEmployees = async () => {
    try {
      const q = query(usersCollection, where("role", "==", "employee"));
      const snapshot = await getDocs(q);
      const employeesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeesList);
      alert("✅ Liste des employés rafraîchie");
    } catch (error) {
      console.error("Erreur rafraîchissement employés:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-[5rem]">
      <div className="flex flex-col items-center justify-center mb-6">
        <img src={logo} className="w-20 h-20 rounded-full mb-4" alt="logo" />
        <h1 className="text-3xl font-bold mb-2">DomseShop - Patron</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <span>🚪</span> Déconnexion
          </button>
          <button
            onClick={handleGoToStatistics}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
          >
            <span>📊</span> Statistiques
          </button>
          <button
            onClick={() => setAddEmployeeModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <span>➕</span> Ajouter employé
          </button>
          <button
            onClick={handleRefreshEmployees}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <span>🔄</span> Rafraîchir
          </button>
        </div>
      </div>

      {/* Section Gestion des Employés */}
      <div className="bg-white p-4 rounded shadow-md max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">👥 Gestion des Employés</h2>
          <span className="bg-gray-200 px-3 py-1 rounded-full">
            {employees.length} employé(s)
          </span>
        </div>
        
        {employees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucun employé enregistré</p>
            <button
              onClick={() => setAddEmployeeModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ajouter le premier employé
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {employee.name} {employee.surname}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      📞 {employee.phone}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Email: {employee.phone}@domshop.com
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {employee.role || "employé"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Créé le: {employee.createdAt?.toDate().toLocaleDateString() || "N/A"}
                </div>
                <button
                  onClick={() => handleDeleteEmployee(employee.id, `${employee.name} ${employee.surname}`)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm flex items-center justify-center gap-2"
                >
                  <span>🗑️</span> Supprimer cet employé
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire ajout/modification produit */}
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingProduct ? "📝 Modifier un produit" : "➕ Ajouter un produit"}
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
          placeholder="Prix (FCFA)"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2"
            >
              <span>💾</span> Enregistrer
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full flex items-center justify-center gap-2"
          >
            <span>➕</span> Ajouter produit
          </button>
        )}
      </div>

      {/* Liste des produits */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">📦 Produits en stock ({products.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${product.quantity > 10 ? 'bg-green-100 text-green-800' : product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {product.quantity} en stock
                </span>
              </div>
              <p className="text-gray-700 mb-3">
                Prix : <span className="font-bold">{product.price?.toLocaleString() || "0"} FCFA</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSaleClick(product)}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  disabled={product.quantity === 0}
                >
                  <span>💰</span> Vendre
                </button>
                <button
                  onClick={() => startEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center gap-1"
                >
                  <span>✏️</span> Modifier
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-1"
                >
                  <span>🗑️</span> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des ventes */}
      <div className="mt-10 bg-white p-4 rounded shadow max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h2 className="text-xl font-bold">📋 Historique des ventes</h2>
            <p className="text-gray-600 text-sm">
              {sales.length} vente(s) enregistrée(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGoToStatistics}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
            >
              <span>📈</span> Voir statistiques
            </button>
            <button
              onClick={handleClearAllSales}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
              disabled={sales.length === 0}
            >
              <span>🔥</span> Tout supprimer
            </button>
          </div>
        </div>
        
        {sales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune vente enregistrée.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Produit</th>
                    <th className="text-left p-2">Quantité</th>
                    <th className="text-left p-2">Prix</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Vendeur</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 15).map((sale, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{sale.productName || "N/A"}</td>
                      <td className="p-2">{sale.quantity || 1}</td>
                      <td className="p-2">{sale.soldPrice?.toLocaleString() || "0"} FCFA</td>
                      <td className="p-2 font-bold text-green-600">
                        {sale.total?.toLocaleString() || sale.soldPrice?.toLocaleString() || "0"} FCFA
                      </td>
                      <td className="p-2 text-sm">{sale.timestamp || "N/A"}</td>
                      <td className="p-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {sale.seller || "boss"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sales.length > 15 && (
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Affichage des 15 dernières ventes sur {sales.length}
                </p>
              </div>
            )}
          </>
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

      {/* MODAL AJOUT EMPLOYÉ */}
      {addEmployeeModalOpen && (
        <AddEmployeeModal
          isOpen={addEmployeeModalOpen}
          onClose={() => setAddEmployeeModalOpen(false)}
          onEmployeeAdded={handleRefreshEmployees}
        />
      )}
    </div>
  );
}






































































