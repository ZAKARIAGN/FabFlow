import { Link, useLocation } from "react-router-dom";
import { Trash2, Edit, Search, UserPlus, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DeleteClient,
  GetAllClients,
  SearchClient,
} from "../services/ClientsService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [clientsSearched, setClientsSearched] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current location to determine user role
  const location = useLocation();
  const isCommercial = location.pathname.includes("/commercial");
  
  // Determine route based on current path
  const addClientRoute = isCommercial 
    ? "/commercial/Addclients" 
    : "/admin/Addclients";

  const updateClientRoute = (clientId) => 
    isCommercial
      ? `/commercial/modifier-client/${clientId}`
      : `/admin/modifier-client/${clientId}`;

  // fetch clients
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

  // handle delete client
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

  // handle search
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
    }
  };

  // choose data source
  const dataSource = query.trim() === "" ? clients : clientsSearched;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#094067]">
            Gestion des Clients
          </h1>
          <p className="text-[#5f6c7b] text-sm">
            Consultez et gérez l'annuaire de vos clients B2B.
          </p>
          {errMsg.message && (
            <div className="text-red-500 text-sm mt-1">{errMsg.message}</div>
          )}
        </div>

        <Link to={addClientRoute}>
          <button className="bg-[#3da9fc] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#094067] transition-all shadow-md">
            <UserPlus size={20} />
            Nouveau Client
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#90b4ce]/20 flex items-center gap-4">
          <div className="p-2 bg-[#3da9fc]/10 rounded-lg text-[#3da9fc]">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#90b4ce] font-bold">
              Total Clients
            </p>
            <p className="text-lg font-bold text-[#094067]">{clients.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-[#90b4ce]/20">
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-[#90b4ce]"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Rechercher un client (Nom, VAT, Adresse)..."
            className="w-full pl-10 pr-4 py-2 bg-[#90b4ce]/5 border border-[#90b4ce]/20 rounded-lg text-sm focus:outline-none focus:border-[#3da9fc]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#90b4ce]/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90b4ce]/5 border-b border-[#90b4ce]/20">
              <tr>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Client / VAT
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Email
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Tel
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Adresse
                </th>
                <th className="p-4 text-right text-[#094067] font-bold text-xs uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#90b4ce]/10">
              {dataSource.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-[#5f6c7b]">
                    Aucun client trouvé
                  </td>
                </tr>
              )}

              {dataSource.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-[#90b4ce]/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="text-[#094067] font-bold text-sm">
                      {client.company_name}
                    </div>
                    <div className="text-[#90b4ce] text-[10px] font-mono">
                      {client.vat_number}
                    </div>
                  </td>

                  <td className="p-4 text-[#5f6c7b] text-sm italic">
                    {client.email}
                  </td>

                  <td className="p-4 text-center">
                    <span className="bg-[#90b4ce]/10 text-[#094067] px-2 py-1 rounded text-xs font-bold">
                      {client.tel}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[#5f6c7b] text-sm">
                      <MapPin size={14} className="text-[#3da9fc]" />
                      {client.address}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={updateClientRoute(client.id)}>
                        <button className="p-1.5 text-[#5f6c7b] hover:text-[#3da9fc]">
                          <Edit size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-1.5 text-[#5f6c7b] hover:text-[#ef4565]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;