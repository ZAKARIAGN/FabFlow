import { Bell, Search, UserCircle, Settings } from "lucide-react";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <header className="h-20 bg-[#f8fafc] px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Search */}
      <button onClick={handleLogout} className="cursor-pointer text-xs font-bold text-red-500 hover:text-red-700">
          Déconnexion
      </button>


      {/* Actions */}
      <div className="flex items-center space-x-3">
        <IconButton>
          <Bell size={20} />
          <span className="notification-dot" />
        </IconButton>

        <IconButton>
          <Settings size={20} />
        </IconButton>

        <div className="h-8 w-px bg-[#90b4ce]/20 mx-2" />

        <button className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl bg-white border border-[#90b4ce]/10 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#3da9fc]/10 flex items-center justify-center">
            <UserCircle size={22} className="text-[#3da9fc]" />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-black text-[#094067]">Aymen</p>
            <p className="text-[10px] text-[#90b4ce] font-bold italic">
              Administrateur
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

const IconButton = ({ children }) => (
  <button className="relative p-2.5 text-[#5f6c7b] bg-white border border-[#90b4ce]/10 hover:bg-[#3da9fc]/5 hover:text-[#3da9fc] rounded-xl transition-all shadow-sm">
    {children}
  </button>
);

export default Navbar;
