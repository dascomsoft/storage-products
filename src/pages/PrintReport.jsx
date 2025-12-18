// src/pages/PrintReport.jsx
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import logo from "../assets/domlogo.png";

export default function PrintReport() {
  const [printData, setPrintData] = useState(null);
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('printData') || '{}');
    setPrintData(data);
    
    // Auto-impression après 1 seconde
    setTimeout(() => {
      window.print();
    }, 1000);
  }, []);
  
  if (!printData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation de l'impression...</p>
        </div>
      </div>
    );
  }
  
  const getTitle = () => {
    const date = new Date(printData.date);
    switch(printData.type) {
      case 'daily': 
        return `Rapport Journalier - ${format(date, "EEEE d MMMM yyyy", { locale: fr })}`;
      case 'monthly': 
        return `Rapport Mensuel - ${format(date, "MMMM yyyy", { locale: fr })}`;
      case 'yearly': 
        return `Rapport Annuel - ${format(date, "yyyy", { locale: fr })}`;
      default: return 'Rapport des Ventes';
    }
  };
  
  return (
    <div className="print:p-0">
      {/* Contenu à imprimer */}
      <div className="p-8 bg-white print:p-0">
        {/* En-tête */}
        <div className="text-center mb-8 border-b pb-4">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          <p className="text-gray-600">
            Généré le {format(new Date(), "PPPP", { locale: fr })} à {format(new Date(), 'HH:mm')}
          </p>
        </div>
        
        {/* Résumé */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Résumé</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border p-4 rounded">
              <p className="font-medium">Total des ventes</p>
              <p className="text-2xl font-bold">
                {printData.total?.toLocaleString() || "0"} FCFA
              </p>
            </div>
            <div className="border p-4 rounded">
              <p className="font-medium">Nombre de transactions</p>
              <p className="text-2xl font-bold">
                {printData.sales?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        {/* Détails */}
        {printData.sales?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Détail des ventes</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Produit</th>
                  <th className="border p-2 text-left">Prix</th>
                  <th className="border p-2 text-left">Qté</th>
                  <th className="border p-2 text-left">Total</th>
                  <th className="border p-2 text-left">Heure</th>
                </tr>
              </thead>
              <tbody>
                {printData.sales.map((sale, index) => (
                  <tr key={index}>
                    <td className="border p-2">{sale.productName}</td>
                    <td className="border p-2">{sale.soldPrice?.toLocaleString()} FCFA</td>
                    <td className="border p-2">{sale.quantity || 1}</td>
                    <td className="border p-2 font-bold">
                      {sale.total?.toLocaleString()} FCFA
                    </td>
                    <td className="border p-2">{sale.timestamp?.split(' ')[1] || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pied de page */}
        <div className="mt-12 pt-4 border-t text-center text-sm">
          <p>Document généré par DomseShop</p>
          <p>Page 1/1</p>
        </div>
      </div>
      
      {/* Bouton pour les navigateurs qui bloquent l'auto-impression */}
      <div className="print:hidden fixed bottom-4 right-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
        >
          🖨️ Cliquez ici pour imprimer
        </button>
        <button
          onClick={() => window.close()}
          className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700"
        >
          ✕ Fermer
        </button>
      </div>
    </div>
  );
}