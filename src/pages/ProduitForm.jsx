import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddProduit } from "../services/ProduitService";
import ErrMsg from "../compenet/ErrMsg";

const ProduitForm = ({ isDark }) => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState({});

  const [ProduitsInfo, setProduitsInfo] = useState({
    label: "",
    type: "",
    prix: "",
    unite: "",
    stock: "",
  });

  const HandleChange = (e) => {
    setProduitsInfo({
      ...ProduitsInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg({});
    await AddProduit(ProduitsInfo, setErrMsg, navigate);
  };

  return (
    <div
      className={`p-6 rounded-xl border shadow-sm ${
        isDark
          ? "bg-[#111827] border-slate-700"
          : "bg-white border-[#90b4ce]/20"
      }`}
    >
      <h2
        className={`text-lg font-bold mb-6 border-b pb-2 ${
          isDark ? "text-white border-slate-700" : "text-[#094067]"
        }`}
      >
        Détails du Produit / Service
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label
            className={`text-xs font-bold uppercase ${
              isDark ? "text-slate-400" : "text-[#5f6c7b]"
            }`}
          >
            Désignation
          </label>
          <input
            name="label"
            value={ProduitsInfo.label}
            onChange={HandleChange}
            type="text"
            className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
            }`}
          />
          <ErrMsg msg={errMsg.errors?.label?.[0]} />
        </div>

        <div className="space-y-1">
          <label
            className={`text-xs font-bold uppercase ${
              isDark ? "text-slate-400" : "text-[#5f6c7b]"
            }`}
          >
            Type
          </label>
          <select
            name="type"
            value={ProduitsInfo.type}
            onChange={HandleChange}
            className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
            }`}
          >
            <option value="">Choisir le type</option>
            <option value="fabriqué">Fabriqué</option>
            <option value="opération">Opération</option>
            <option value="service">Service</option>
          </select>
          <ErrMsg msg={errMsg.errors?.type?.[0]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Prix
            </label>
            <input
              name="prix"
              value={ProduitsInfo.prix}
              onChange={HandleChange}
              type="number"
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.prix?.[0]} />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Stock
            </label>
            <input
              name="stock"
              value={ProduitsInfo.stock}
              onChange={HandleChange}
              type="number"
              disabled={ProduitsInfo.type !== "fabriqué"}
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white disabled:bg-slate-900 disabled:text-slate-500"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black disabled:bg-gray-100"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.stock?.[0]} />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Unité
            </label>
            <select
              name="unite"
              value={ProduitsInfo.unite}
              onChange={HandleChange}
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            >
              <option value="">Choisir une unité</option>
              <option value="Pièce">Pièce</option>
              <option value="Heure">Heure</option>
              <option value="Mètre">Mètre</option>
              <option value="Kg">Kg</option>
            </select>
            <ErrMsg msg={errMsg.errors?.unite?.[0]} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isDark
                ? "text-slate-300 hover:bg-slate-800"
                : "text-[#5f6c7b] hover:bg-gray-100"
            }`}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#3da9fc] text-white font-bold rounded-lg hover:bg-[#094067]"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProduitForm;
