import { useEffect, useState } from "react";
import api, { imgUrl } from "../services/tmdb";
import requests from "../services/requests";

function truncate(str = "", n = 160) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export default function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await api.get(requests.trending);

        const list = res.data?.results || [];
        if (!list.length) return;

        const pick = list[Math.floor(Math.random() * list.length)];

        if (!alive) return;
        setMovie(pick || null);
      } catch (error) {
        console.error("Banner TMDB error:", error);
        if (!alive) return;
        setMovie(null);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="relative h-[60vh] min-h-[420px] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: movie?.backdrop_path
            ? `url(${imgUrl(movie.backdrop_path, "w1280")})`
            : "none",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-black/40" />

      <div className="relative z-10 px-6 pt-28 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {movie?.title || movie?.name || "Loading..."}
        </h1>

        <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed">
          {truncate(movie?.overview || "", 170)}
        </p>

        <div className="mt-6 flex gap-3">
          <button className="px-6 py-2 rounded bg-white text-black font-semibold hover:bg-white/90">
            Play
          </button>

          <button className="px-6 py-2 rounded bg-white/20 border border-white/20 hover:bg-white/30">
            More Info
          </button>
        </div>
      </div>
    </header>
  );
}
