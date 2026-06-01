import { NAV_TABS } from "../../constants/navigation";
import { useNavigate, useLocation } from "react-router";
import { X, ChevronRight } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import Button from "../Elements/Button";

interface MobileMenuModalProps {
    toggleMenu: () => void;
}

const MobileMenuModal = ({ toggleMenu }: MobileMenuModalProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { token, user, logout } = useAuthStore();

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                onClick={toggleMenu}
            />

            <div className="fixed top-0 right-0 h-screen w-[75vw] max-w-[320px] z-50 bg-[#1a1919] border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col animate-slide-in-right">

                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <span className="text-lg font-bold text-[#E5E2E1] tracking-wide font-['Montserrat']">Menu</span>
                    <button
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        aria-label="Close menu"
                        onClick={toggleMenu}
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <nav className="flex flex-col px-3 py-4 gap-1">
                    {NAV_TABS.map((tab) => {
                        const isActive = pathname === tab.link;
                        return (
                            <button
                                key={tab.text}
                                onClick={() => { toggleMenu(); navigate(tab.link); }}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
                                    ? "bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/20"
                                    : "text-[#C4C7C7] hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                            >
                                {tab.text}
                                <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? "text-[#00A3FF]/60" : "text-white/20"}`} />
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto px-6 py-6 border-t border-white/5 space-y-3.5">
                    {token ? (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-400 font-['Inter']">
                                Logged in as <strong className="text-white font-semibold">{user?.username}</strong>
                            </p>
                            <Button
                                variant="secondary"
                                className="w-full py-2.5 text-xs font-semibold"
                                onClick={() => {
                                    toggleMenu();
                                    logout();
                                    navigate("/");
                                }}
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => { toggleMenu(); navigate("/auth/login"); }}
                                className="text-xs font-semibold py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all cursor-pointer text-center font-['Montserrat']"
                            >
                                Sign In
                            </button>
                            <Button
                                variant="secondary"
                                className="py-2.5 text-xs font-semibold"
                                onClick={() => { toggleMenu(); navigate("/auth/register"); }}
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                    <p className="text-[10px] text-gray-600 font-['Inter'] pt-2">© 2026 absolute</p>
                </div>
            </div>
        </>
    );
};

export default MobileMenuModal;