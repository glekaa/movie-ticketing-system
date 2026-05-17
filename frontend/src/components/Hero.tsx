import Button from "./Button";
import Tag from "./Tag";
import { Play, Ticket, TriangleAlert, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { movieUserServices } from "../services/movieServices";
import type { Movie } from "../types";
import { useState, useEffect, useCallback } from "react";
import { formatDuration } from "../utils";

const SCROLL_INTERVAL_MS = 6000;

const Hero = () => {
  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["movies", "now_playing"],
    queryFn: () => movieUserServices.getNowPlayingMovies(),
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const movieCount = movies?.length ?? 0;

  const goToSlide = useCallback(
    (index: number) => {
      if (movieCount === 0) return;
      setIsFading(true);
      setTimeout(() => {
        setActiveIndex(index % movieCount);
        setIsFading(false);
      }, 400);
    },
    [movieCount],
  );

  useEffect(() => {
    if (movieCount <= 1) return;
    const timer = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, SCROLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeIndex, movieCount, goToSlide]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-[#141313]">
        <div className="flex items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
          <p className="text-2xl text-gray-500">Loading movies</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-[#141313]">
        <div className="flex items-center justify-center gap-4">
          <TriangleAlert className="w-12 h-12 text-red-500" />
          <p className="text-2xl text-red-500">Error loading movies</p>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-[#141313]">
        <p className="text-2xl text-gray-500">No movies available</p>
      </div>
    );
  }

  const currentMovie = movies[activeIndex];

  const genreTags = currentMovie.genres.map((g) => ({
    type: "primary" as const,
    text: g.name,
  }));
  const durationTag = {
    type: "primary" as const,
    text: formatDuration(currentMovie.duration_minutes),
  };
  const ageRatingTag = currentMovie.age_rating
    ? [{ type: "secondary" as const, text: `${currentMovie.age_rating}+` }]
    : [];
  const allTags = [...genreTags, durationTag, ...ageRatingTag];

  return (
    <div className="relative w-full h-[70vh] overflow-hidden px-10 pb-20">
      {movies.map((movie, idx) => (
        <div
          key={movie.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${movie.backdrop_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: idx === activeIndex && !isFading ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0.35)_0%,_rgba(20,19,19,0.75)_50%,_rgba(20,19,19,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />

      <div
        className={`h-full relative flex flex-col gap-8 justify-end items-start transition-opacity duration-400 ease-in-out ${isFading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="text-left max-w-lg">
          <h1 className="text-5xl font-bold text-white uppercase">
            {currentMovie.title}
          </h1>

          <p className="text-md 2xl:text-lg text-gray-300 leading-relaxed mt-4 max-w-3xl">
            {currentMovie.description}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          {allTags.map((tag, index) => (
            <Tag key={index} variant={tag.type}>
              {tag.text}
            </Tag>
          ))}
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row gap-2">
            <Button variant="primary">
              <Ticket />
              Book Now
            </Button>
            <Button variant="secondary">
              <Play />
              Watch Trailer
            </Button>
          </div>

          {movies.length > 1 && (
            <div className="flex items-center gap-2 ml-4">
              {movies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-8 h-2 bg-[#00A3FF]"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
