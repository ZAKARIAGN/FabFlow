import { useEffect, useState } from "react";
import { ArrowLeft, Save, Search, Package, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetValideQuotes, SearchValideQuote } from "../services/QuoteService";
import { AddDeliveries } from "../services/DeliveryService";

const PageDeliveries = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState({});

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [items, setItems] = useState([]);

  /* ================= FETCH VALID QUOTES ================= */
  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const data = await GetValideQuotes(setErrMsg);
        setQuotes(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des devis");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Si vide, recharger tous les quotes
      setLoading(true);
      try {
        const data = await GetValideQuotes(setErrMsg);
        setQuotes(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setSearching(true);
    try {
      const data = await SearchValideQuote(searchTerm, setErrMsg);
      setQuotes(data || []);
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

  /* ================= SELECT QUOTE ================= */
  const selectQuote = (quote) => {
    setSelectedQuote(quote);
    setItems(
      quote.items.map((it) => ({
        ...it,
        qtte: it.qtte, // Keep original quantity
        max_qtte: it.qtte, // Store max available
      })),
    );
  };

  const updateItemQtte = (index, value) => {
    const numValue = Number(value);
    setItems((prev) =>
      prev.map((it, i) => {
        if (i === index) {
          if (numValue > it.max_qtte) {
            return { ...it, qtte: it.max_qtte };
          }
          return { ...it, qtte: numValue };
        }
        return it;
      }),
    );
  };

  /* ================= TOTALS ================= */
  const totals = items.reduce(
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
    { totalHT: 0, totalTTC: 0, totalTVA: 0 },
  );

  /* ================= ADD DELIVERY ================= */
  const handleAddDelivery = async () => {
    if (!selectedQuote) {
      toast.error("Veuillez sélectionner un devis");
      return;
    }
    const validItems = items.filter((it) => it.qtte > 0);
    if (validItems.length === 0) {
      toast.error("Veuillez ajouter au moins un article avec une quantité");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        totale: totals.totalTTC,
        items: validItems.map((it) => ({
          produit_id: it.produit_id,
          qtte: it.qtte,
        })),
      };

      await AddDeliveries(selectedQuote.id, payload, setErrMsg, navigate);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du bon de livraison");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#094067] mb-4"></div>
          <div className="text-[#094067] font-semibold">
            Chargement des devis...
          </div>
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
            <Package className="text-[#094067]" size={32} />
            <h1 className="text-3xl font-bold text-[#094067]">
              Créer un Bon de Livraison
            </h1>
          </div>
          <Link
            to="/admin/deliveries"
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
            Rechercher un Devis Validé
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Numéro de devis ou nom du client..."
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

        {/* Quotes List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-gray-700 mb-4">
            Devis Validés ({quotes.length})
          </h2>

          {quotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto mb-2" size={48} />
              <p>Aucun devis validé trouvé</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedQuote?.id === q.id
                      ? "bg-blue-50 border-blue-400 shadow-sm"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => selectQuote(q)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800">
                        {q.number}
                      </span>
                      <span className="text-gray-600 ml-2">
                        - {q.client.company_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#094067]">
                        {Number(q.totale).toFixed(2)} DH
                      </div>
                      <div className="text-xs text-gray-500">
                        {q.items.length} article(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Quote Items */}
        {selectedQuote && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 text-xl mb-2">
                Détails du Devis {selectedQuote.number}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-semibold">
                    {selectedQuote.client.company_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="ml-2 font-semibold">
                    {selectedQuote.client.tel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-semibold">
                    {selectedQuote.client.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ICE:</span>
                  <span className="ml-2 font-semibold">
                    {selectedQuote.client.vat_number}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-gray-700 mb-4">Articles à Livrer</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl">
                <thead className="bg-[#094067] text-white">
                  <tr>
                    <th className="p-3 text-left rounded-tl-xl">Produit</th>
                    <th className="p-3 text-center">Qté à Livrer</th>
                    <th className="p-3 text-right">Prix Unit. HT</th>
                    <th className="p-3 text-center">TVA %</th>
                    <th className="p-3 text-right rounded-tr-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((it, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-800">
                          {it.produit.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {it.produit.type}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={it.max_qtte}
                            value={it.qtte}
                            onChange={(e) =>
                              updateItemQtte(index, e.target.value)
                            }
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-[#094067]"
                          />
                          <span className="text-xs text-gray-500">
                            / {it.max_qtte}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {Number(it.produit.prix).toFixed(2)} DH
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {it.tax_rate}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-[#094067]">
                        {(it.produit.prix * it.qtte).toFixed(2)} DH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex flex-col gap-2 max-w-md ml-auto">
                  <div className="flex justify-between text-gray-700">
                    <span>Total HT:</span>
                    <span className="font-semibold">
                      {totals.totalHT.toFixed(2)} DH
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Total TVA:</span>
                    <span className="font-semibold">
                      {totals.totalTVA.toFixed(2)} DH
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#094067] pt-2 border-t-2 border-[#094067]">
                    <span>Total TTC:</span>
                    <span>{totals.totalTTC.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleAddDelivery}
                  className="flex items-center gap-2 px-8 py-3 bg-[#094067] text-white rounded-xl font-bold hover:bg-[#0a5085] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Créer le Bon de Livraison
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

export default PageDeliveries;
