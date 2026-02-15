import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentPDF from "../compenet/documentPdf";
import {
  GetAllDoucuments,
  SearchDocuments,
} from "../services/DoucmentsService";
import { updateStatusDeliveries } from "../services/DeliveryService";
import { updateStatusQuotes } from "../services/QuoteService";
import { updateStatusInvoices } from "../services/InvoiceService";
import ErrMsg from "../compenet/ErrMsg";

const AllDocuments = ({ isDark }) => {
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
      setErrMsg({});
      const data = await GetAllDoucuments(setErrMsg);
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
    setErrMsg({});

    if (value.trim() === "") {
      setDocumentsSearched([]);
      return;
    }

    try {
      const data = await SearchDocuments(value, setErrMsg);
      setDocumentsSearched(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors de la recherche" });
      console.l(errMsg);
    }
  };

  const handleStatusChange = async (doc, newStatus) => {
    setLoadingId(doc.id);
    setErrMsg({});
    try {
      if (doc.type === "quote") await updateStatusQuotes(doc.id, newStatus);
      else if (doc.type === "delivery")
        await updateStatusDeliveries(doc.id, newStatus);
      else if (doc.type === "invoice")
        await updateStatusInvoices(doc.id, newStatus);

      await fetchDocuments();
      if (query.trim() !== "") {
        const data = await SearchDocuments(query, setErrMsg);
        setDocumentsSearched(data || []);
      }
    } catch {
      setErrMsg({ message: "Erreur lors de la mise à jour du statut" });
    } finally {
      setLoadingId(null);
    }
  };

  const dataSource = query.trim() ? documentsSearched : documents;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc]"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen animate-in fade-in duration-500 ${isDark ? "text-slate-100" : ""}`}>
      <div className="flex flex-col lg:flex-row md:flex-row gap-5 lg:gap-0 md:gap-0 sm:gap-2 justify-between items-center mb-8">
        <div className="text-center">
          <h1
            className={`text-[20px] lg:text-2xl font-black tracking-tighter uppercase ${
              isDark ? "text-white" : "text-[#094067]"
            }`}
          >
            Gestion des Documents
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-[#5f6c7b]"} text-[16px]`}>
            Consulter et gérer les flux de documents
          </p>
        </div>

        <Link to="/admin/ajouter-devis">
          <button className="w-[150px] lg:w-[220px] md:w-[200px] sm:w-[200px] text-[10px] lg:text-sm md:text-sm sm:text-sm bg-[#094067] hover:bg-[#3da9fc] text-white lg:px-6 px-2 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
            <Plus size={20} />
            Créer Nouveau Devis
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher un document..."
          className={`w-full p-2.5 border rounded-lg outline-none text-sm ${
            isDark
              ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              : "border-[#90b4ce]/30 text-black"
          }`}
        />
      </div>

      <div
        className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/10"
        }`}
      >
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead
            className={`border-b ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-[#f8fafc] border-[#90b4ce]/10"
            }`}
          >
            <tr
              className={`font-black text-[10px] uppercase tracking-widest ${
                isDark ? "text-slate-300" : "text-[#90b4ce]"
              }`}
            >
              <th className="p-4">N° Document</th>
              <th className="p-4">Client / Société</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">QTE</th>
              <th className="p-4">Total TTC</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={isDark ? "divide-y divide-slate-700" : "divide-y divide-[#90b4ce]/5"}>
            {dataSource.length > 0 ? (
              dataSource.map((doc) => (
                <tr
                  key={doc.id}
                  className={`group transition-colors ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-[#90b4ce]/5"
                  }`}
                >
                  <td className={`p-4 font-bold text-xs ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
                    {doc.number}
                  </td>

                  <td className={`p-4 font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
                    {doc.client?.company_name}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.type === "delivery"
                          ? "bg-purple-100 text-purple-700"
                          : doc.type === "invoice"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {doc.type === "quote" ? "DEVIS" : doc.type}
                    </span>
                  </td>

                  <td className={`p-4 text-center text-sm font-bold ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
                    {doc.items?.reduce((s, l) => s + Number(l.qtte), 0)}
                  </td>

                  <td className={`p-4 text-sm font-black ${isDark ? "text-white" : "text-[#094067]"}`}>
                    {doc.totale?.toLocaleString("fr-FR")} DH
                  </td>

                  <td className="p-4">
                    <select
                      value={doc.status}
                      onChange={(e) => handleStatusChange(doc, e.target.value)}
                      disabled={loadingId === doc.id}
                      className={`p-2 border rounded w-full text-sm ${
                        doc.status === "annulé"
                          ? "bg-red-100 text-red-700"
                          : doc.status === "livré"
                          ? "bg-blue-100 text-blue-600"
                          : doc.status === "validé" || doc.status === "payée"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      } ${loadingId === doc.id ? "opacity-50 cursor-wait" : ""}`}
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
                        <Link to={`/admin/modifier-devis/${doc.id}`}>
                          <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg">
                            <Edit size={16} />
                          </button>
                        </Link>
                      )}

                      <Link to={`/admin/documents/${doc.id}`}>
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
                <td
                  colSpan="7"
                  className={`p-6 text-center ${isDark ? "text-slate-400" : "text-gray-400"}`}
                >
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

export default AllDocuments;
