import { ShoppingCart, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { NAV_TABS } from "../../constants/navigation";
import { useState } from "react";
import MobileMenuModal from "./MobileMenuModal";
import { useBasket } from "../../context/BasketContext";
import useAuthStore from "../../stores/authStore";
import useLogout from "../../hooks/useLogout";
import Button from "../Elements/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { basket } = useBasket();
  const totalTickets = basket.reduce((acc, item) => acc + item.quantity, 0);

  const { token, user } = useAuthStore();
  const handleLogout = useLogout();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="relative w-full px-4 md:px-8 h-18 flex items-center justify-between">
      <div className="flex-shrink-0 w-32">
        <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-gray-300 tracking-tighter cursor-pointer hover:text-white">absolute</h1>
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
        <button
          onClick={() => navigate("/basket")}
          className={`relative transition-colors duration-300 cursor-pointer ${pathname === "/basket" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          {totalTickets > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-[#00A3FF] text-[9px] md:text-[10px] font-bold text-white shadow-[0_0_8px_rgba(0,163,255,0.8)] animate-pulse">
              {totalTickets}
            </span>
          )}
        </button>

        {token ? (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">Hello, <strong className="text-white font-semibold">{user?.username}</strong></span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer font-['Montserrat']"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer font-['Montserrat']"
            >
              Sign In
            </button>
            <Button
              variant="secondary"
              onClick={() => navigate("/auth/register")}
              className="py-1.5 px-4 text-xs font-semibold"
            >
              Sign Up
            </Button>
          </div>
        )}

        <button className="md:hidden hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Menu" onClick={toggleMenu}>
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {isMenuOpen && <MobileMenuModal toggleMenu={toggleMenu} />}
    </header>
  );
};

export default Header;
