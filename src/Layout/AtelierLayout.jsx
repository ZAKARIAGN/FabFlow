import { Outlet } from "react-router-dom";
import Sidebar from "../compenet/sidebar";
import SidebarAdmin from "../compenet/SideBarAdmin";
import SidebarCommerciale from "../compenet/SideBarCommercial";
import SidebarAtelier from "../compenet/SideBarAtelier";

const AtelierLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAtelier />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AtelierLayout;
