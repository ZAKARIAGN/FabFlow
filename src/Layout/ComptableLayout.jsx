import { Outlet } from "react-router-dom";
import SidebarComptable from "../compenet/SideBarComptable";
import Navbar from "../compenet/navbar";
import { useState } from "react";
const COmptableLayout = ({isDark,setIsDark}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className={`${isDark ? 'bg-[#0f172a]' : 'bg-white'} flex min-h-screen  relative`}>
      <SidebarComptable isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar isDark={isDark} setIsDark={setIsDark} title={"comptable"} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
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

export default COmptableLayout;
