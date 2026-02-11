// src/components/SidebarComptable.jsx
import { NavLink } from "react-router-dom";

const SidebarComptable = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition 
     ${
       isActive
         ? "bg-purple-600 text-white"
         : "text-gray-300 hover:bg-slate-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-800 p-5">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-white text-center mb-10">
        Comptable Panel
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {/* Clients */}
        <NavLink to="/comptable/clients" className={linkClass}>
          <span>👤</span>
          <span>Clients</span>
        </NavLink>

        {/* Produits */}
        <NavLink to="/comptable/produits" className={linkClass}>
          <span>📦</span>
          <span>Produits</span>
        </NavLink>

        {/* Factures */}
        <NavLink to="/comptable/factures" className={linkClass}>
          <span>📄</span>
          <span>Factures</span>
        </NavLink>

        {/* Picking */}
        <NavLink to="/comptable/picking-factures" className={linkClass}>
          <span>🧾</span>
          <span>Picking</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarComptable;
