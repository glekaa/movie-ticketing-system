import { Image as ImageIcon, Film } from "lucide-react";

interface MoviePreviewProps {
    posterUrl?: string;
    backdropUrl?: string;
}

const MoviePreview = ({ posterUrl, backdropUrl }: MoviePreviewProps) => {
    return (
        <section className="space-y-6">
            <h2 className="text-lg font-bold text-gray-200 px-1 font-['Montserrat']">Media Previews</h2>

            {/* Poster Preview */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 shadow-xl space-y-3">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Poster Preview (2:3)</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-800 aspect-[2/3] bg-[#111] flex items-center justify-center">
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt="Poster Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = document.getElementById("poster-fallback");
                                if (fallback) fallback.style.display = "flex";
                            }}
                            onLoad={(e) => {
                                e.currentTarget.style.display = "block";
                                const fallback = document.getElementById("poster-fallback");
                                if (fallback) fallback.style.display = "none";
                            }}
                        />
                    ) : null}
                    <div
                        id="poster-fallback"
                        className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2"
                        style={{ display: posterUrl ? "none" : "flex" }}
                    >
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-xs font-medium">No Poster Image</span>
                    </div>
                </div>
            </div>

            {/* Backdrop Preview */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 shadow-xl space-y-3">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Backdrop Preview (16:9)</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-800 aspect-video bg-[#111] flex items-center justify-center">
                    {backdropUrl ? (
                        <img
                            src={backdropUrl}
                            alt="Backdrop Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = document.getElementById("backdrop-fallback");
                                if (fallback) fallback.style.display = "flex";
                            }}
                            onLoad={(e) => {
                                e.currentTarget.style.display = "block";
                                const fallback = document.getElementById("backdrop-fallback");
                                if (fallback) fallback.style.display = "none";
                            }}
                        />
                    ) : null}
                    <div
                        id="backdrop-fallback"
                        className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2"
                        style={{ display: backdropUrl ? "none" : "flex" }}
                    >
                        <Film className="w-12 h-12" />
                        <span className="text-xs font-medium">No Backdrop Image</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MoviePreview;
