
const clientsData = [
  { id: 1, name: "Sodal Maghreb", ca: "45,000 DH", status: "Actif" },
  { id: 2, name: "Techno Fab", ca: "32,800 DH", status: "Actif" },
  { id: 3, name: "Industrie Plus", ca: "28,500 DH", status: "En attente" },
  { id: 4, name: "Build Co", ca: "21,000 DH", status: "Actif" },
  { id: 5, name: "Atlas Steel", ca: "18,900 DH", status: "Actif" },
];

const TopClients = () => (
  <div className="bg-white p-6 rounded-xl border border-[#90b4ce]/20 shadow-sm">
    <h3 className="text-[#094067] font-bold mb-6">Top 5 Clients (CA)</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[#90b4ce] text-xs uppercase tracking-wider border-b border-[#90b4ce]/10">
            <th className="pb-3 font-semibold">Client</th>
            <th className="pb-3 font-semibold text-right">Chiffre d'Affaires</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#90b4ce]/10">
          {clientsData.map((client) => (
            <tr key={client.id} className="group hover:bg-[#90b4ce]/5 transition-colors">
              <td className="py-4 text-[#094067] font-medium text-sm">{client.name}</td>
              <td className="py-4 text-right text-[#5f6c7b] font-bold text-sm">{client.ca}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default TopClients;