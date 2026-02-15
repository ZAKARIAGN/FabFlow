import { Outlet } from "react-router-dom";
import Navbar from "../compenet/navbar";
import SidebarCommerciale from "../compenet/SideBarCommercial";
import { useState } from "react";

const CommercialLayout = ({isDark,setIsDark}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className={`${isDark ? 'bg-[#0f172a]' : 'bg-white'} flex min-h-screen  relative`}>
      <SidebarCommerciale isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar isDark={isDark} setIsDark={setIsDark} title={"commercial"} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CommercialLayout;
