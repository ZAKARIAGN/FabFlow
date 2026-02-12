// src/components/SidebarAdmin.jsx
import { NavLink } from "react-router-dom";

const SidebarAdmin = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition 
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-slate-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-800 p-5">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-white text-center mb-10">
        Admin Panel
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className={linkClass}>
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/clients" className={linkClass}>
          <span>👤</span>
          <span>Clients</span>
        </NavLink>

        <NavLink to="/admin/produits" className={linkClass}>
          <span>📦</span>
          <span>Produits</span>
        </NavLink>

        <NavLink to="/admin/documents" className={linkClass}>
          <span>📄</span>
          <span>Documents</span>
        </NavLink>

        <NavLink to="/admin/picking-bl" className={linkClass}>
          <span>🧾</span>
          <span>Picking BL</span>
        </NavLink>

        <NavLink to="/admin/picking-factures" className={linkClass}>
          <span>🧮</span>
          <span>Picking Factures</span>
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <span>👥</span>
          <span>Gestion Comptes</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;