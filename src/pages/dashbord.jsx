import React, { useEffect, useState } from "react";
import {
  GetAllClients,
  getTopClientsByPaidInvoices,
} from "../services/ClientsService";
import { GetValideQuotes } from "../services/QuoteService";
import { GetValideDeliveries } from "../services/DeliveryService";
import { GetSumInvoice } from "../services/InvoiceService";

const Dashboard = ({isDark}) => {
  const [stats, setStats] = useState({
    totalPaidInvoices: 0,
    countValidQuotes: 0,
    countDelivered: 0,
    totalClients: 0,
    topClients: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Récupérer toutes les données en parallèle
        const [
          totalPaidInvoices,
          topClients,
          validQuotes,
          deliveredItems,
          allClients,
        ] = await Promise.all([
          GetSumInvoice(setError),
          getTopClientsByPaidInvoices(setError),
          GetValideQuotes(setError),
          GetValideDeliveries(setError),
          GetAllClients(setError),
        ]);

        setStats({
          totalPaidInvoices: totalPaidInvoices || 0,
          countValidQuotes: validQuotes?.length || 0,
          countDelivered: deliveredItems?.length || 0,
          totalClients: allClients?.length || 0,
          topClients: topClients?.slice(0, 5) || [],
        });
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`${isDark? 'bg-[#0f172a]' : ''} flex items-center justify-center min-h-screen `}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDark? 'bg-[#0f172a]' : 'bg-gray-50'} flex items-center justify-center min-h-screen `}>
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  const lightStyles = {
    mainContainer: "min-h-screen w-full bg-white transition-colors duration-300",
    card: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4",
    textMain: "text-gray-800",
    textMuted: "text-gray-500",
    row: "bg-gray-50 hover:bg-gray-100 border-transparent"
  }

  const darkStyles = {
    mainContainer: "min-h-screen w-full bg-[#0f172a] transition-colors duration-300",
    card: "bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-700/50 border-l-4",
    textMain: "text-white",
    textMuted: "text-gray-400",
    row: "bg-[#0f172a]/50 hover:bg-gray-800/50 border-gray-700/30"
  };
  return (
    <div className={` ${isDark ? darkStyles.mainContainer  : lightStyles.mainContainer } 
    `}>
      <h1 className={`${isDark ? darkStyles.textMain : lightStyles.textMain} text-3xl font-bold text-gray-800 mb-8`}>Tableau de Bord</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Invoices Payées */}
        <div className={`${isDark ? darkStyles.card : 'bg-white rounded-lg shadow p-6 border-l-4 border-green-500 '}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-600'} text-sm mb-1`}>Invoices Payées</p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-800'} text-2xl font-bold `}>
                {stats.totalPaidInvoices.toLocaleString("fr-MA")} DH
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Nombre de Devis Validés */}
        <div className={ `${isDark ? darkStyles.card :'bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-600'} text-sm mb-1`}>Devis Validés</p>
              <p className= {`${isDark ? darkStyles.textMain : 'text-gray-800'} text-2xl font-bold `}>
                {stats.countValidQuotes}
              </p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-500 text-xs mt-1' }`}>Documents</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Nombre de BL Livrés */}
        <div className={`${isDark ? darkStyles.card :"bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-600'} text-sm mb-1`}>BL Livrés</p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-800'} text-2xl font-bold `}>
                {stats.countDelivered}
              </p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-500 text-xs mt-1' }`}>Documents</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className={`${isDark? darkStyles.card : "bg-white rounded-lg shadow p-6 border-l-4 border-orange-500"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-600'} text-sm mb-1`}>Total Clients</p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-800'} text-2xl font-bold `}>
                {stats.totalClients}
              </p>
              <p className={`${isDark ? darkStyles.textMain : 'text-gray-500 text-xs mt-1' }`}>Clients actifs</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Clients */}
      <div className={`${isDark? 'bg-[#1e293b] rounded-lg shadow' : 'bg-white rounded-lg shadow'}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className={`${isDark?'text-white':'text-gray-800'} text-xl font-bold`}>Top 5 Clients</h2>
          <p className={`${isDark?'text-white':'text-gray-600'} text-sm `}>
            Classement par invoices payées
          </p>
        </div>
        <div className="p-6">
          {stats.topClients.length > 0 ? (
            <div className="space-y-4">
              {stats.topClients.map((client, index) => (
                <div
                  key={client.id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {client.company_name}
                      </p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {(
                        client.total_paid ||
                        client.totalPaid ||
                        0
                      ).toLocaleString("fr-MA")}{" "}
                      DH
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.invoice_count || client.invoiceCount || 0}{" "}
                      invoice(s)
                      </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun client trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;