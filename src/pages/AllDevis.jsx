import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentPDF from "../compenet/documentPdf";
import { GetAllQuotes, SearchQuote, updateStatusQuotes } from "../services/QuoteService";
import { updateStatusDeliveries } from "../services/DeliveryService";
import { updateStatusInvoices } from "../services/InvoiceService";

const AllDevis = ({ isDark }) => {
  const [documents, setDocuments] = useState([]);
  const [documentsSearched, setDocumentsSearched] = useState([]);
  const [query, setQuery] = useState("");
  const [errMsg, setErrMsg] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusOptions = {
    quote: ["validé", "annulé"],
    delivery: ["livré", "annulé"],
    invoice: ["payée", "en_attente"],
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await GetAllQuotes(setErrMsg);
      setDocuments(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors du chargement des documents" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setDocumentsSearched([]);
      return;
    }

    try {
      const data = await SearchQuote(value, setErrMsg);
      setDocumentsSearched(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors de la recherche" });
    }
  };

  const handleStatusChange = async (doc, newStatus) => {
    setLoadingId(doc.id);
    try {
      if (doc.type === "quote") {
        await updateStatusQuotes(doc.id, newStatus);
      } else if (doc.type === "delivery") {
        await updateStatusDeliveries(doc.id, newStatus);
      } else if (doc.type === "invoice") {
        await updateStatusInvoices(doc.id, newStatus);
      }

      await fetchDocuments();
      if (query.trim() !== "") {
        const data = await SearchQuote(query, setErrMsg);
        setDocumentsSearched(data || []);
      }
    } catch (err) {
      console.log(err);
      setErrMsg({ message: "Erreur lors de la mise à jour du statut" });
    } finally {
      setLoadingId(null);
    }
  };

  const dataSource = query.trim() === "" ? documents : documentsSearched;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-white' : 'border-[#3da9fc]'}`}></div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen animate-in fade-in duration-500 ${isDark ? 'bg-gray-900 text-gray-300' : ' text-gray-700'}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row md:flex-row gap-5 lg:gap-0 md:gap-0 sm:gap-2 justify-between items-center mb-8">
        <div className="text-center">
          <h1 className={`text-[20px] lg:text-2xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-[#094067]'}`}>
            Gestion des Devis
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-[#5f6c7b]'} text-[16px]`}>
            Consulter et gérer les devis
          </p>
        </div>

        <Link to="/commercial/ajouter-devis">
          <button className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isDark ? 'bg-blue-800 hover:bg-blue-700 text-white' : 'bg-[#094067] hover:bg-[#3da9fc] text-white'}`}>
            <Plus size={20} /> Créer Nouveau Devis
          </button>
        </Link>
      </div>

      {/* Error */}
      {errMsg.message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-700'}`}>
          {errMsg.message}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher un document..."
          className={`w-full p-2.5 border rounded-lg outline-none text-sm ${
            isDark
              ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-500'
              : 'border-[#90b4ce]/30 bg-white text-gray-700 placeholder-gray-500 focus:ring-[#3da9fc]'
          }`}
        />
      </div>

      {/* Documents Table */}
      <div className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${isDark ? 'border-gray-700 bg-gray-800' : 'border-[#90b4ce]/10 bg-white'}`}>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className={`${isDark ? 'bg-gray-700 border-gray-700' : 'bg-[#f8fafc] border-[#90b4ce]/10'} border-b`}>
            <tr className={`font-black text-[10px] uppercase tracking-widest ${isDark ? 'text-gray-300' : 'text-[#90b4ce]'}`}>
              <th className="p-4">N° Document</th>
              <th className="p-4">Client / Société</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">QTE</th>
              <th className="p-4">Total TTC</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-[#90b4ce]/5'}`}>
            {dataSource.length > 0 ? (
              dataSource.map((doc) => (
                <tr key={doc.id} className={`group transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#90b4ce]/5'}`}>
                  <td className={`p-4 font-bold text-xs ${isDark ? 'text-gray-200' : 'text-[#5f6c7b]'}`}>
                    {doc.number}
                  </td>
                  <td className={`p-4 font-bold ${isDark ? 'text-white' : 'text-[#094067]'}`}>
                    {doc.client?.company_name}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      doc.type === "delivery"
                        ? isDark ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-700'
                        : doc.type === "invoice"
                          ? isDark ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-700'
                          : isDark ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {doc.type === "quote" ? "DEVIS" : doc.type}
                    </span>
                  </td>
                  <td className={`p-4 text-center text-sm font-bold ${isDark ? 'text-gray-200' : 'text-[#5f6c7b]'}`}>
                    {doc.items?.reduce((s, l) => s + Number(l.qtte), 0)}
                  </td>
                  <td className={`p-4 text-sm font-black ${isDark ? 'text-white' : 'text-[#094067]'}`}>
                    {doc.totale?.toLocaleString("fr-FR")} DH
                  </td>
                  <td className="p-4">
                    <select
                      value={doc.status}
                      onChange={(e) => handleStatusChange(doc, e.target.value)}
                      disabled={loadingId === doc.id}
                      className={`p-2 border rounded w-full text-sm ${
                        doc.status === "annulé"
                          ? isDark ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-700'
                          : doc.status === "livré"
                          ? isDark ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-600'
                          : doc.status === "validé" || doc.status === "payée"
                          ? isDark ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-700'
                          : isDark ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-100 text-yellow-700'
                      } ${loadingId === doc.id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {statusOptions[doc.type]?.map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      {doc.type === "quote" && (
                        <Link to={`/commercial/modifier-devis/${doc.id}`}>
                          <button className={`p-1.5 rounded-lg ${isDark ? 'text-orange-300 hover:bg-orange-600/20' : 'text-orange-500 hover:bg-orange-50'}`}>
                            <Edit size={16} />
                          </button>
                        </Link>
                      )}
                      <Link to={`/commercial/documents/${doc.id}`}>
                        <button className={`p-1.5 rounded-lg ${isDark ? 'text-blue-300 hover:bg-blue-600/20' : 'text-[#3da9fc] hover:bg-[#3da9fc]/10'}`}>
                          <Eye size={16} />
                        </button>
                      </Link>
                      <PDFDownloadLink
                        document={<DocumentPDF doc={doc} />}
                        fileName={`${doc.type}_${doc.number}.pdf`}
                      >
                        <button className={`p-1.5 rounded-lg ${isDark ? 'text-red-300 hover:bg-red-600/20' : 'text-[#e11d48] hover:bg-rose-50'}`}>
                          <Download size={16} />
                        </button>
                      </PDFDownloadLink>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                  Aucun document trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDevis;
