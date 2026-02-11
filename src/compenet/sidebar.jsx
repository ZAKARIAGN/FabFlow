import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Truck,
  Receipt
} from "lucide-react";
import { NavLink } from "react-router-dom";

const NavItem = ({ icon: Icon, label }) => (
  <NavLink
    to={label.path}
    className={({ isActive }) =>
      `flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300
      ${
        isActive
          ? "bg-[#3da9fc] text-white shadow-lg shadow-[#3da9fc]/20"
          : "text-[#90b4ce] hover:bg-[#fffffe]/5 hover:text-white"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="font-bold text-sm">{label.name}</span>
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  // 1. Njib l-user mn localstorage (li jani mn l-API f l-login)
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "guest"; // default guest ila makan walu

  // 2. Definir l-menu kamel
const mainMenu = [
    {name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["admin", "commercial", "atelier", "comptable"]}
  ]

  const referentiel = [
    { name: "Produits", path: "/produits", icon: Package, roles: ["admin", "commercial", "atelier", "comptable"] },
    { name: "Clients", path: "/clients", icon: Users, roles: ["admin", "commercial", "atelier", "comptable"] }
  ];

  const operations = [
    { name: "Documents", path: "/document", icon: FileText, roles: ["admin", "commercial", "atelier", "comptable"] },
    { name: "Picking", path: "/pagePicking", icon: Truck, roles: ["admin", "atelier"] },
    { name: "Factures", path: "/pageFactures", icon: Receipt, roles: ["admin", "comptable"] }
  ];

  // 3. Fonction dyal l-filtrage
  const filterByRole = (items) => items.filter(item => item.roles.includes(role));

  const pStyle = "text-[10px] text-[#5f6c7b] font-black uppercase tracking-[0.2em] mt-10 px-3 opacity-60";

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#071c2c] flex flex-col z-20 rounded-r-4xl">
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3da9fc] rounded-lg flex items-center justify-center shadow-lg shadow-[#3da9fc]/30">
            <span className="text-white font-black italic">F</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase">
            FabFlow
          </h1>
        </div>
      </div>

      {/* Navigation avec Logic de Rôles */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-2">
        
        {/* Afficher Main Menu ghir ila kan 3ndu l-role */}
        {filterByRole(mainMenu).length > 0 && (
          <>
            <p className={pStyle}>Main Menu</p>
            {filterByRole(mainMenu).map(item => (
              <NavItem key={item.name} icon={item.icon} label={item} />
            ))}
          </>
        )}

        <p className={pStyle}>Référentiel</p>
        {filterByRole(referentiel).map(item => (
          <NavItem key={item.name} icon={item.icon} label={item} />
        ))}

        <p className={pStyle}>Opérations</p>
        {filterByRole(operations).map(item => (
          <NavItem key={item.name} icon={item.icon} label={item} />
        ))}
      </nav>

      {/* Profile Section Dynamique */}
      <div className="p-4 m-4 bg-[#094067]/30 rounded-2xl border border-[#fffffe]/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#ef4565] flex items-center justify-center font-black text-white shadow-lg shadow-[#ef4565]/20 uppercase">
            {user?.name?.substring(0, 2) || "AD"}
          </div>
          <div>
            <p className="text-xs font-black text-white truncate w-32">{user?.name || "User Account"}</p>
            <p className="text-[10px] text-[#3da9fc] font-bold uppercase tracking-widest">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;