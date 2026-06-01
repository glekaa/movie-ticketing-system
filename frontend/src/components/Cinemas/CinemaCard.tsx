import type { Theater } from "../../types";
import { Film, Sparkles, Tv, MapPin } from "lucide-react";

interface CinemaCardProps {
  cinema: Theater;
}

const CinemaCard = ({ cinema }: CinemaCardProps) => {
  const screens = cinema.screens || [];
  const hasIMAX = screens.some((s) => s.name?.toLowerCase().includes("imax"));
  const hasLaser = screens.some((s) => s.name?.toLowerCase().includes("laser"));

  return (
    <article
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all duration-300 bg-[#151414] border-white/5 w-full"
    >

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

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-4 md:mt-0 shrink-0">
        <Film className="w-4 h-4 text-gray-500" />
        <span>
          {screens.length} {screens.length === 1 ? "Screen" : "Screens"} Available
        </span>
      </div>
    </article>
  );
};

export default CinemaCard;
