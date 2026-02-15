import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddClient } from "../services/ClientsService";
import ErrMsg from "../compenet/ErrMsg";

const ClientForm = ({ isDark }) => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState({});

  const [clientInfos, setClientInfos] = useState({
    vat_number: "",
    company_name: "",
    address: "",
    email: "",
    tel: "",
  });

  const HandleChange = (e) => {
    setClientInfos({
      ...clientInfos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrMsg({});
      await AddClient(clientInfos, setErrMsg, navigate);
    } catch (err) {
      console.log(err);
    }
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
        Informations Client
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Vat Number
            </label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.vat_number}
              name="vat_number"
              placeholder="Ex: 12931723192"
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.vat_number?.[0]} />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Nom du Client / Raison Sociale
            </label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.company_name}
              name="company_name"
              placeholder="Ex: Sodal Maghreb"
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.company_name?.[0]} />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Email de contact
            </label>
            <input
              onChange={HandleChange}
              type="email"
              value={clientInfos.email}
              name="email"
              placeholder="client@mail.com"
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.email?.[0]} />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-bold uppercase ${
                isDark ? "text-slate-400" : "text-[#5f6c7b]"
              }`}
            >
              Numero Tel
            </label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.tel}
              name="tel"
              placeholder="Ex: 0622017665"
              className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
              }`}
            />
            <ErrMsg msg={errMsg.errors?.tel?.[0]} />
          </div>
        </div>

        <div className="space-y-1">
          <label
            className={`text-xs font-bold uppercase ${
              isDark ? "text-slate-400" : "text-[#5f6c7b]"
            }`}
          >
            Adresse Complète
          </label>
          <textarea
            onChange={HandleChange}
            value={clientInfos.address}
            name="address"
            rows="2"
            className={`w-full p-2.5 border rounded-lg outline-none text-sm focus:border-[#3da9fc] ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                : "bg-[#f8fafc] border-[#90b4ce]/30 text-black"
            }`}
          ></textarea>
          <ErrMsg msg={errMsg.errors?.address?.[0]} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              isDark
                ? "text-slate-300 hover:bg-slate-800"
                : "text-[#5f6c7b] hover:bg-gray-100"
            }`}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#3da9fc] text-white font-bold rounded-lg hover:bg-[#094067] transition-all"
          >
            Enregistrer Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
