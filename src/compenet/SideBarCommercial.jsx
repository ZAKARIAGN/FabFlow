// src/components/SidebarCommerciale.jsx
import { NavLink } from "react-router-dom";

const SidebarCommerciale = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition 
     ${
       isActive
         ? "bg-green-600 text-white"
         : "text-gray-300 hover:bg-slate-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-800 p-5">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-white text-center mb-10">
        Commercial Panel
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {/* Clients */}

         <NavLink to="/commercial/dashboard" className={linkClass}>
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/commercial/clients" className={linkClass}>
          <span>👤</span>
          <span>Clients</span>
        </NavLink>

        {/* Produits */}
        <NavLink to="/commercial/produits" className={linkClass}>
          <span>📦</span>
          <span>Produits</span>
        </NavLink>

        {/* Devis */}
        <NavLink to="/commercial/devis" className={linkClass}>
          <span>📝</span>
          <span>Devis</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarCommerciale;
