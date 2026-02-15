import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Search, Package, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { GetValideDeliveries, SearchValideDelivery } from "../services/DeliveryService";
import { AddInvoices } from "../services/InvoiceService";

const PagePickingInvoice = ({ isDark }) => {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [errMsg, setErrMsg] = useState({});

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  /* ================= FETCH DELIVERED DELIVERIES ================= */
  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const data = await GetValideDeliveries(setErrMsg);
        setDeliveries(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setLoading(true);
      try {
        const data = await GetValideDeliveries(setErrMsg);
        setDeliveries(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setSearching(true);
    try {
      const data = await SearchValideDelivery(searchTerm, setErrMsg);
      setDeliveries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const selectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const calculateTotals = (items) => {
    return items.reduce(
      (acc, it) => {
        const ht = it.produit.prix * it.qtte;
        const tva = ht * (it.tax_rate / 100);
        const ttc = ht + tva;
        return {
          totalHT: acc.totalHT + ht,
          totalTTC: acc.totalTTC + ttc,
          totalTVA: acc.totalTVA + tva,
        };
      },
      { totalHT: 0, totalTTC: 0, totalTVA: 0 }
    );
  };

  const handleGenerateInvoice = async () => {
    if (!selectedDelivery) return;

    setGeneratingInvoice(true);
    try {
      await AddInvoices(selectedDelivery.id, setErrMsg, navigate);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : ''}`}>
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-white' : 'border-[#094067]'} mb-4`}></div>
          <div className={`${isDark ? 'text-white' : 'text-[#094067]'} font-semibold`}>Chargement des bons de livraison...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className={isDark ? 'text-white' : 'text-[#094067]'} size={32} />
            <h1 className={`lg:text-3xl md:text-3xl text-[20px] font-bold ${isDark ? 'text-white' : 'text-[#094067]'}`}>Générer une Facture</h1>
          </div>
          <Link
            to="/comptable/factures"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white hover:shadow-md'
                : 'bg-white border-gray-300 text-gray-800 hover:shadow-md'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </Link>
        </div>

        {/* Search Section */}
        <div className={`rounded-2xl shadow-md p-6 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Search size={20} />
            Rechercher un Bon de Livraison
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <input
              type="text"
              placeholder="N de BL ou nom du client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
                isDark
                  ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-700 placeholder-gray-500 focus:ring-[#094067]'
              }`}
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className={`px-6 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-[#094067] text-white hover:bg-[#0a5085] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Recherche...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Rechercher
                </>
              )}
            </button>
          </div>
        </div>

        {/* Deliveries List */}
        <div className={`rounded-2xl shadow-md p-6 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Package size={20} />
            Bons de Livraison Livrés ({deliveries.length})
          </h2>

          {deliveries.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Aucun bon de livraison livré trouvé</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {deliveries.map((delivery) => {
                const totals = calculateTotals(delivery.items || []);
                return (
                  <div
                    key={delivery.id}
                    onClick={() => selectDelivery(delivery)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedDelivery?.id === delivery.id
                        ? isDark
                          ? 'bg-blue-900 border-blue-500 shadow-sm'
                          : 'bg-blue-50 border-blue-400 shadow-sm'
                        : `${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'}`
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={18} className="text-green-500" />
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{delivery.number}</span>
                        </div>
                        <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Client: {delivery?.client?.company_name || "N/A"}
                        </div>
                        <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Devis: {delivery?.number || "N/A"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-[#094067]'}`}>
                          {totals.totalTTC.toFixed(2)} DH
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {delivery.items?.length || 0} article(s)
                        </div>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold">
                          Livré
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Delivery Details */}
        {selectedDelivery && (
          <div className={`rounded-2xl shadow-md p-6 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <Package size={24} />
                Détails du Bon de Livraison {selectedDelivery.number}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-semibold">{selectedDelivery?.client?.company_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="ml-2 font-semibold">{selectedDelivery?.client?.tel || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-semibold">{selectedDelivery?.client?.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">ICE:</span>
                  <span className="ml-2 font-semibold">{selectedDelivery?.client?.vat_number || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Devis:</span>
                  <span className="ml-2 font-semibold">{selectedDelivery?.number || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold">
                      {selectedDelivery.status || "Livré"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <h4 className="font-bold mb-4">Articles Livrés</h4>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm border rounded-xl ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <thead className={`text-white ${isDark ? 'bg-gray-700' : 'bg-[#094067]'}`}>
                  <tr>
                    <th className="p-3 text-left rounded-tl-xl">Produit</th>
                    <th className="p-3 text-center">Quantité</th>
                    <th className="p-3 text-right">Prix Unit. HT</th>
                    <th className="p-3 text-center">TVA %</th>
                    <th className="p-3 text-right rounded-tr-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {selectedDelivery.items?.map((item, index) => (
                    <tr key={index} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <td className="p-3">
                        <div className="font-medium">{item.produit?.label || "N/A"}</div>
                        <div className="text-xs">{item.produit?.type || ""}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg font-semibold">{item.qtte}</span>
                      </td>
                      <td className="p-3 text-right font-medium">{Number(item.produit?.prix || 0).toFixed(2)} DH</td>
                      <td className="p-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded">{item.tax_rate}%</span>
                      </td>
                      <td className="p-3 text-right font-semibold text-[#094067]">{((item.produit?.prix || 0) * item.qtte).toFixed(2)} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              {(() => {
                const totals = calculateTotals(selectedDelivery.items || []);
                return (
                  <div className={`mt-6 rounded-xl p-4 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <div className="flex flex-col gap-2 max-w-md ml-auto">
                      <div className="flex justify-between">
                        <span>Total HT:</span>
                        <span className="font-semibold">{totals.totalHT.toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total TVA:</span>
                        <span className="font-semibold">{totals.totalTVA.toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-[#094067]">
                        <span>Total TTC:</span>
                        <span>{totals.totalTTC.toFixed(2)} DH</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Generate Invoice Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleGenerateInvoice}
                  disabled={generatingInvoice}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {generatingInvoice ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Générer la Facture
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagePickingInvoice;
