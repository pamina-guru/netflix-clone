import { useEffect, useState } from "react";
import api, { imgUrl } from "../services/tmdb";

export default function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    if (!movie) return;

    // ✅ lock background scroll when modal open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    async function loadTrailer() {
      try {
        const res = await api.get(`/movie/${movie.id}/videos`);
        const vids = res.data.results || [];
        const trailer =
          vids.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          vids.find((v) => v.site === "YouTube");
        setTrailerKey(trailer?.key || "");
      } catch {
        setTrailerKey("");
      }
    }

    loadTrailer();

    return () => {
      document.body.style.overflow = prev; // ✅ restore scroll
    };
  }, [movie]);

  // ✅ close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (movie) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";

  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-label="Close modal"
      />

      {/* ✅ scrollable wrapper */}
      <div className="absolute inset-0 overflow-y-auto px-4 py-10">
        {/* modal */}
        <div className="relative mx-auto w-full max-w-3xl rounded-xl overflow-hidden bg-[#141414] border border-white/10">
          {/* header image */}
          <div className="relative h-[220px] md:h-[320px]">
            <img
              src={imgUrl(movie.backdrop_path || movie.poster_path, "w1280")}
              className="w-full h-full object-cover"
              alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-black/10" />

            <button
              onClick={onClose}
              className="absolute top-3 right-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 w-10 h-10 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl md:text-3xl font-extrabold">{title}</h3>
            </div>
          </div>

          {/* content */}
          <div className="p-5 md:p-6 space-y-4">
            <div className="text-sm text-white/70">
              Release: {movie.release_date || movie.first_air_date || "N/A"} •
              Rating:{" "}
              {movie.vote_average?.toFixed?.(1) || movie.vote_average || "N/A"}
            </div>

            <p className="text-white/80 leading-relaxed">
              {movie.overview || "No description available."}
            </p>

            {trailerKey ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-sm text-white/60">
                Trailer not available for this movie.
              </div>
            )}

            {/* ✅ extra space so last part isn't stuck under edge */}
            <div className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
