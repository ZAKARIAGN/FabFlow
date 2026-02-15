import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DeleteProduit,
  GetAllProduits,
  SearchProduit,
} from "../services/ProduitService";

const Produits = ({ isDark }) => {
  const [produits, setProduits] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [produitsSearched, setProduitsSearched] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isCommercial = location.pathname.includes("/commercial");
  const isAdmin = location.pathname.includes("/admin");

  const addProduitRoute = isCommercial
    ? "/commercial/ajouter-produit"
    : "/admin/ajouter-produit";

  const updateProduitRoute = (produitId) =>
    isCommercial
      ? `/commercial/modifier-produit/${produitId}`
      : `/admin/modifier-produit/${produitId}`;

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        const data = await GetAllProduits(setErrMsg);
        setProduits(data || []);
      } catch {
        setErrMsg({ message: "Erreur lors du chargement des produits" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduits();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await DeleteProduit(id, setErrMsg);
      setProduits((prev) => prev.filter((c) => c.id !== id));
      setProduitsSearched((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setErrMsg({ message: "Erreur lors de la suppression du produit" });
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setProduitsSearched([]);
      return;
    }
    try {
      const data = await SearchProduit(value, setErrMsg);
      setProduitsSearched(data || []);
    } catch {
      setErrMsg({ message: "Erreur lors de la recherche" });
      console.log(errMsg);
    }
  };

  const dataSource = query.trim() === "" ? produits : produitsSearched;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc]"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 mt-10 ${isDark ? "text-slate-100" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
            Catalogue Produits
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-[#5f6c7b]"}`}>
            Gérez vos articles, services et opérations industrielles.
          </p>
        </div>

        {(isCommercial || isAdmin) && (
          <Link to={addProduitRoute}>
            <button className="bg-[#3da9fc] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#094067] transition-all shadow-sm">
              <Plus size={20} /> Nouveau Produit
            </button>
          </Link>
        )}
      </div>

      <div
        className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/20"
        }`}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className={`absolute left-3 top-2.5 ${isDark ? "text-slate-500" : "text-[#90b4ce]"}`}
            size={18}
          />
          <input
            value={query}
            onChange={handleSearch}
            type="text"
            placeholder="Rechercher par nom de produit..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#3da9fc] ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                : "bg-[#90b4ce]/5 border-[#90b4ce]/20 text-black"
            }`}
          />
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
            isDark
              ? "border-slate-700 text-slate-300 hover:bg-slate-800"
              : "border-[#90b4ce]/30 text-[#5f6c7b] hover:bg-gray-50"
          }`}
        >
          <Filter size={16} /> Filtres
        </button>
      </div>

      <div
        className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/10"
        }`}
      >
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead
            className={`border-b ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-[#90b4ce]/5 border-[#90b4ce]/20"
            }`}
          >
            <tr>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Désignation
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Type
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Prix Unit.
              </th>
              <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Stock
              </th>
              <th className={`p-4 font-bold text-xs uppercase text-right ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className={isDark ? "divide-y divide-slate-700" : "divide-y divide-[#90b4ce]/10"}>
            {dataSource.length > 0 ? (
              dataSource.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors group ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-[#90b4ce]/5"
                  }`}
                >
                  <td className={`p-4 font-medium text-sm ${isDark ? "text-slate-200" : "text-[#5f6c7b]"}`}>
                    {p.label}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.type === "fabriqué"
                          ? "bg-blue-100 text-blue-600"
                          : p.type === "service"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>

                  <td className={`p-4 font-bold text-sm ${isDark ? "text-white" : "text-[#094067]"}`}>
                    {p.prix}
                  </td>

                  <td className={`p-4 font-bold text-sm ${isDark ? "text-white" : "text-[#094067]"}`}>
                    {p.stock}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Link to={updateProduitRoute(p.id)}>
                        <button
                          className={`p-1.5 ${
                            isDark
                              ? "text-slate-300 hover:text-[#3da9fc]"
                              : "text-[#3da9fc] lg:text-[#5f6c7b] lg:hover:text-[#3da9fc]"
                          }`}
                        >
                          <Edit size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className={`p-1.5 ${
                          isDark
                            ? "text-slate-300 hover:text-[#ef4565]"
                            : "text-[#ef4565] lg:text-[#5f6c7b] lg:hover:text-[#ef4565]"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className={`p-6 text-center ${isDark ? "text-slate-400" : "text-gray-400"}`}
                >
                  Aucun produit trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Produits;
