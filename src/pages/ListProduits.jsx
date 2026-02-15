import { Search, Package } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GetAllProduits,
  SearchProduit,
} from "../services/ProduitService";

const ProduitsView = ({ isDark }) => {
  const [produits, setProduits] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [produitsSearched, setProduitsSearched] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  const dataSource = query.trim() === "" ? produits : produitsSearched;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc] mx-auto mb-4"></div>
          <p className={`${isDark ? "text-slate-200" : "text-[#094067]"} font-semibold`}>
            Chargement des produits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 mt-10 p-6 ${isDark ? "text-slate-100" : ""}`}>
      <div className="flex items-center gap-3">
        <Package className={isDark ? "text-white" : "text-[#094067]"} size={32} />
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
            Catalogue Produits
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-[#5f6c7b]"}`}>
            Consultez la liste des articles, services et opérations industrielles.
          </p>
        </div>
      </div>

      {errMsg.message && (
        <div className={`p-3 rounded-lg text-sm ${
          isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
        }`}>
          {errMsg.message}
        </div>
      )}

      <div
        className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center shadow-sm ${
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
      </div>

      <div
        className={`rounded-xl border overflow-hidden shadow-sm ${
          isDark ? "bg-[#111827] border-slate-700" : "bg-white border-[#90b4ce]/20"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                  Unité
                </th>
                <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                  Prix Unit. (DH)
                </th>
                <th className={`p-4 font-bold text-xs uppercase ${isDark ? "text-slate-200" : "text-[#094067]"}`}>
                  Stock
                </th>
              </tr>
            </thead>

            <tbody className={isDark ? "divide-y divide-slate-700" : "divide-y divide-[#90b4ce]/10"}>
              {dataSource.length > 0 ? (
                dataSource.map((p) => (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
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

                    <td className={`p-4 text-sm ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
                      {p.unite || "N/A"}
                    </td>

                    <td className={`p-4 font-bold text-sm ${isDark ? "text-white" : "text-[#094067]"}`}>
                      {Number(p.prix).toFixed(2)} DH
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          p.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <Package
                      className={`mx-auto mb-3 ${isDark ? "text-slate-600" : "text-gray-300"}`}
                      size={48}
                    />
                    <p className={`${isDark ? "text-slate-400" : "text-gray-400"} font-medium`}>
                      {query.trim() !== ""
                        ? "Aucun produit trouvé pour cette recherche"
                        : "Aucun produit disponible"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {dataSource.length > 0 && (
          <div
            className={`px-4 py-3 border-t ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-[#90b4ce]/5 border-[#90b4ce]/20"
            }`}
          >
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-[#5f6c7b]"}`}>
              <span className={`font-bold ${isDark ? "text-white" : "text-[#094067]"}`}>
                {dataSource.length}
              </span>{" "}
              {dataSource.length > 1 ? "produits trouvés" : "produit trouvé"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProduitsView;
