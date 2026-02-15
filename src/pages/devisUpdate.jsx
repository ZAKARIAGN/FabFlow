import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";


import { GetAllClients } from "../services/ClientsService";
import { GetAllProduits } from "../services/ProduitService";
import { GetDocumentById } from "../services/DoucmentsService";
import { UpdateQuoteByID } from "../services/QuoteService";
import SearchableSelect from "../compenet/SearchableSelect";
import ErrMsg from "../compenet/ErrMsg";

const PageUpdateDevis = (isDark) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState({});

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await GetAllClients(setErrMsg);
        setClients(clientsData || []);

        const produitsData = await GetAllProduits(setErrMsg);
        setProduits(
          (produitsData || []).map((p) => ({
            ...p,
            prix: Number(p.prix),
          })),
        );

        const doc = await GetDocumentById(id, setErrMsg);

        if (!doc) {
          
          return;
        }

        setSelectedClient(doc.client);

        setItems(
          doc.items.map((it) => ({
            produit_id: it.produit_id,
            qtte: it.qtte,
            tax_rate: Number(it.tax_rate),
          })),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= HELPERS ================= */
  const getProduit = (produit_id) =>
    produits.find((p) => p.id === Number(produit_id));

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, [field]: Number(value) } : it,
      ),
    );
  };

  const updateProduit = (index, produit_id) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              produit_id: Number(produit_id),
              qtte: 1,
              tax_rate: 0,
            }
          : it,
      ),
    );
  };

  const addLine = () => {
    setItems((prev) => [
      ...prev,
      { produit_id: "", qtte: 1, tax_rate: 0 },
    ]);
  };

  const removeLine = (index) => {
    if (items.length === 1) {
      
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= TOTAL ================= */
  const calculateLineTotal = (it) => {
    const produit = getProduit(it.produit_id);
    if (!produit) return { ht: 0, ttc: 0 };
    
    const ht = produit.prix * it.qtte;
    const ttc = ht + ht * (it.tax_rate / 100);
    return { ht, ttc };
  };

  const totals = items.reduce((acc, it) => {
    const { ht, ttc } = calculateLineTotal(it);
    return {
      totalHT: acc.totalHT + ht,
      totalTTC: acc.totalTTC + ttc,
      totalTVA: acc.totalTVA + (ttc - ht)
    };
  }, { totalHT: 0, totalTTC: 0, totalTVA: 0 });

  /* ================= PREPARE OPTIONS FOR SEARCHABLE SELECT ================= */
  const produitOptions = produits.map((p) => ({
    value: p.id,
    label: p.label,
    type: p.type,
    prix: p.prix
  }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setErrMsg({}); // reset errors

    const validItems = items.filter((it) => it.produit_id);

    const payload = {
      client_id: selectedClient?.id,
      totale: Number(totals.totalTTC.toFixed(2)),
      items: validItems.map((it) => ({
        produit_id: it.produit_id,
        qtte: it.qtte,
        tax_rate: it.tax_rate,
      })),
    };

    try {
      await UpdateQuoteByID(id, payload, setErrMsg, navigate);
    } catch (e) {
      console.error(e);
      
    }
  };

  /* ================= UI ================= */
if (loading) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4 ${
          isDark ? 'border-white border-t-transparent' : 'border-blue-600 border-t-transparent'
        }`}></div>
        <p className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          Chargement du devis...
        </p>
      </div>
    </div>
  );
}


  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-bold`}>Modifier le Devis</h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm mt-1`}>
              Devis #{id} - Mise à jour des informations
            </p>
          </div>
          
          <Link
            to="/commercial/devis"
            className={`flex items-center gap-2 px-4 py-2 rounded border ${
              isDark ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ArrowLeft size={16} /> Retour
          </Link>
        </div>

        {/* CLIENT */}
        <div className={`rounded-lg border p-6 mb-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Informations Client</h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Client
            </label>
            <SearchableSelect
              options={clients.map(c => ({
                value: c.id,
                label: c.company_name,
                type: ""
              }))}
              value={selectedClient?.id || ""}
              onChange={(value) =>
                setSelectedClient(clients.find((c) => c.id === value))
              }
              placeholder="Sélectionner un client..."
              classNamePrefix={isDark ? "react-select-dark" : "react-select"}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  borderColor: isDark ? "#374151" : "#d1d5db",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: isDark ? "#fff" : "#000",
                }),
              }}
            />
            <ErrMsg msg={errMsg.errors?.client_id?.[0]} />
          </div>
        </div>

        {/* ITEMS */}
        <div className={`rounded-lg border p-6 mb-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Articles du Devis</h2>
          
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${isDark ? "border-gray-600" : "border-gray-200"} border-b`}>
                  <th className="px-3 py-2 text-left font-medium">Produit</th>
                  <th className="px-3 py-2 text-left font-medium">Quantité</th>
                  <th className="px-3 py-2 text-left font-medium">TVA %</th>
                  <th className="px-3 py-2 text-right font-medium">PU HT</th>
                  <th className="px-3 py-2 text-right font-medium">Total HT</th>
                  <th className="px-3 py-2 text-right font-medium">Total TTC</th>
                  <th className="px-3 py-2 text-center font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, index) => {
                  const produit = getProduit(it.produit_id);
                  const { ht, ttc } = calculateLineTotal(it);

                  return (
                    <tr key={index} className={`${isDark ? "border-gray-700" : "border-gray-100"} border-b`}>
                      <td className="px-3 py-3 relative">
                        <SearchableSelect
                          options={produitOptions}
                          value={it.produit_id}
                          onChange={(value) => updateProduit(index, value)}
                          placeholder="-- Sélectionner --"
                          classNamePrefix={isDark ? "react-select-dark" : "react-select"}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: isDark ? "#1f2937" : "#fff",
                              color: isDark ? "#fff" : "#000",
                              borderColor: isDark ? "#374151" : "#d1d5db",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: isDark ? "#1f2937" : "#fff",
                              color: isDark ? "#fff" : "#000",
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color: isDark ? "#fff" : "#000",
                            }),
                          }}
                        />
                        <ErrMsg msg={errMsg.errors?.[`items.${index}.produit_id`]?.[0]} />
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={1}
                          value={it.qtte}
                          onChange={(e) => updateItem(index, "qtte", e.target.value)}
                          disabled={produit?.type === "service" || produit?.type === "opération"}
                          className={`w-20 border px-2 py-1.5 rounded text-center ${
                            produit?.type === "service" || produit?.type === "opération"
                              ? `${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"} cursor-not-allowed`
                              : `${isDark ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"} focus:outline-none focus:border-blue-500`
                          }`}
                        />
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0}
                          value={it.tax_rate}
                          onChange={(e) => updateItem(index, "tax_rate", e.target.value)}
                          className={`w-20 border px-2 py-1.5 rounded text-center focus:outline-none ${
                            isDark ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" : "border-gray-300 focus:border-blue-500"
                          }`}
                        />
                      </td>

                      <td className="px-3 py-3 text-right">
                        {produit ? produit.prix.toFixed(2) : "—"} DH
                      </td>
                      <td className="px-3 py-3 text-right font-medium">
                        {produit ? ht.toFixed(2) : "—"} DH
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-blue-500">
                        {produit ? ttc.toFixed(2) : "—"} DH
                      </td>

                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => removeLine(index)}
                          className="p-1.5 text-red-500 hover:bg-red-600/10 rounded"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={addLine}
            className={`mt-4 flex items-center gap-2 px-4 py-2 text-sm rounded border ${
              isDark ? "text-blue-400 bg-gray-700 border-gray-600 hover:bg-gray-600" : "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <Plus size={16} /> Ajouter une ligne
          </button>
        </div>

        {/* TOTAL */}
        <div className={`rounded-lg border p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="space-y-2">
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <span>Total HT</span>
              <span className="text-lg font-semibold">{totals.totalHT.toFixed(2)} DH</span>
            </div>
            
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <span>Total TVA</span>
              <span className="text-lg font-semibold">{totals.totalTVA.toFixed(2)} DH</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="font-semibold">Total TTC</span>
              <span className="text-2xl font-bold text-blue-500">{totals.totalTTC.toFixed(2)} DH</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className={`px-6 py-2 rounded border hover:bg-gray-50 ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700"}`}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PageUpdateDevis;