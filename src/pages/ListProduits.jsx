import { Search, Filter, Package } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GetAllProduits,
  SearchProduit,
} from "../services/ProduitService";

const ProduitsView = () => {
  const [produits, setProduits] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [produitsSearched, setProduitsSearched] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch produits
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

  // handle search
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

  // choose data source
  const dataSource = query.trim() === "" ? produits : produitsSearched;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3da9fc] mx-auto mb-4"></div>
          <p className="text-[#094067] font-semibold">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 mt-10 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Package className="text-[#094067]" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-[#094067]">
            Catalogue Produits
          </h1>
          <p className="text-[#5f6c7b] text-sm">
            Consultez la liste des articles, services et opérations industrielles.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errMsg.message && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errMsg.message}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#90b4ce]/20 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-2.5 text-[#90b4ce]"
            size={18}
          />
          <input
            value={query}
            onChange={handleSearch}
            type="text"
            placeholder="Rechercher par nom de produit..."
            className="w-full pl-10 pr-4 py-2 bg-[#90b4ce]/5 border border-[#90b4ce]/20 rounded-lg text-sm focus:outline-none focus:border-[#3da9fc]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#90b4ce]/30 rounded-lg text-[#5f6c7b] text-sm hover:bg-gray-50 transition-all">
          <Filter size={16} /> Filtres
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#90b4ce]/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90b4ce]/5 border-b border-[#90b4ce]/20">
              <tr>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Désignation
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Type
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Unité
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Prix Unit. (DH)
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90b4ce]/10">
              {dataSource.length > 0 ? (
                dataSource.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#90b4ce]/5 transition-colors"
                  >
                    <td className="p-4 text-[#5f6c7b] font-medium text-sm">
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
                    <td className="p-4 text-[#5f6c7b] text-sm">
                      {p.unite || "N/A"}
                    </td>
                    <td className="p-4 text-[#094067] font-bold text-sm">
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
                    <Package className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-400 font-medium">
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

        {/* Total Count */}
        {dataSource.length > 0 && (
          <div className="bg-[#90b4ce]/5 px-4 py-3 border-t border-[#90b4ce]/20">
            <p className="text-sm text-[#5f6c7b]">
              <span className="font-bold text-[#094067]">
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