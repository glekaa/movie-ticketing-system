import Button from "./Button";
import Tag from "./Tag";
import HeroOverlay from "./HeroOverlay";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { Play, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../services/movieServices";
import type { Movie } from "../types";
import { useState, useEffect, useCallback } from "react";
import { buildMovieTags } from "../utils";

const SCROLL_INTERVAL_MS = 6000;

const Hero = () => {
  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["movies", "now_playing"],
    queryFn: () => movieServices.getNowPlayingMovies(),
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
        <LoadingState message="Loading movies" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-[#141313]">
        <ErrorState message="Error loading movies" />
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
  const allTags = buildMovieTags(currentMovie);

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

      <HeroOverlay variant="strong" />

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
