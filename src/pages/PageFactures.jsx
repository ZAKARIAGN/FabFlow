import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Search, Package, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetValideDeliveries, SearchValideDelivery } from "../services/DeliveryService";
import { AddInvoices } from "../services/InvoiceService";

const PagePickingInvoice = () => {
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
        toast.error("Erreur lors du chargement des bons de livraison");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Si vide, recharger tous les deliveries
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
      if (!data || data.length === 0) {
        toast.info("Aucun bon de livraison trouvé avec ce critère");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la recherche");
    } finally {
      setSearching(false);
    }
  };

  // Search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* ================= SELECT DELIVERY ================= */
  const selectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
  };

  /* ================= CALCULATE TOTALS ================= */
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

  /* ================= GENERATE INVOICE ================= */
  const handleGenerateInvoice = async () => {
    if (!selectedDelivery) {
      toast.error("Veuillez sélectionner un bon de livraison");
      return;
    }

    setGeneratingInvoice(true);
    try {
      await AddInvoices(selectedDelivery.id, setErrMsg, navigate);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération de la facture");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#094067] mb-4"></div>
          <div className="text-[#094067] font-semibold">Chargement des bons de livraison...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="text-[#094067]" size={32} />
            <h1 className="text-3xl font-bold text-[#094067]">Générer une Facture</h1>
          </div>
          <Link
            to="/admin/invoices"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </Link>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Search size={20} />
            Rechercher un Bon de Livraison
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Numéro de BL ou nom du client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-2 bg-[#094067] text-white rounded-xl hover:bg-[#0a5085] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Package size={20} />
            Bons de Livraison Livrés ({deliveries.length})
          </h2>

          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto mb-2" size={48} />
              <p>Aucun bon de livraison livré trouvé</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {deliveries.map((delivery) => {
                const totals = calculateTotals(delivery.items || []);
                return (
                  <div
                    key={delivery.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedDelivery?.id === delivery.id
                        ? "bg-blue-50 border-blue-400 shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => selectDelivery(delivery)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={18} className="text-green-600" />
                          <span className="font-bold text-gray-800">
                            {delivery.number}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Client: {delivery.quote?.client?.company_name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Devis: {delivery.quote?.number || "N/A"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#094067]">
                          {totals.totalTTC.toFixed(2)} DH
                        </div>
                        <div className="text-xs text-gray-500">
                          {delivery.items?.length || 0} article(s)
                        </div>
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
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
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 text-xl mb-2 flex items-center gap-2">
                <Package size={24} />
                Détails du Bon de Livraison {selectedDelivery.number}
              </h3>
              
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl mb-4">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-semibold">
                    {selectedDelivery.quote?.client?.company_name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="ml-2 font-semibold">
                    {selectedDelivery.quote?.client?.tel || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-semibold">
                    {selectedDelivery.quote?.client?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ICE:</span>
                  <span className="ml-2 font-semibold">
                    {selectedDelivery.quote?.client?.vat_number || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Devis:</span>
                  <span className="ml-2 font-semibold">
                    {selectedDelivery.quote?.number || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      {selectedDelivery.status || "Livré"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <h4 className="font-bold text-gray-700 mb-4">Articles Livrés</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl">
                <thead className="bg-[#094067] text-white">
                  <tr>
                    <th className="p-3 text-left rounded-tl-xl">Produit</th>
                    <th className="p-3 text-center">Quantité</th>
                    <th className="p-3 text-right">Prix Unit. HT</th>
                    <th className="p-3 text-center">TVA %</th>
                    <th className="p-3 text-right rounded-tr-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedDelivery.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-800">
                          {item.produit?.label || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.produit?.type || ""}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg font-semibold">
                          {item.qtte}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {Number(item.produit?.prix || 0).toFixed(2)} DH
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {item.tax_rate}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-[#094067]">
                        {((item.produit?.prix || 0) * item.qtte).toFixed(2)} DH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              {(() => {
                const totals = calculateTotals(selectedDelivery.items || []);
                return (
                  <div className="mt-6 bg-gray-50 rounded-xl p-4">
                    <div className="flex flex-col gap-2 max-w-md ml-auto">
                      <div className="flex justify-between text-gray-700">
                        <span>Total HT:</span>
                        <span className="font-semibold">{totals.totalHT.toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Total TVA:</span>
                        <span className="font-semibold">{totals.totalTVA.toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#094067] pt-2 border-t-2 border-[#094067]">
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
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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