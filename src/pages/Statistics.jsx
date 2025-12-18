// src/pages/Statistics.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("daily");
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  // Charger les ventes selon l'onglet actif
  useEffect(() => {
    loadSalesData();
  }, [activeTab, selectedDate]);
  
  const loadSalesData = async () => {
    setLoading(true);
    try {
      const salesCollection = collection(db, "sales");
      let q;
      
      if (activeTab === "daily") {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        q = query(salesCollection, where("date", "==", dateStr));
      } 
      else if (activeTab === "monthly") {
        const monthStr = format(selectedDate, 'yyyy-MM');
        q = query(salesCollection, where("month", "==", monthStr));
      }
      else if (activeTab === "yearly") {
        const yearStr = format(selectedDate, 'yyyy');
        q = query(salesCollection, where("year", "==", yearStr));
      }
      
      const snapshot = await getDocs(q || salesCollection);
      const salesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setSales(salesData);
      
      // Calculer le total
      const calculatedTotal = salesData.reduce(
        (sum, sale) => sum + (sale.total || sale.soldPrice || 0), 
        0
      );
      setTotal(calculatedTotal);
      
    } catch (error) {
      console.error("Erreur chargement données:", error);
      alert("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };
  
//   const handlePrint = () => {
//     const data = {
//       type: activeTab,
//       date: selectedDate,
//       sales: sales,
//       total: total
//     };
    
//     localStorage.setItem('printData', JSON.stringify(data));
//     window.open('/print', '_blank');
//   };





// Dans Statistics.jsx, vérifiez que handlePrint ressemble à ceci :
const handlePrint = () => {
  const data = {
    type: activeTab,
    date: selectedDate,
    sales: sales,
    total: total
  };
  
  localStorage.setItem('printData', JSON.stringify(data));
  window.open('/print', '_blank');
};
  
  const formatDate = (date) => {
    if (activeTab === "daily") {
      return format(date, "EEEE d MMMM yyyy", { locale: fr });
    } else if (activeTab === "monthly") {
      return format(date, "MMMM yyyy", { locale: fr });
    } else {
      return format(date, "yyyy", { locale: fr });
    }
  };
  
  // Grouper les ventes par produit pour les statistiques
  const getProductStats = () => {
    const productMap = {};
    
    sales.forEach(sale => {
      if (!productMap[sale.productName]) {
        productMap[sale.productName] = {
          totalQuantity: 0,
          totalRevenue: 0,
          count: 0
        };
      }
      
      productMap[sale.productName].totalQuantity += (sale.quantity || 1);
      productMap[sale.productName].totalRevenue += (sale.total || sale.soldPrice || 0);
      productMap[sale.productName].count += 1;
    });
    
    return Object.entries(productMap)
      .map(([name, stats]) => ({
        name,
        ...stats
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  };
  
  const productStats = getProductStats();
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📊 Statistiques des Ventes</h1>
              <p className="text-gray-600 mt-2">
                Analysez vos performances commerciales
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                ← Retour
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                🖨️ Imprimer le rapport
              </button>
            </div>
          </div>
        </div>
        
        {/* Sélecteur de période */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === "daily" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📅 Journalier
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === "monthly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📊 Mensuel
            </button>
            <button
              onClick={() => setActiveTab("yearly")}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === "yearly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📈 Annuel
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium">Période :</span>
            <div className="text-xl font-semibold text-blue-700">
              {formatDate(selectedDate)}
            </div>
            {activeTab === "daily" && (
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border rounded-lg px-3 py-2"
              />
            )}
            {activeTab === "monthly" && (
              <input
                type="month"
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value + '-01'))}
                className="border rounded-lg px-3 py-2"
              />
            )}
            {activeTab === "yearly" && (
              <input
                type="number"
                value={format(selectedDate, 'yyyy')}
                onChange={(e) => setSelectedDate(new Date(e.target.value + '-01-01'))}
                min="2020"
                max="2030"
                className="border rounded-lg px-3 py-2 w-32"
              />
            )}
          </div>
        </div>
        
        {/* Cartes de résumé */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Total des ventes</p>
                <p className="text-3xl font-bold mt-2">{total.toLocaleString()} FCFA</p>
              </div>
              <div className="text-green-500 text-4xl">💰</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Nombre de ventes</p>
                <p className="text-3xl font-bold mt-2">{sales.length}</p>
              </div>
              <div className="text-blue-500 text-4xl">📝</div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Produits vendus</p>
                <p className="text-3xl font-bold mt-2">
                  {sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0)}
                </p>
              </div>
              <div className="text-purple-500 text-4xl">📦</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Vente moyenne</p>
                <p className="text-3xl font-bold mt-2">
                  {sales.length > 0 
                    ? (total / sales.length).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
                    : "0"
                  } FCFA
                </p>
              </div>
              <div className="text-yellow-500 text-4xl">📊</div>
            </div>
          </div>
        </div>
        
        {/* Tableau des ventes */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">📋 Détail des ventes</h2>
            <p className="text-gray-600 mt-1">
              {sales.length} transaction(s) enregistrée(s)
            </p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">Aucune vente enregistrée pour cette période</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix vendu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paiement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{sale.productName}</div>
                        {sale.discount > 0 && (
                          <div className="text-sm text-red-600">
                            Réduction: -{sale.discount?.toLocaleString()} FCFA
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">
                          {sale.soldPrice?.toLocaleString()} FCFA
                        </span>
                        {sale.referencePrice && sale.referencePrice > sale.soldPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {sale.referencePrice.toLocaleString()} FCFA
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {sale.quantity || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-green-600">
                          {sale.total?.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.customerType === 'regulier' ? 'bg-green-100 text-green-800' :
                          sale.customerType === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                          sale.customerType === 'gros' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sale.customerType || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sale.paymentMethod === 'cash' ? 'bg-yellow-100 text-yellow-800' :
                          sale.paymentMethod?.includes('money') ? 'bg-purple-100 text-purple-800' :
                          sale.paymentMethod === 'credit' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sale.paymentMethod || 'Non spécifié'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Statistiques par produit */}
        {productStats.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">🏆 Top des produits</h2>
              <p className="text-gray-600 mt-1">
                Classement par chiffre d'affaires
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité vendue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de ventes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chiffre d'affaires
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productStats.slice(0, 10).map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-400 mr-3">
                            #{index + 1}
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {product.totalQuantity} unités
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{product.count} vente(s)</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          {product.totalRevenue.toLocaleString()} FCFA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}