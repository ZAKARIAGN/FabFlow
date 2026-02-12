import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddProduit } from "../services/ProduitService";
import ErrMsg from "../compenet/ErrMsg";

const ProduitForm = () => {
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
    <div className="bg-white p-6 rounded-xl border border-[#90b4ce]/20 shadow-sm">
      <h2 className="text-lg font-bold text-[#094067] mb-6 border-b pb-2">
        Détails du Produit / Service
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Désignation */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#5f6c7b] uppercase">
            Désignation
          </label>
          <input
            name="label"
            value={ProduitsInfo.label}
            onChange={HandleChange}
            type="text"
            className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
          />
          <ErrMsg msg={errMsg.errors?.label?.[0]} />
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#5f6c7b] uppercase">
            Type
          </label>
          <select
            name="type"
            value={ProduitsInfo.type}
            onChange={HandleChange}
            className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
          >
            <option value="">Choisir le type</option>
            <option value="fabriqué">Fabriqué</option>
            <option value="opération">Opération</option>
            <option value="service">Service</option>
          </select>
          <ErrMsg msg={errMsg.errors?.type?.[0]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prix */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">
              Prix
            </label>
            <input
              name="prix"
              value={ProduitsInfo.prix}
              onChange={HandleChange}
              type="number"
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
            />
            <ErrMsg msg={errMsg.errors?.prix?.[0]} />
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">
              Stock
            </label>
            <input
              name="stock"
              value={ProduitsInfo.stock}
              onChange={HandleChange}
              type="number"
              disabled={ProduitsInfo.type !== "fabriqué"}
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm disabled:bg-gray-100"
            />
            <ErrMsg msg={errMsg.errors?.stock?.[0]} />
          </div>

          {/* Unité */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">
              Unité
            </label>
            <select
              name="unite"
              value={ProduitsInfo.unite}
              onChange={HandleChange}
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
          onClick={()=>navigate(-1)}
            className="px-6 py-2 text-[#5f6c7b] hover:bg-gray-100 rounded-lg"
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
