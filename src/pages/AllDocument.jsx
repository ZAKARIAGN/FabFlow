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

const AllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsSearched, setDocumentsSearched] = useState([]);
  const [query, setQuery] = useState("");
  const [errMsg, setErrMsg] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const statusOptions = {
    quote: ["validé", "annulé"],
    delivery: ["livré", "annulé"],
    invoice: ["payée", "en_attente"],
  };

  // Extract fetchDocuments to reuse it
  const fetchDocuments = async () => {
    try {
      const data = await GetAllDoucuments(setErrMsg);
      setDocuments(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors du chargement des documents" });
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
      const data = await SearchDocuments(value, setErrMsg);
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

  return (
    <div className="p-6 min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#094067] tracking-tighter uppercase">
            Gestion des Documents
          </h1>
          <p className="text-[#5f6c7b] text-sm">
            Consulter et gérer les flux de documents
          </p>
        </div>

        <Link to="/admin/ajouter-devis">
          <button className="bg-[#094067] hover:bg-[#3da9fc] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
            <Plus size={20} /> Créer Nouveau Devis
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher un document..."
          className="w-full p-2.5 border border-[#90b4ce]/30 rounded-lg outline-none text-sm"
        />
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-[#90b4ce]/20 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#90b4ce]/10">
            <tr className="text-[#90b4ce] font-black text-[10px] uppercase tracking-widest">
              <th className="p-4">N° Document</th>
              <th className="p-4">Client / Société</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-center">QTE</th>
              <th className="p-4">Total TTC</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#90b4ce]/5">
            {dataSource.map((doc) => (
              <tr
                key={doc.id}
                className="group hover:bg-[#90b4ce]/5 transition-colors"
              >
                <td className="p-4 font-bold text-xs text-[#5f6c7b]">
                  {doc.number}
                </td>
                <td className="p-4 font-bold text-[#094067]">
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
                <td className="p-4 text-center text-sm font-bold text-[#5f6c7b]">
                  {doc.items?.reduce((s, l) => s + Number(l.qtte), 0)}
                </td>
                <td className="p-4 text-sm font-black text-[#094067]">
                  {doc.totale?.toLocaleString("fr-FR")} DH
                </td>
                <td className="p-4">
                  <select
                    value={doc.status}
                    onChange={(e) =>
                      handleStatusChange(doc, e.target.value)
                    }
                    disabled={loadingId === doc.id}
                    className={`p-2 border rounded w-full text-sm ${
                      doc.status === "annulé"
                        ? "bg-red-100 text-red-700"
                        : doc.status === "validé" ||
                          doc.status === "payée" ||
                          doc.status === "livré"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {statusOptions[doc.type]?.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.type === "quote" && (
                      <Link to={`/admin/update-devis/${doc.id}`}>
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
                      fileName={`${doc.category}_${doc.number}.pdf`}
                    >
                      {({ loading }) => (
                        <button className="p-1.5 text-[#e11d48] hover:bg-rose-50 rounded-lg">
                          <Download size={16} />
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDocuments;