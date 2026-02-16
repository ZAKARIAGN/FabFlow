import { useEffect, useState } from "react";
import { ArrowLeft, Save, Search, Package, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { GetValideQuotes, SearchValideQuote } from "../services/QuoteService";
import { AddDeliveries } from "../services/DeliveryService";

const PageDeliveries = ({ isDark }) => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState({});

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [items, setItems] = useState([]);

  // ✅ Load initial quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const data = await GetValideQuotes(setErrMsg);
        setQuotes(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // ✅ Search automatique nichan
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm.trim()) {
        // Si search vide, charger tous les quotes
        try {
          const data = await GetValideQuotes(setErrMsg);
          setQuotes(data || []);
        } catch (err) {
          console.error(err);
        }
        return;
      }

      // Sinon, faire la recherche
      try {
        const data = await SearchValideQuote(searchTerm, setErrMsg);
        setQuotes(data || []);
      } catch (err) {
        console.error(err);
      }
    }, 500); // ✅ Debounce de 500ms

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const selectQuote = (quote) => {
    setSelectedQuote(quote);
    setItems(
      quote.items.map((it) => ({
        ...it,
        qtte: it.qtte,
        max_qtte: it.qtte,
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

  const handleAddDelivery = async () => {
    if (!selectedQuote) {
      return;
    }
    const validItems = items.filter((it) => it.qtte > 0);
    if (validItems.length === 0) {
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${isDark ? "bg-[#0f172a]" : ""} flex items-center justify-center min-h-screen`}
      >
        <div className="text-center">
          <div
            className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-[#5b9bd5]" : "border-[#094067]"} mb-4`}
          ></div>
          <div
            className={`${isDark ? "text-[#5b9bd5]" : "text-[#094067]"} font-semibold`}
          >
            Chargement des devis...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-0 md:flex-row md:gap-0 sm:flex-row sm:gap-0 justify-between items-center">
          <div className="flex items-center gap-3">
            <Package
              className={isDark ? "text-[#5b9bd5]" : "text-[#094067]"}
              size={32}
            />
            <h1
              className={`text-[20px] lg:text-3xl md:text-3xl sm:text-3xl font-bold ${isDark ? "text-[#5b9bd5]" : "text-[#094067]"}`}
            >
              Créer un Bon de Livraison
            </h1>
          </div>
          <Link
            to="/atelier/BL"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:shadow-md transition-all ${isDark ? "bg-[#1e293b] border border-[#334155] text-gray-300 hover:bg-[#263449]" : "bg-white border border-gray-300 text-gray-700"}`}
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </Link>
        </div>

        {/* ✅ Recherche simplifiée - sans button */}
        <div
          className={`rounded-2xl shadow-md p-6 ${isDark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <h2
            className={`font-bold mb-4 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            <Search size={20} />
            Rechercher un Devis Validé
          </h2>
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              size={20}
            />
            <input
              type="text"
              placeholder="N° de devis ou nom du client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent ${isDark ? "bg-[#0f172a] border border-[#334155] text-gray-200 placeholder-gray-500" : "border border-gray-300 text-gray-800"}`}
            />
          </div>
        </div>

        <div
          className={`rounded-2xl shadow-md p-6 ${isDark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <h2
            className={`font-bold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            Devis Validés ({quotes.length})
          </h2>

          {quotes.length === 0 ? (
            <div
              className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
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
                      ? isDark
                        ? "bg-[#1a2d4a] border-[#5b9bd5] shadow-sm"
                        : "bg-blue-50 border-blue-400 shadow-sm"
                      : isDark
                        ? "hover:bg-[#263449] border-[#334155]"
                        : "hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => selectQuote(q)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span
                        className={`font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {q.number}
                      </span>
                      <span
                        className={`ml-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        - {q.client.company_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${isDark ? "text-[#5b9bd5]" : "text-[#094067]"}`}
                      >
                        {Number(q.totale).toFixed(2)} DH
                      </div>
                      <div
                        className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                      >
                        {q.items.length} article(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedQuote && (
          <div
            className={`rounded-2xl shadow-md p-6 ${isDark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="mb-6">
              <h3
                className={`font-bold text-xl mb-2 ${isDark ? "text-gray-100" : "text-gray-800"}`}
              >
                Détails du Devis {selectedQuote.number}
              </h3>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 text-sm p-4 rounded-xl ${isDark ? "bg-[#0f172a]" : "bg-gray-50"}`}
              >
                <div>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Client:
                  </span>
                  <span
                    className={`ml-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {selectedQuote.client.company_name}
                  </span>
                </div>
                <div>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Téléphone:
                  </span>
                  <span
                    className={`ml-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {selectedQuote.client.tel}
                  </span>
                </div>
                <div>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Email:
                  </span>
                  <span
                    className={`ml-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {selectedQuote.client.email}
                  </span>
                </div>
                <div>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    ICE:
                  </span>
                  <span
                    className={`ml-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {selectedQuote.client.vat_number}
                  </span>
                </div>
              </div>
            </div>

            <h4
              className={`font-bold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}
            >
              Articles à Livrer
            </h4>
            <div className="overflow-x-auto">
              <table
                className={`w-full text-sm border rounded-xl ${isDark ? "border-[#334155]" : "border-gray-200"}`}
              >
                <thead className="bg-[#094067] text-white">
                  <tr>
                    <th className="p-3 text-left rounded-tl-xl">Produit</th>
                    <th className="p-3 text-center">Qté à Livrer</th>
                    <th className="p-3 text-right">Prix Unit. HT</th>
                    <th className="p-3 text-center">TVA %</th>
                    <th className="p-3 text-right rounded-tr-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDark ? "divide-[#334155]" : "divide-gray-100"}`}
                >
                  {items.map((it, index) => (
                    <tr
                      key={index}
                      className={
                        isDark ? "hover:bg-[#263449]" : "hover:bg-gray-50"
                      }
                    >
                      <td className="p-3">
                        <div
                          className={`font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}
                        >
                          {it.produit.label}
                        </div>
                        <div
                          className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                        >
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
                            className={`w-24 rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-[#094067] ${isDark ? "bg-[#0f172a] border border-[#334155] text-gray-200" : "border border-gray-300 text-gray-800"}`}
                          />
                          <span
                            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                          >
                            / {it.max_qtte}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`p-3 text-right font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {Number(it.produit.prix).toFixed(2)} DH
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded ${isDark ? "bg-[#0f172a] text-gray-300" : "bg-gray-100 text-gray-700"}`}
                        >
                          {it.tax_rate}%
                        </span>
                      </td>
                      <td
                        className={`p-3 text-right font-semibold ${isDark ? "text-[#5b9bd5]" : "text-[#094067]"}`}
                      >
                        {(it.produit.prix * it.qtte).toFixed(2)} DH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className={`mt-6 rounded-xl p-4 ${isDark ? "bg-[#0f172a]" : "bg-gray-50"}`}
              >
                <div className="flex flex-col gap-2 max-w-md ml-auto">
                  <div
                    className={`flex justify-between ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <span>Total HT:</span>
                    <span className="font-semibold">
                      {totals.totalHT.toFixed(2)} DH
                    </span>
                  </div>
                  <div
                    className={`flex justify-between ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <span>Total TVA:</span>
                    <span className="font-semibold">
                      {totals.totalTVA.toFixed(2)} DH
                    </span>
                  </div>
                  <div
                    className={`flex justify-between text-lg font-bold pt-2 border-t-2 ${isDark ? "text-[#5b9bd5] border-[#5b9bd5]" : "text-[#094067] border-[#094067]"}`}
                  >
                    <span>Total TTC:</span>
                    <span>{totals.totalTTC.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleAddDelivery}
                  disabled={submitting}
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
