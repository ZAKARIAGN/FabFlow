import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentPDF from "../compenet/documentPdf";
import {
  GetAllDoucuments,
  SearchDocuments,
} from "../services/DoucmentsService";
import { GetAllDeliveries, SearchDelivery, updateStatusDeliveries } from "../services/DeliveryService";
import { GetAllQuotes, updateStatusQuotes } from "../services/QuoteService";
import { updateStatusInvoices } from "../services/InvoiceService";

const AllDeliveries = ({isDark}) => {
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

  // Extract fetchDocuments to reuse it
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await GetAllDeliveries(setErrMsg);
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
      const data = await SearchDelivery(value, setErrMsg);
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

      // Automatic refresh after status change
      await fetchDocuments();
      
      // Also refresh search results if there's a query
      if (query.trim() !== "") {
        const data = await SearchDocuments(query, setErrMsg);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc]"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen animate-in fade-in duration-500 ${isDark ? "bg-gray-900 text-gray-200" : " text-gray-900"}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row md:flex-row gap-5 justify-between items-center mb-8">
        <div className="text-center">
          <h1 className={`text-[20px] lg:text-2xl font-black tracking-tighter uppercase ${isDark ? "text-white" : "text-[#094067]"}`}>
            Gestion des Bons de Livraison
          </h1>
          <p className={`${isDark ? "text-gray-300" : "text-[#5f6c7b]"} text-[16px]`}>
            Consulter et gérer les bons de livraison
          </p>
        </div>

      </div>

      {/* Error */}
      {errMsg.message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? "bg-red-800 text-red-200" : "bg-red-100 text-red-700"}`}>
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
          className={`w-full p-2.5 border rounded-lg outline-none text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-[#90b4ce]/30 text-gray-900"}`}
        />
      </div>

      {/* Documents Table */}
      <div className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${isDark ? "border-gray-700 bg-gray-800" : "border-[#90b4ce]/10 bg-white"}`}>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-[#f8fafc] border-[#90b4ce]/10"} border-b`}>
            <tr className={`${isDark ? "text-gray-300" : "text-[#90b4ce]"} font-black text-[10px] uppercase tracking-widest`}>
              <th className="p-4">N° Document</th>
              <th className="p-4">Client / Société</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">QTE</th>
              <th className="p-4">Total TTC</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-[#90b4ce]/5"}`}>
            {dataSource.length > 0 ? (
              dataSource.map((doc) => (
                <tr key={doc.id} className={`group hover:${isDark ? "bg-gray-700/50" : "bg-[#90b4ce]/5"} transition-colors`}>
                  <td className="p-4 font-bold text-xs">{doc.number}</td>
                  <td className="p-4 font-bold">{doc.client?.company_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      doc.type === "delivery" ? (isDark ? "bg-purple-800 text-purple-300" : "bg-purple-100 text-purple-700")
                      : doc.type === "invoice" ? (isDark ? "bg-green-800 text-green-300" : "bg-green-100 text-green-700")
                      : (isDark ? "bg-blue-800 text-blue-300" : "bg-blue-100 text-blue-700")
                    }`}>
                      {doc.type === "quote" ? "DEVIS" : doc.type}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm font-bold">{doc.items?.reduce((s, l) => s + Number(l.qtte), 0)}</td>
                  <td className="p-4 text-sm font-black">{doc.totale?.toLocaleString("fr-FR")} DH</td>
                  <td className="p-4">
                    <select
                      value={doc.status}
                      onChange={(e) => handleStatusChange(doc, e.target.value)}
                      disabled={loadingId === doc.id}
                      className={`p-2 border rounded w-full text-sm ${
                        doc.status === "annulé"
                          ? `${isDark ? "bg-red-800 text-red-200" : "bg-red-100 text-red-700"}`
                          : doc.status === "livré"
                          ? `${isDark ? "bg-blue-400 text-blue-600" : "bg-blue-100 text-blue-600"}`
                          : doc.status === "validé" || doc.status === "payée"
                          ? `${isDark ? "bg-green-800 text-green-300" : "bg-green-100 text-green-700"}`
                          : `${isDark ? "bg-yellow-800 text-yellow-300" : "bg-yellow-100 text-yellow-700"}`
                      } ${loadingId === doc.id ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {statusOptions[doc.type]?.map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">

                      <Link to={`/atelier/documents/${doc.id}`}>
                        <button className="p-1.5 text-[#3da9fc] hover:bg-[#3da9fc]/10 rounded-lg">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <PDFDownloadLink
                        document={<DocumentPDF doc={doc} />}
                        fileName={`${doc.type}_${doc.number}.pdf`}
                      >
                        <button className="p-1.5 text-[#e11d48] hover:bg-rose-50 rounded-lg">
                          <Download size={16} />
                        </button>
                      </PDFDownloadLink>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={`p-6 text-center ${isDark ? "text-gray-400" : "text-gray-400"}`}>
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

export default AllDeliveries;