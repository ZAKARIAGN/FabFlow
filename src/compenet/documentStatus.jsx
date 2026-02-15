import React, { useState } from "react";

import { updateStatusQuotes } from "../services/QuoteService";
import { updateStatusDeliveries } from "../services/DeliveryService";
import { updateStatusInvoices } from "../services/InvoiceService";

const DocumentStatus = ({ doc, onStatusUpdated, loadingId, role }) => {
  const [loading, setLoading] = useState(false);

  // Status options based on document type
  const statusOptions = {
    quote: ["validé", "annulé"],
    delivery: ["livré", "annulé"],
    invoice: ["payée", "en_attente", "annulé"],
  };

  // Handle status change
  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      if (doc.type === "quote") {
        await updateStatusQuotes(doc.id, newStatus, () => {});
      } else if (doc.type === "delivery") {
        await updateStatusDeliveries(doc.id, newStatus, () => {});
      } else if (doc.type === "invoice") {
        await updateStatusInvoices(doc.id, newStatus, () => {});
      }

      onStatusUpdated(doc.id, newStatus);
      
    } catch (err) {
      
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const canEditStatus =
    (doc.type === "quote" && (role === "admin" || role === "commercial")) ||
    (doc.type === "delivery" && (role === "admin" || role === "atelier")) ||
    (doc.type === "invoice" && (role === "admin" || role === "comptable"));

  return (
    <div>
      {canEditStatus ? (
        <select
          value={doc.status || ""}
          onChange={handleChange}
          disabled={loading || loadingId === doc.id}
          className="px-2 py-1 text-sm rounded border border-gray-300 focus:outline-none"
        >
          {statusOptions[doc.type].map((status) => (
            <option key={status} value={status}>
              {status.toUpperCase()}
            </option>
          ))}
        </select>
      ) : (
        <span className="px-2 py-1 text-sm rounded bg-gray-100">
          {doc.status?.toUpperCase() || "-"}
        </span>
      )}
    </div>
  );
};

export default DocumentStatus;
