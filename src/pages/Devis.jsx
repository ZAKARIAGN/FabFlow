import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GetAllClients } from "../services/ClientsService";
import { GetAllProduits } from "../services/ProduitService";
import { AddQuotes } from "../services/QuoteService";
import { Plus, Trash2 } from "lucide-react";
import SearchableSelect from "../compenet/SearchableSelect";
import ErrMsg from "../compenet/ErrMsg";

const DevisForm = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [items, setItems] = useState([
    { produit_id: "", qtte: 1, tax_rate: 0 },
  ]);
  const [errMsg, setErrMsg] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await GetAllClients(setErrMsg);
        setClients(clientsData || []);

        const produitsData = await GetAllProduits(setErrMsg);
        setProduits(
          produitsData.map((p) => ({
            ...p,
            prix: Number(p.prix),
          })),
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // ========== HELPERS ==========
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
          ? { ...it, produit_id: Number(produit_id), qtte: 1, tax_rate: 0 }
          : it,
      ),
    );
  };

  const addLine = () => {
    setItems((prev) => [...prev, { produit_id: "", qtte: 1, tax_rate: 0 }]);
  };

  const removeLine = (index) => {
    if (items.length === 1) {
      toast.error("Vous devez avoir au moins une ligne");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ========== TOTALS ==========
  const calculateLineTotal = (it) => {
    const produit = getProduit(it.produit_id);
    if (!produit) return { ht: 0, ttc: 0 };
    const ht = produit.prix * it.qtte;
    const ttc = ht + ht * (it.tax_rate / 100);
    return { ht, ttc };
  };

  const totals = items.reduce(
    (acc, it) => {
      const { ht, ttc } = calculateLineTotal(it);
      return {
        totalHT: acc.totalHT + ht,
        totalTTC: acc.totalTTC + ttc,
        totalTVA: acc.totalTVA + (ttc - ht),
      };
    },
    { totalHT: 0, totalTTC: 0, totalTVA: 0 },
  );

  const produitOptions = produits.map((p) => ({
    value: p.id,
    label: p.label,
    type: p.type,
    prix: p.prix,
  }));

  // ========== SUBMIT ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg({}); // reset errors

    const validItems = items.filter((it) => it.produit_id);

    const payload = {
      client_id: selectedClient,
      totale: Number(totals.totalTTC.toFixed(2)),
      items: validItems.map((it) => ({
        produit_id: it.produit_id,
        qtte: it.qtte,
        tax_rate: it.tax_rate,
      })),
    };

    try {
      await AddQuotes(payload, setErrMsg, navigate);
    } catch (err) {
      console.log(err);
      toast.error("Erreur lors de la création du devis");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nouveau Devis</h1>
          <p className="text-sm text-gray-600 mt-1">
            Créez un devis personnalisé pour vos clients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sélection du Client
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(Number(e.target.value))}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Choisissez un client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errMsg.errors?.client_id?.[0]} />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Articles du Devis
            </h2>

            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-gray-700 font-medium">
                      Produit
                    </th>
                    <th className="px-3 py-2 text-left text-gray-700 font-medium">
                      Quantité
                    </th>
                    <th className="px-3 py-2 text-left text-gray-700 font-medium">
                      TVA %
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700 font-medium">
                      PU HT
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700 font-medium">
                      Total HT
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700 font-medium">
                      Total TTC
                    </th>
                    <th className="px-3 py-2 text-center text-gray-700 font-medium"></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, index) => {
                    const produit = getProduit(it.produit_id);
                    const { ht, ttc } = calculateLineTotal(it);

                    return (
                      <tr key={index} className="border-b border-gray-100">
                        {/* Produit */}
                        <td className="px-3 py-3 relative">
                          <SearchableSelect
                            options={produitOptions}
                            value={it.produit_id}
                            onChange={(value) => updateProduit(index, value)}
                            placeholder="-- Sélectionner --"
                          />
                          <ErrMsg
                            msg={
                              errMsg.errors?.[`items.${index}.produit_id`]?.[0]
                            }
                          />
                        </td>

                        {/* Quantité */}
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min={1}
                            value={it.qtte}
                            onChange={(e) =>
                              updateItem(index, "qtte", e.target.value)
                            }
                            disabled={
                              produit?.type === "service" ||
                              produit?.type === "opération"
                            }
                            className={`w-20 border px-2 py-1.5 rounded text-center ${
                              produit?.type === "service" ||
                              produit?.type === "opération"
                                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                                : "border-gray-300 focus:outline-none focus:border-blue-500"
                            }`}
                          />
                        </td>

                        {/* TVA */}
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min={0}
                            value={it.tax_rate}
                            max={100}
                            onChange={(e) =>
                              updateItem(index, "tax_rate", e.target.value)
                            }
                            className="w-20 border border-gray-300 px-2 py-1.5 rounded text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>

                        {/* PU HT */}
                        <td className="px-3 py-3 text-right text-gray-900">
                          {produit ? produit.prix.toFixed(2) : "—"} DH
                        </td>

                        {/* Total HT */}
                        <td className="px-3 py-3 text-right font-medium text-gray-900">
                          {produit ? ht.toFixed(2) : "—"} DH
                        </td>

                        {/* Total TTC */}
                        <td className="px-3 py-3 text-right font-medium text-blue-600">
                          {produit ? ttc.toFixed(2) : "—"} DH
                        </td>

                        {/* Remove Line */}
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={addLine}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
              >
                <Plus size={16} /> Ajouter une ligne
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Total HT</span>
                <span className="text-lg font-semibold text-gray-900">
                  {totals.totalHT.toFixed(2)} DH
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Total TVA</span>
                <span className="text-lg font-semibold text-gray-900">
                  {totals.totalTVA.toFixed(2)} DH
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-900 font-semibold">Total TTC</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totals.totalTTC.toFixed(2)} DH
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Créer le Devis
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevisForm;
