import { MapPinIcon, ShoppingCart, User, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { NAV_TABS } from "../constants/navigation";
import { useState } from "react";
import MobileMenuModal from "./MobileMenuModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="relative w-full px-4 md:px-8 h-18 flex items-center justify-between">
      <div className="flex-shrink-0 w-32">
        <span className="text-3xl font-bold text-gray-300 tracking-tighter">absolute</span>
      </div>
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-[#222222] rounded-full p-1.5 border border-white/5 shadow-lg">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.text}
            onClick={() => navigate(tab.link)}
            className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${pathname === tab.link
              ? "text-white border border-white/20 bg-white/5"
              : "text-gray-400 hover:text-white border border-transparent"
              }`}
          >
            {tab.text}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 text-gray-400">
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Location">
          <MapPinIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Cart">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Profile">
          <User className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button className="md:hidden hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Menu" onClick={toggleMenu}>
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {isMenuOpen && <MobileMenuModal toggleMenu={toggleMenu} />}
    </header>
  );
};

export default Header;
