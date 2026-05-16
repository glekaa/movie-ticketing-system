import { useState } from "react";
import { MapPinIcon, ShoppingCart, User, Menu } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Now Playing");
  const tabs = [{ text: "Now Playing", link: "/" }, { text: "Coming Soon", link: "/coming-soon" }, { text: "Cinemas", link: "/cinemas" }];

  const handleNavigate = (text: string, link: string) => {
    setActiveTab(text);
    navigate(link);
  }

  return (
    <header className="w-full px-4 md:px-8 h-18 flex items-center justify-between">
      <div className="flex-shrink-0 w-32">
        <span className="text-3xl font-bold text-gray-300 tracking-tighter">absolute</span>
      </div>
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-[#222222] rounded-full p-1.5 border border-white/5 shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.text}
            onClick={() => handleNavigate(tab.text, tab.link)}
            className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeTab === tab.text
              ? "text-white border border-white/20 bg-white/5"
              : "text-gray-400 hover:text-white border border-transparent"
              }`}
          >
            {tab.text}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-6 flex-shrink-0 text-gray-400">
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Location">
          <MapPinIcon />
        </button>
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Cart">
          <ShoppingCart />
        </button>
        <button className="hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Profile">
          <User />
        </button>
        {/* <button className="hover:text-white transition-colors duration-300 cursor-pointer ml-1" aria-label="Menu">
          <Menu />
        </button> */}
      </div>
    </header>
  );
};

export default Header;
