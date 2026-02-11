import { Link, useNavigate, useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { GetClientById, UpdateClientByID } from "../services/ClientsService";
import ErrMsg from "../compenet/ErrMsg";

const UpdateClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clientInfos, setClientInfos] = useState({
    vat_number: "",
    company_name: "",
    address: "",
    email: "",
    tel: "",
  });

  const [errMsg, setErrMsg] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetClientById(id, setErrMsg,navigate);
        setClientInfos(data);
      } catch (err) {
        console.error("Erreur fetch:", err);
      }
    };
    fetchData();
  }, [id]);

  const HandleChange = (e) => {
    setClientInfos({
      ...clientInfos,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setErrMsg({});
      await UpdateClientByID(clientInfos, setErrMsg,navigate);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl border border-[#90b4ce]/20 shadow-sm">
      <h2 className="text-lg font-bold text-[#094067] mb-6 border-b pb-2">
        Informations Client
      </h2>

      <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vat Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">Vat Number</label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.vat_number}
              name="vat_number"
              placeholder="Ex: 29193128912"
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
            />
            <ErrMsg msg={errMsg.errors?.vat_number?.[0]} />
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">Nom du Client / Raison Sociale</label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.company_name}
              name="company_name"
              placeholder="Ex: Sodal Maghreb"
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
            />
            <ErrMsg msg={errMsg.errors?.company_name?.[0]} />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">Email de contact</label>
            <input
              onChange={HandleChange}
              type="email"
              value={clientInfos.email}
              name="email"
              placeholder="client@mail.com"
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
            />
            <ErrMsg msg={errMsg.errors?.email?.[0]} />
          </div>

          {/* Tel */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6c7b] uppercase">Numero Tel</label>
            <input
              onChange={HandleChange}
              type="text"
              value={clientInfos.tel}
              name="tel"
              placeholder="Ex: 0622017665"
              className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
            />
            <ErrMsg msg={errMsg.errors?.tel?.[0]} />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#5f6c7b] uppercase">Adresse Complète</label>
          <textarea
            onChange={HandleChange}
            value={clientInfos.address}
            name="address"
            rows="2"
            className="w-full p-2.5 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-lg focus:border-[#3da9fc] outline-none text-sm"
          ></textarea>
          <ErrMsg msg={errMsg.errors?.address?.[0]} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to={"/admin/clients"}
            className="px-6 py-2 text-[#5f6c7b] font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="px-6 py-2 bg-[#3da9fc] text-white font-bold rounded-lg hover:bg-[#094067] transition-all"
          >
            Update Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClient;
