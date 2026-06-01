import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(isVisible => isVisible ? true : false); // Keep state unchanged or update
                setIsVisible(window.scrollY > 400);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-b from-[#00A3FF] to-[#0055FF] text-white shadow-[0_8px_20px_-4px_rgba(0,102,255,0.5)] hover:shadow-[0_0px_25px_rgba(0,102,255,0.7)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20 animate-fade-in"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
};

export default BackToTop;
