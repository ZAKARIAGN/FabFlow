import { Bell, UserCircle, Sun, Moon } from "lucide-react";
import { LuLogOut } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { LogoutService } from "../services/AuthService";
import { useNavigate } from "react-router";

const IconButton = ({ children, className = "", onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`${
      isDark
        ? "bg-[#1e293b] text-[#90b4ce] border-gray-700 hover:bg-[#3da9fc]/10"
        : "bg-white text-[#5f6c7b] border-[#90b4ce]/10 hover:bg-[#3da9fc]/5 hover:text-[#3da9fc]"
    } cursor-pointer relative p-2 sm:p-2.5 border rounded-xl transition-all shadow-sm ${className}`}
  >
    {children}
  </button>
);

const Navbar = ({ title, toggleSidebar, isDark, setIsDark }) => {
  const navigate = useNavigate()

  return (
    <header
      className={`${
        isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"
      } h-20 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-10 border-b border-[#90b4ce]/10`}
    >
      <button
        onClick={()=>LogoutService(navigate)}
        className="hidden lg:block  cursor-pointer text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
      >
        Déconnexion
      </button>

      <IconButton className="lg:hidden" onClick={toggleSidebar} isDark={isDark}>
        <GiHamburgerMenu size={18} />
      </IconButton>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex items-center space-x-2">
          <IconButton className="lg:hidden" isDark={isDark} onClick={() => LogoutService(navigate)}>
            <LuLogOut size={18} />
          </IconButton>

          <IconButton isDark={isDark}>
            <Bell size={18} />
            <span
              className={`absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 ${
                isDark ? "border-[#0f172a]" : "border-white"
              }`}
            />
          </IconButton>

          <IconButton
            onClick={() => setIsDark(!isDark)}
            isDark={isDark}
            className={
              !isDark
                ? "hover:text-black hover:bg-black/60 transition-colors duration-300"
                : "hover:text-amber-400 hover:bg-amber-50 transition-colors duration-300"
            }
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </div>

        <div className="h-8 w-px bg-[#90b4ce]/20 mx-1 sm:mx-2" />

        <div
          className={`${
            isDark ? "bg-[#1e293b]" : "bg-white"
          } flex items-center space-x-2 sm:space-x-3 p-1 sm:p-1.5 sm:pr-4 rounded-xl sm:rounded-2xl border border-[#90b4ce]/10 hover:shadow-md transition-all`}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#3da9fc]/10 flex items-center justify-center">
            <UserCircle size={20} className="text-[#3da9fc]" />
          </div>
          <div className="block ">
            <p
              className={`text-[9px] sm:text-[10px] font-bold italic max-w-[60px] truncate sm:max-w-none ${
                isDark ? "text-[#5f6c7b]" : "text-[#90b4ce]"
              }`}
            >
              {title}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;