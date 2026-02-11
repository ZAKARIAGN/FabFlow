import { Outlet } from "react-router-dom";
import Sidebar from "../compenet/sidebar";
import SidebarAdmin from "../compenet/SideBarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
