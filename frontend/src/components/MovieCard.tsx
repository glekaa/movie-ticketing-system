interface MovieCardProps {
    title: string;
    genre: string;
    duration: number;
    imageUrl: string;
}

const MovieCard = ({ title, genre, duration, imageUrl }: MovieCardProps) => {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer w-full max-w-[300px]">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col gap-1 px-1 mt-1">
                <h3 className="text-xl font-medium text-[#E5E2E1] tracking-wide">{title}</h3>
                <div className="flex items-center gap-2 text-[15px] text-gray-400 font-['Inter']">
                    <span>{genre}</span>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span>{duration}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard;