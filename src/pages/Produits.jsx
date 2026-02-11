import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DeleteProduit,
  GetAllProduits,
  SearchProduit,
} from "../services/ProduitService";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [query, setQuery] = useState("");
  const [produitsSearched, setProduitsSearched] = useState([]);

  // fetch produits
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const data = await GetAllProduits(setErrMsg);
        setProduits(data || []);
      } catch {
        setErrMsg({ message: "Erreur lors du chargement des produits" });
      }
    };
    fetchProduits();
  }, []);

  // handle delete produit
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#094067]">
            Catalogue Produits
          </h1>
          <p className="text-[#5f6c7b] text-sm">
            Gérez vos articles, services et opérations industrielles.
          </p>
        </div>
        {
          <Link to={"/admin/AddProduit"}>
            <button className="bg-[#3da9fc] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#094067] transition-all shadow-sm">
              <Plus size={20} /> Nouveau Produit
            </button>
          </Link>
        }
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#90b4ce]/20 flex flex-wrap gap-4 items-center">
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
        <button className="flex items-center gap-2 px-4 py-2 border border-[#90b4ce]/30 rounded-lg text-[#5f6c7b] text-sm hover:bg-gray-50">
          <Filter size={16} /> Filtres
        </button>
      </div>

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
                  Prix Unit.
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase">
                  Stock
                </th>
                <th className="p-4 text-[#094067] font-bold text-xs uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90b4ce]/10">
              {dataSource.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#90b4ce]/5 transition-colors group"
                >
                  <td className="p-4 text-[#5f6c7b] font-medium text-sm">
                    {p.label}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.type === "Fabriqué"
                          ? "bg-blue-100 text-blue-600"
                          : p.type === "Service"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="p-4 text-[#094067] font-bold text-sm">
                    {p.prix}
                  </td>
                  <td className="p-4 text-[#094067] font-bold text-sm">
                    {p.stock}
                  </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/updateProduit/${p.id}`}>
                          <button className="p-1.5 text-[#5f6c7b] hover:text-[#3da9fc]">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            handleDelete(p.id);
                          }}
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

export default Produits;
