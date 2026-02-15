// src/components/SidebarAtelier.jsx
import { NavLink } from "react-router-dom";

const SidebarAtelier = ({isOpen,setIsOpen}) => {
const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300
     ${
       isActive
          ? "bg-[#3da9fc] text-white shadow-lg shadow-[#3da9fc]/20"
          : "text-[#90b4ce] hover:bg-[#fffffe]/5 hover:text-white"
     }`;
  const pStyle = "text-[10px] text-[#5f6c7b] font-black uppercase tracking-[0.2em] mt-10 px-3 opacity-60";
  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#071c2c] flex flex-col z-40 rounded-tr-4xl transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}>
      {/* Logo / Title */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3da9fc] rounded-lg flex items-center justify-center shadow-lg shadow-[#3da9fc]/30">
            <span className="text-white font-black italic">F</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase">FabFlow</h1>
        </div>
        {/* Close button only for mobile */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(false)}>✕</button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-2 pb-10">
            {/* Dashboard */}
        <p className={pStyle}>Main Menu</p>
        <NavLink to="/atelier/dashboard" className={linkClass}>
          <span>Dashboard</span>
        </NavLink>
       <p className={pStyle}>Référentiel</p>
        <NavLink to="/atelier/clients" className={linkClass}>
          <span>Clients</span>
        </NavLink>


        {/* Produits */}
        <NavLink to="/atelier/produits" className={linkClass}>
          <span>Produits</span>
        </NavLink>

        {/* Bon de Livraison */}
        <p className={pStyle}>Opérations</p>
        <NavLink to="/atelier/BL" className={linkClass}>
          <span>Bon de Livraison</span>
        </NavLink>

        {/* Picking */}
        <NavLink to="/atelier/picking-bl" className={linkClass}>
          <span>Picking</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarAtelier;
