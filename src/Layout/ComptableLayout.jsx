import { Outlet } from "react-router-dom";
import Sidebar from "../compenet/sidebar";
import SidebarAdmin from "../compenet/SideBarAdmin";
import SidebarCommerciale from "../compenet/SideBarCommercial";
import SidebarAtelier from "../compenet/SideBarAtelier";
import SidebarComptable from "../compenet/SideBarComptable";

const COmptableLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarComptable />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default COmptableLayout;
