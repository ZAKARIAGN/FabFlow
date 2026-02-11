// src/components/SidebarAtelier.jsx
import { NavLink } from "react-router-dom";

const SidebarAtelier = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition 
     ${
       isActive
         ? "bg-orange-600 text-white"
         : "text-gray-300 hover:bg-slate-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-800 p-5">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-white text-center mb-10">
        Atelier Panel
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {/* Clients */}
        <NavLink to="/atelier/clients" className={linkClass}>
          <span>👤</span>
          <span>Clients</span>
        </NavLink>

        {/* Produits */}
        <NavLink to="/atelier/produits" className={linkClass}>
          <span>📦</span>
          <span>Produits</span>
        </NavLink>

        {/* Bon de Livraison */}
        <NavLink to="/atelier/BL" className={linkClass}>
          <span>🧾</span>
          <span>Bon de Livraison</span>
        </NavLink>

        {/* Picking */}
        <NavLink to="/atelier/picking-bl" className={linkClass}>
          <span>📄</span>
          <span>Picking</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarAtelier;
