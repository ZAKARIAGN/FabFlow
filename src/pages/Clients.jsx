import { Link, useLocation } from "react-router-dom";
import { Trash2, Edit, Search, UserPlus, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DeleteClient,
  GetAllClients,
  SearchClient,
} from "../services/ClientsService";

const Clients = ({ isDark }) => {
  const [clients, setClients] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [clientsSearched, setClientsSearched] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isCommercial = location.pathname.includes("/commercial");
  const isAdmin = location.pathname.includes("/admin");

  const addClientRoute = isCommercial
    ? "/commercial/ajouter-client"
    : "/admin/ajouter-client";

  const updateClientRoute = (clientId) =>
    isCommercial
      ? `/commercial/modifier-client/${clientId}`
      : `/admin/modifier-client/${clientId}`;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await GetAllClients(setErrMsg);
        setClients(data || []);
      } catch {
        setErrMsg({ message: "Erreur lors du chargement des clients" });
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    try {
      await DeleteClient(id, setErrMsg);
      setClients((prev) => prev.filter((c) => c.id !== id));
      setClientsSearched((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setErrMsg({ message: "Erreur lors de la suppression du client" });
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setClientsSearched([]);
      return;
    }
    try {
      const data = await SearchClient(value, setErrMsg);
      setClientsSearched(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors de la recherche" });
      console.log(errMsg);
    }
  };

  const dataSource = query.trim() === "" ? clients : clientsSearched;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc]"></div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 animate-in fade-in duration-500 mt-10 ${
        isDark ? "text-slate-100" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
            Gestion des Clients
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-[#5f6c7b]"} text-sm`}>
            Consultez et gérez l'annuaire de vos clients B2B.
          </p>
        </div>

        {(isCommercial || isAdmin) && (
          <Link to={addClientRoute}>
            <button className="bg-[#3da9fc] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#094067] transition-all shadow-md">
              <UserPlus size={20} />
              Nouveau Client
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-xl border flex items-center gap-4 ${
            isDark
              ? "bg-[#111827] border-slate-700"
              : "bg-white border-[#90b4ce]/20"
          }`}
        >
          <div className="p-2 bg-[#3da9fc]/10 rounded-lg text-[#3da9fc]">
            <Users size={20} />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${isDark ? "text-slate-400" : "text-[#90b4ce]"}`}>
              Total Clients
            </p>
            <p className={`text-lg font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
              {clients.length}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/20"
        }`}
      >
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 ${isDark ? "text-slate-500" : "text-[#90b4ce]"}`} size={18} />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Rechercher un client (Nom, VAT, Adresse)..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#3da9fc] ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                : "bg-[#90b4ce]/5 border-[#90b4ce]/20 text-black"
            }`}
          />
        </div>
      </div>

      <div
        className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/10"
        }`}
      >
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead
            className={`border-b ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-[#90b4ce]/5 border-[#90b4ce]/20"
            }`}
          >
            <tr>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Client / VAT
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Email
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Tel
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Adresse
              </th>
              {(isAdmin || isCommercial) && (
                <th className={`p-4 text-right font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className={isDark ? "divide-y divide-slate-700" : "divide-y divide-[#90b4ce]/10"}>
            {dataSource.length === 0 && (
              <tr>
                <td colSpan="5" className={`p-6 text-center ${isDark ? "text-slate-400" : "text-[#5f6c7b]"}`}>
                  Aucun client trouvé
                </td>
              </tr>
            )}

            {dataSource.map((client) => (
              <tr
                key={client.id}
                className={`transition-colors group ${
                  isDark ? "hover:bg-slate-800" : "hover:bg-[#90b4ce]/5"
                }`}
              >
                <td className="p-4">
                  <div className={`font-bold text-sm ${isDark ? "text-white" : "text-[#094067]"}`}>
                    {client.company_name}
                  </div>
                  <div className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-[#90b4ce]"}`}>
                    {client.vat_number}
                  </div>
                </td>

                <td className={`p-4 text-sm italic ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
                  {client.email}
                </td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    isDark
                      ? "bg-slate-700 text-slate-100"
                      : "bg-[#90b4ce]/10 text-[#094067]"
                  }`}>
                    {client.tel}
                  </span>
                </td>

                <td className="p-4">
                  <div className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
                    <MapPin size={14} className="text-[#3da9fc]" />
                    {client.address}
                  </div>
                </td>

                {(isAdmin || isCommercial) && (
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Link to={updateClientRoute(client.id)}>
                        <button className={`p-1.5 ${isDark ? "text-slate-300 hover:text-[#3da9fc]" : "text-[#3da9fc] lg:text-[#5f6c7b] lg:hover:text-[#3da9fc]"}`}>
                          <Edit size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(client.id)}
                        className={`p-1.5 ${isDark ? "text-slate-300 hover:text-[#ef4565]" : "text-[#ef4565] lg:text-[#5f6c7b] lg:hover:text-[#ef4565]"}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
