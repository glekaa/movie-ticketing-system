import type { Theater } from "../../types";
import { Film, Sparkles, Tv, MapPin } from "lucide-react";

interface CinemaCardProps {
  cinema: Theater;
}

const CinemaCard = ({ cinema }: CinemaCardProps) => {
  // Check screen formats based on their names
  const hasIMAX = cinema.screens.some((s) => s.name.toLowerCase().includes("imax"));
  const hasLaser = cinema.screens.some((s) => s.name.toLowerCase().includes("laser"));

  return (
    <article
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all duration-300 bg-[#151414] border-white/5 hover:border-white/10 hover:bg-[#181717] w-full"
    >
      {/* Decorative vertical bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l bg-transparent group-hover:bg-[#00A3FF] transition-all duration-300" />

      {/* Left section: Details */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="space-y-1.5 min-w-0">
          <h3 className="font-bold text-lg text-[#E5E2E1] group-hover:text-white transition-colors truncate">
            {cinema.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#8B8D8D]">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="truncate">{cinema.location}</span>
          </div>
        </div>
      </div>

      {/* Middle section: Format Badges */}
      <div className="flex flex-row flex-wrap gap-2 mt-4 md:mt-0 md:px-8 shrink-0 items-center">
        {hasIMAX && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.2)]">
            <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400" />
            IMAX
          </span>
        )}
        {hasLaser && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]">
            <Tv className="w-3 h-3" />
            Laser
          </span>
        )}
        {!hasIMAX && !hasLaser && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
            Standard
          </span>
        )}
      </div>

      {/* Right section: Screen details & Action indicator */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-white/5 md:border-none pt-4 md:pt-0 mt-4 md:mt-0 gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Film className="w-4 h-4 text-gray-500" />
          <span>
            {cinema.screens.length} {cinema.screens.length === 1 ? "Screen" : "Screens"} Available
          </span>
        </div>
        <span className="hidden md:inline-block text-xs font-semibold text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
          Details →
        </span>
      </div>
    </article>
  );
};

export default CinemaCard;
