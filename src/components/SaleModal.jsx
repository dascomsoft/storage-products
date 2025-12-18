// src/components/SaleModal.jsx
import { useState, useEffect } from "react";

export default function SaleModal({ 
  product, 
  isOpen, 
  onClose, 
  onConfirmSale 
}) {
  const [soldPrice, setSoldPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerType, setCustomerType] = useState("nouveau");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  // Réinitialiser quand le produit change
  useEffect(() => {
    if (product) {
      // Si le produit a un prix, l'utiliser comme suggestion
      setSoldPrice(product.price || "");
      setQuantity(1);
    }
  }, [product]);
  
  if (!isOpen || !product) return null;
  
  const maxQuantity = product.quantity || 0;
  const referencePrice = product.price || 0;
  
  // Calculs
  const totalAmount = (parseFloat(soldPrice) || 0) * quantity;
  const discountAmount = referencePrice > 0 
    ? (referencePrice - (parseFloat(soldPrice) || 0)) * quantity
    : 0;
  const discountPercentage = referencePrice > 0 && soldPrice
    ? ((referencePrice - parseFloat(soldPrice)) / referencePrice * 100).toFixed(1)
    : 0;
  
  const handleConfirm = () => {
    if (!soldPrice || soldPrice <= 0 || quantity <= 0) {
      alert("Veuillez entrer un prix et une quantité valides");
      return;
    }
    
    if (quantity > maxQuantity) {
      alert(`Quantité insuffisante! Stock disponible: ${maxQuantity}`);
      return;
    }
    
    const saleData = {
      productId: product.id,
      productName: product.name,
      soldPrice: parseFloat(soldPrice),
      referencePrice: referencePrice,
      quantity: quantity,
      total: totalAmount,
      discount: discountAmount,
      customerType,
      paymentMethod,
      timestamp: new Date().toLocaleString('fr-FR'),
      date: new Date().toISOString().split('T')[0],
      month: new Date().toISOString().slice(0, 7),
      year: new Date().getFullYear().toString()
    };
    
    onConfirmSale(saleData);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  💰 Vendre : <span className="text-blue-600">{product.name}</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Prix de référence */}
                  {referencePrice > 0 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Prix de référence</p>
                      <p className="text-lg font-semibold">
                        {referencePrice.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                  
                  {/* Prix vendu (négocié) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de vente (négocié) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={soldPrice}
                        onChange={(e) => setSoldPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez le prix négocié"
                        min="0"
                        step="100"
                        required
                      />
                      <span className="absolute right-3 top-3 text-gray-500">FCFA</span>
                    </div>
                  </div>
                  
                  {/* Quantité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité (Stock: {maxQuantity})
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1, Math.min(val, maxQuantity)));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max={maxQuantity}
                    />
                  </div>
                  
                  {/* Type de client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de client
                    </label>
                    <select
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="nouveau">Nouveau client</option>
                      <option value="regulier">Client régulier</option>
                      <option value="gros">Gros client</option>
                      <option value="famille">Famille/Amis</option>
                    </select>
                  </div>
                  
                  {/* Mode de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode de paiement
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cash">Espèces</option>
                      <option value="orange_money">Orange Money</option>
                      <option value="mtn_momo">MTN Mobile Money</option>
                      <option value="wave">Wave</option>
                      <option value="credit">À crédit</option>
                    </select>
                  </div>
                  
                  {/* Récapitulatif */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Récapitulatif</h4>
                    <div className="space-y-1">
                      {referencePrice > 0 && soldPrice && parseFloat(soldPrice) < referencePrice && (
                        <div className="flex justify-between">
                          <span className="text-sm">Réduction:</span>
                          <span className="font-semibold text-red-600">
                            -{discountAmount.toLocaleString()} FCFA ({discountPercentage}%)
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm">Prix unitaire:</span>
                        <span className="font-medium">{parseFloat(soldPrice).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Quantité:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-medium">Total à payer:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {totalAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              ✅ Confirmer la vente
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}