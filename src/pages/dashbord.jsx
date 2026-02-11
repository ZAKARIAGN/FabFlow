import  StatCard  from '../compenet/StatCard';
import TopClients  from '../compenet/TopClients';
import { DollarSign, FileText, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_role = user?.role || "guest";
  return (
    <div className="space-y-8 animate-in fade-in duration-500 mt-10">
      
      <div>
        <h1 className="text-2xl font-bold text-[#094067]">Tableau de Bord</h1>
        <p className="text-[#5f6c7b] text-sm">Aperçu global de l'activité FabFlow.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="CA Mensuel" value="128,450 DH" icon={DollarSign} trend="+12.5%" color="#3da9fc" />
        <StatCard title="Devis en attente" value="14" icon={FileText} trend="-2" color="#ef4565" />
        <StatCard title="BL à facturer" value="09" icon={Truck} trend="+4" color="#094067" />
        <StatCard title="Clients Actifs" value="42" icon={Users} color="#3da9fc" />
      </div>

      {
        ["admin","commercial"].includes(user_role) ?
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <TopClients />
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#90b4ce]/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#3da9fc]/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-[#3da9fc]" size={30} />
            </div>
            <h4 className="text-[#094067] font-bold">Nouveau Devis</h4>
            <p className="text-[#5f6c7b] text-xs mt-2 px-4">Créez rapidement un nouveau chiffrage pour vos clients.</p>
            <Link  to={'/pageDevis'}>
                <button className="mt-6 bg-[#3da9fc] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#094067] transition-colors">
                  + Créer
                </button>
            </Link>
        </div>
      </div>
      :
      <div className="lg:col-span-2">
           <TopClients />
        </div>
      }
    </div>
  )
}

export default Dashboard;