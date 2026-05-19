import { Link } from "react-router";
import { NAV_TABS } from "../constants/navigation";
import absoluteCinemaImg from '../assets/images/absolute_cinema (1).png';

const Footer = () => {
  return (
    <footer className="border-t border-[#444748]/20 py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">

        {/* Brand & Copyright */}
        <div className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-[#E5E2E1] font-['Montserrat'] font-bold text-2xl tracking-wide">
            absolute
          </h2>
          <p className="text-[#9CA3AF] font-['Inter'] text-sm">
            © 2026 absolute. All rights reserved.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex flex-col sm:flex-row gap-12 md:gap-24 w-full md:w-auto justify-end">

          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            {NAV_TABS.map((tab) => (
              <Link key={tab.link} to={tab.link} className="text-[#9CA3AF] hover:text-[#E5E2E1] font-['Inter'] text-sm transition-colors">
                {tab.text}
              </Link>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <a href="#" className="text-[#9CA3AF] hover:text-[#E5E2E1] font-['Inter'] text-sm transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="text-[#9CA3AF] hover:text-[#E5E2E1] font-['Inter'] text-sm transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <a href="#" className="text-[#9CA3AF] hover:text-[#E5E2E1] font-['Inter'] text-sm transition-colors">
              Contact Us
            </a>
          </div>

        </div>
      </div>

      {/* Absolute Cinema Image */}
      <img
        src={absoluteCinemaImg}
        alt="Absolute Cinema"
        className="absolute bottom-0 right-0 w-40 md:w-40 opacity-20 pointer-events-none"
      />
    </footer>
  );
};

export default Footer;
