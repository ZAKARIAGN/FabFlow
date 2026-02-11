import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Loader2, Package, AlertTriangle, Calculator } from 'lucide-react';

const PickingDetail = () => {
  const { id } = useParams(); // ID dyal l-quote
  const navigate = useNavigate();
  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deliveryQtys, setDeliveryQtys] = useState({});

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Fetch direct l-quote b l-id dyalha
        const res = await axios.get(`http://localhost:8000/api/quotes/${id}`);
        setDevis(res.data);

        // Initialiser les quantités
        const initialQtys = {};
        res.data.items.forEach((item, index) => {
          initialQtys[index] = item.qtte;
        });
        setDeliveryQtys(initialQtys);
      } catch (err) {
        console.error("Erreur fetch quote:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleQtyChange = (index, value) => {
    const val = Number(value);
    if (val < 0) return;
    setDeliveryQtys(prev => ({ ...prev, [index]: val }));
  };

  const handleValiderBL = async () => {
    const isEverythingZero = Object.values(deliveryQtys).every(v => v === 0);
    if (isEverythingZero) return alert("Saisissez au moins une quantité.");

    setSaving(true);
    try {
      // Payload m9add 3la 7sab l-logic dyal BL
      const backendPayload = {
        items: devis.items
          .map((item, idx) => ({
            produits_id: item.produits_id, // Match m3a l-migration BL_items
            qtte: deliveryQtys[idx]
          }))
          .filter(i => i.qtte > 0)
      };

      // POST 3la 7sab image 4: api/delivery/{quote_id}
      await axios.post(`http://localhost:8000/api/delivery/${id}`, backendPayload);

      alert("Bon de Livraison (BL) créé avec succès !");
      navigate("/document"); // Rje3 l-list dyal l-documents

    } catch (err) {
      console.error("Erreur Saving BL:", err.response?.data);
      alert("Erreur lors de la validation.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline text-[#3da9fc]" /></div>;
  if (!devis) return <div className="p-10 text-center">Devis introuvable.</div>;

  return (
    <div className="p-6 min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/picking" className="flex items-center gap-2 text-[#5f6c7b] font-bold text-sm hover:text-[#094067]">
          <ArrowLeft size={18} /> Retour Picking
        </Link>
        <div className="text-right">
          <h1 className="text-xl font-black text-[#094067] uppercase">{devis.client?.company_name}</h1>
          <p className="text-[10px] text-[#90b4ce] font-bold mt-1 tracking-widest">DEVIS REF: {devis.number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#90b4ce]/20 p-6 shadow-sm">
            <h2 className="text-sm font-black text-[#094067] mb-6 uppercase flex items-center gap-2 border-b pb-4">
              <Package size={18} className="text-[#3da9fc]" /> Contrôle des Quantités
            </h2>
            
            <div className="space-y-4">
              {devis.items.map((item, idx) => {
                const currentDelivery = deliveryQtys[idx] || 0;
                const isOverLimit = currentDelivery > item.qtte;
                const remaining = item.qtte - currentDelivery;

                return (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-[#f8fafc] border-[#90b4ce]/10'}`}>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-[#094067] text-sm uppercase">{item.produit?.label || `Produit #${item.produits_id}`}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] font-bold text-[#5f6c7b]">DEVIS: {item.qtte}</span>
                          <span className={`text-[10px] font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>RESTE: {remaining}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#90b4ce]/20">
                        <label className="text-[9px] font-black text-[#90b4ce] uppercase pl-2">Sortie :</label>
                        <input 
                          type="number"
                          value={deliveryQtys[idx]}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className="w-20 py-1 font-black text-center outline-none text-lg text-[#3da9fc]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-[#90b4ce]/20 shadow-xl sticky top-6">
            <h2 className="text-xs font-black text-[#90b4ce] mb-6 uppercase tracking-widest">Action</h2>
            <div className="mb-8">
                <span className="text-xs text-[#5f6c7b] font-medium block mb-1">Articles à livrer</span>
                <span className="text-2xl font-black text-[#094067]">{Object.values(deliveryQtys).filter(v => v > 0).length}</span>
            </div>

            <button 
              onClick={handleValiderBL}
              disabled={saving}
              className="w-full py-4 bg-[#094067] text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#3da9fc] disabled:bg-gray-300 transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Valider le BL</>}
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex gap-3 items-start">
               <Calculator size={16} className="text-[#3da9fc] mt-0.5" />
               <p className="text-[9px] text-[#094067] font-medium leading-relaxed">
                 Cette action va créer un <b>Bon de Livraison</b> lié à ce Devis.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickingDetail;